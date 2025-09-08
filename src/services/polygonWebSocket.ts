interface PolygonConfig {
  apiKey: string;
  stocksUrl: string;
  cryptoUrl: string;
  forexUrl: string;
}

interface PolygonQuote {
  symbol: string;
  bid: number;
  ask: number;
  lastPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: number;
}

interface PolygonTrade {
  symbol: string;
  price: number;
  size: number;
  timestamp: number;
  conditions: number[];
}

interface PolygonBar {
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: number;
}

type PolygonMessage = PolygonQuote | PolygonTrade | PolygonBar;

export class PolygonWebSocketService {
  private ws: WebSocket | null = null;
  private config: PolygonConfig | null = null;
  private subscriptions = new Map<string, Set<(data: PolygonMessage) => void>>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;

  constructor() {}

  async connect(config: PolygonConfig): Promise<void> {
    if (this.isConnecting || this.ws?.readyState === WebSocket.OPEN) return;
    
    this.config = config;
    this.isConnecting = true;

    try {
      // Use the standard Polygon WebSocket URL without API key in URL
      const wsUrl = config.stocksUrl;
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('Polygon WebSocket connected');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        
        // Send authentication message with API key
        const authMessage = {
          action: 'auth',
          params: config.apiKey
        };
        
        this.ws?.send(JSON.stringify(authMessage));
        console.log('Sent authentication to Polygon');
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Polygon message received:', data);
          
          if (Array.isArray(data)) {
            data.forEach(message => this.handleMessage(message));
          } else {
            this.handleMessage(data);
          }
        } catch (error) {
          console.error('Error parsing Polygon message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('Polygon WebSocket error:', error);
        this.isConnecting = false;
      };

      this.ws.onclose = (event) => {
        console.log('Polygon WebSocket disconnected. Code:', event.code, 'Reason:', event.reason);
        this.isConnecting = false;
        this.ws = null;
        
        // Only attempt reconnect if it's not a clean close and we haven't exceeded max attempts
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.attemptReconnect();
        }
      };

    } catch (error) {
      console.error('Failed to connect to Polygon WebSocket:', error);
      this.isConnecting = false;
      throw error;
    }
  }

  private handleMessage(message: any) {
    console.log('Processing message:', message);
    
    // Handle connection status messages
    if (message.status) {
      console.log('Polygon status:', message.status, message.message);
      if (message.status === 'auth_success') {
        console.log('Polygon authentication successful');
      } else if (message.status === 'auth_timeout' || message.status === 'auth_failed') {
        console.error('Polygon authentication failed:', message.message);
      }
      return;
    }
    
    if (!message.ev) return; // Skip non-data messages

    const symbol = message.sym || message.pair;
    if (!symbol || !this.subscriptions.has(symbol)) return;

    let processedMessage: PolygonMessage | null = null;

    switch (message.ev) {
      case 'Q': // Quote
        processedMessage = {
          symbol,
          bid: message.bp || 0,
          ask: message.ap || 0,
          lastPrice: message.lp || (message.bp + message.ap) / 2 || 0,
          change: 0, // Calculate based on previous data
          changePercent: 0,
          volume: message.bs + message.as || 0,
          timestamp: message.t || Date.now()
        };
        break;

      case 'T': // Trade
        processedMessage = {
          symbol,
          price: message.p || 0,
          size: message.s || 0,
          timestamp: message.t || Date.now(),
          conditions: message.c || []
        } as PolygonTrade;
        break;

      case 'AM': // Minute bar (aggregated)
      case 'A': // Second bar (aggregated)
        processedMessage = {
          symbol,
          open: message.o || 0,
          high: message.h || 0,
          low: message.l || 0,
          close: message.c || 0,
          volume: message.v || 0,
          timestamp: message.t || Date.now()
        } as PolygonBar;
        break;

      case 'XQ': // Crypto quote
        processedMessage = {
          symbol,
          bid: message.bp || 0,
          ask: message.ap || 0,
          lastPrice: message.lp || 0,
          change: 0,
          changePercent: 0,
          volume: 0,
          timestamp: message.t || Date.now()
        };
        break;

      case 'XT': // Crypto trade
        processedMessage = {
          symbol,
          price: message.p || 0,
          size: message.s || 0,
          timestamp: message.t || Date.now(),
          conditions: []
        } as PolygonTrade;
        break;
    }

    if (processedMessage) {
      const callbacks = this.subscriptions.get(symbol);
      callbacks?.forEach(callback => callback(processedMessage!));
    }
  }

  subscribe(symbol: string, callback: (data: PolygonMessage) => void) {
    if (!this.subscriptions.has(symbol)) {
      this.subscriptions.set(symbol, new Set());
    }
    
    this.subscriptions.get(symbol)!.add(callback);

    // Send subscription message to Polygon
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log(`Subscribing to ${symbol} on Polygon`);
      
      // Subscribe to trades and quotes for the symbol
      const subscribeMessage = {
        action: 'subscribe',
        params: `T.${symbol},Q.${symbol}`
      };
      
      this.ws.send(JSON.stringify(subscribeMessage));
      console.log('Sent subscription:', subscribeMessage);
    } else {
      console.log('WebSocket not ready, subscription queued for', symbol);
    }
  }

  unsubscribe(symbol: string, callback?: (data: PolygonMessage) => void) {
    const callbacks = this.subscriptions.get(symbol);
    if (!callbacks) return;

    if (callback) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.subscriptions.delete(symbol);
      }
    } else {
      this.subscriptions.delete(symbol);
    }

    // Send unsubscription message to Polygon
    if (this.ws?.readyState === WebSocket.OPEN && !this.subscriptions.has(symbol)) {
      this.ws.send(JSON.stringify({
        action: 'unsubscribe',
        params: `T.${symbol},Q.${symbol}`
      }));
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts || !this.config) {
      console.log('Max reconnection attempts reached or no config available');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`Attempting to reconnect to Polygon WebSocket (attempt ${this.reconnectAttempts}) in ${delay}ms`);
    
    setTimeout(() => {
      this.connect(this.config!);
    }, delay);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.subscriptions.clear();
    this.reconnectAttempts = 0;
  }

  getConnectionStatus(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Search service for Polygon stocks and crypto
export class PolygonSearchService {
  private apiKey: string;
  private baseUrl = 'https://api.polygon.io';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchTickers(query: string): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v3/reference/tickers?search=${encodeURIComponent(query)}&active=true&limit=50&apikey=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Polygon API error: ${response.status}`);
      }

      const data = await response.json();
      
      return data.results?.map((ticker: any) => ({
        id: ticker.ticker,
        symbol: ticker.ticker,
        name: ticker.name,
        exchange: ticker.primary_exchange,
        asset_class: ticker.type,
        status: ticker.active ? 'active' : 'inactive'
      })) || [];
    } catch (error) {
      console.error('Polygon search error:', error);
      throw error;
    }
  }

  async getTickerDetails(symbol: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v3/reference/tickers/${symbol}?apikey=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Polygon API error: ${response.status}`);
      }

      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Polygon ticker details error:', error);
      throw error;
    }
  }
}

// Singleton instances
let polygonWS: PolygonWebSocketService | null = null;
let polygonSearch: PolygonSearchService | null = null;

export function initializePolygon(config: PolygonConfig) {
  polygonWS = new PolygonWebSocketService();
  polygonSearch = new PolygonSearchService(config.apiKey);
  
  return {
    polygonWS,
    polygonSearch
  };
}

export function getPolygonWS(): PolygonWebSocketService | null {
  return polygonWS;
}

export function getPolygonSearch(): PolygonSearchService | null {
  return polygonSearch;
}