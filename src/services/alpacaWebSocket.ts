interface AlpacaConfig {
  apiKey: string;
  secretKey: string;
  baseUrl?: string;
  dataUrl?: string;
}

interface BarData {
  T: string; // message type
  S: string; // symbol
  o: number; // open
  h: number; // high
  l: number; // low
  c: number; // close
  v: number; // volume
  t: string; // timestamp
}

interface QuoteData {
  T: string; // message type
  S: string; // symbol
  bx: string; // bid exchange
  bp: number; // bid price
  bs: number; // bid size
  ax: string; // ask exchange
  ap: number; // ask price
  as: number; // ask size
  t: string; // timestamp
}

interface TradeData {
  T: string; // message type
  S: string; // symbol
  p: number; // price
  s: number; // size
  t: string; // timestamp
  x: string; // exchange
}

type AlpacaMessage = BarData | QuoteData | TradeData;

export class AlpacaWebSocketService {
  private ws: WebSocket | null = null;
  private config: AlpacaConfig;
  private subscribers: Map<string, Set<(data: AlpacaMessage) => void>> = new Map();
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(config: AlpacaConfig) {
    this.config = {
      ...config,
      dataUrl: config.dataUrl || 'wss://stream.data.alpaca.markets/v2/iex'
    };
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.config.dataUrl!);
        
        this.ws.onopen = () => {
          console.log('Alpaca WebSocket connected');
          this.authenticate();
        };

        this.ws.onmessage = (event) => {
          try {
            const messages = JSON.parse(event.data);
            if (Array.isArray(messages)) {
              messages.forEach(msg => this.handleMessage(msg));
            } else {
              this.handleMessage(messages);
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onclose = () => {
          console.log('Alpaca WebSocket disconnected');
          this.isConnected = false;
          this.attemptReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('Alpaca WebSocket error:', error);
          reject(error);
        };

        // Set up authentication success listener
        const authHandler = (msg: any) => {
          if (msg.T === 'success' && msg.msg === 'authenticated') {
            this.isConnected = true;
            this.reconnectAttempts = 0;
            resolve();
          } else if (msg.T === 'error') {
            reject(new Error(msg.msg));
          }
        };

        // Temporary listener for authentication
        const originalHandler = this.handleMessage.bind(this);
        this.handleMessage = (msg: any) => {
          authHandler(msg);
          originalHandler(msg);
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  private authenticate() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const authMessage = {
        action: 'auth',
        key: this.config.apiKey,
        secret: this.config.secretKey
      };
      this.ws.send(JSON.stringify(authMessage));
    }
  }

  private handleMessage(message: any) {
    if (message.T === 'success' || message.T === 'error') {
      // Handle system messages
      return;
    }

    // Handle data messages
    if (message.S && this.subscribers.has(message.S)) {
      const symbolSubscribers = this.subscribers.get(message.S);
      symbolSubscribers?.forEach(callback => callback(message));
    }
  }

  subscribe(symbol: string, callback: (data: AlpacaMessage) => void) {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set());
    }
    this.subscribers.get(symbol)!.add(callback);

    // Subscribe to quotes and trades for the symbol
    if (this.isConnected && this.ws) {
      const subscribeMessage = {
        action: 'subscribe',
        quotes: [symbol],
        trades: [symbol]
      };
      this.ws.send(JSON.stringify(subscribeMessage));
    }
  }

  unsubscribe(symbol: string, callback?: (data: AlpacaMessage) => void) {
    if (callback && this.subscribers.has(symbol)) {
      this.subscribers.get(symbol)!.delete(callback);
      if (this.subscribers.get(symbol)!.size === 0) {
        this.subscribers.delete(symbol);
      }
    } else {
      this.subscribers.delete(symbol);
    }

    // Unsubscribe from WebSocket if no more subscribers
    if (!this.subscribers.has(symbol) && this.isConnected && this.ws) {
      const unsubscribeMessage = {
        action: 'unsubscribe',
        quotes: [symbol],
        trades: [symbol]
      };
      this.ws.send(JSON.stringify(unsubscribeMessage));
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        this.connect().catch(error => {
          console.error('Reconnection failed:', error);
        });
      }, delay);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.subscribers.clear();
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

// Stock search functionality
export class AlpacaStockSearch {
  private config: AlpacaConfig;

  constructor(config: AlpacaConfig) {
    this.config = {
      ...config,
      baseUrl: config.baseUrl || 'https://paper-api.alpaca.markets'
    };
  }

  async searchStocks(query: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.config.baseUrl}/v2/assets?search=${encodeURIComponent(query)}&status=active&asset_class=us_equity`, {
        headers: {
          'APCA-API-KEY-ID': this.config.apiKey,
          'APCA-API-SECRET-KEY': this.config.secretKey
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.slice(0, 20); // Limit to 20 results
    } catch (error) {
      console.error('Error searching stocks:', error);
      return [];
    }
  }

  async getStockQuote(symbol: string): Promise<any> {
    try {
      const response = await fetch(`${this.config.baseUrl}/v2/stocks/${symbol}/quotes/latest`, {
        headers: {
          'APCA-API-KEY-ID': this.config.apiKey,
          'APCA-API-SECRET-KEY': this.config.secretKey
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching stock quote:', error);
      return null;
    }
  }
}

// Create singleton instances (will be initialized with actual keys later)
let alpacaWS: AlpacaWebSocketService | null = null;
let alpacaSearch: AlpacaStockSearch | null = null;

export const initializeAlpaca = (config: AlpacaConfig) => {
  alpacaWS = new AlpacaWebSocketService(config);
  alpacaSearch = new AlpacaStockSearch(config);
  return { alpacaWS, alpacaSearch };
};

export const getAlpacaWS = () => alpacaWS;
export const getAlpacaSearch = () => alpacaSearch;