import { getPolygonWS } from "@/services/polygonWebSocket";
import { supabase } from "@/integrations/supabase/client";

const configurationData = {
    supported_resolutions: ["1S", "5S", "15S", "30S", "1", "5", "15", "30", "60", "240", "1D", "1W", "1M"],
    supports_marks: false,
    supports_timescale_marks: false,
    supports_time: true,
};

const lastBarsCache = new Map();

export const createDatafeed = () => ({
    onReady: (callback: (config: any) => void) => {
        console.log('[onReady]: Method call');
        setTimeout(() => callback(configurationData), 0);
    },

    searchSymbols: async (userInput: string, exchange: string, symbolType: string, onResultReadyCallback: (results: any[]) => void) => {
        onResultReadyCallback([]);
    },

    resolveSymbol: async (symbolName: string, onSymbolResolvedCallback: (symbolInfo: any) => void, onResolveErrorCallback: (error: string) => void) => {
        console.log('[resolveSymbol]: Method call', symbolName);
        const symbol = symbolName.split(':')[1] || symbolName; // Get symbol part from e.g., NASDAQ:AAPL
        const symbolInfo = {
            ticker: symbolName,
            name: symbol,
            description: symbol,
            type: 'stock',
            session: '24x7',
            timezone: 'Etc/UTC',
            exchange: '',
            minmov: 1,
            pricescale: 100000,
            has_intraday: true,
            has_seconds: true,
            supported_resolutions: configurationData.supported_resolutions,
            volume_precision: 8,
            data_status: 'streaming',
        };
        onSymbolResolvedCallback(symbolInfo);
    },

    getBars: async (symbolInfo: any, resolution: string, periodParams: any, onHistoryCallback: (bars: any[], meta: { noData: boolean }) => void, onErrorCallback: (error: any) => void) => {
        const { from, to, firstDataRequest } = periodParams;
        console.log('[getBars]: Method call for history', symbolInfo.name, resolution);

        try {
            const { data, error } = await supabase.functions.invoke('polygon-history', {
                body: {
                    symbol: symbolInfo.name,
                    from: Math.round(from * 1000),
                    to: Math.round(to * 1000),
                    resolution: resolution
                }
            });

            if (error) {
                console.error('History fetch error:', error);
                onErrorCallback(error);
                return;
            }

            if (!data || data.length === 0) {
                onHistoryCallback([], { noData: true });
                return;
            }

            onHistoryCallback(data, { noData: false });
        } catch (e) {
            console.error('Exception fetching history:', e);
            onErrorCallback(e);
        }
    },

    subscribeBars: (symbolInfo: any, resolution: string, onRealtimeCallback: (bar: any) => void, subscriberUID: string, onResetCacheNeededCallback: () => void) => {
        console.log('[subscribeBars]: Method call with subscriberUID:', subscriberUID);
        
        const polygonWS = getPolygonWS();
        if (!polygonWS) {
            console.error("Polygon WebSocket not available");
            return;
        }

        const newSub = (data: any) => {
            // FIX: Use 'ev' for the event type, not 'T'
            if (data.ev !== 'T' && data.ev !== 'XT') { 
                return;
            }

            const tradeTime = data.t;
            const tradePrice = data.p;
            const tradeVolume = data.s;

            const lastBar = lastBarsCache.get(subscriberUID);

            // Determine interval in milliseconds
            let interval = 60000; // Default to 1 minute
            if (resolution.endsWith('S')) {
                interval = parseInt(resolution.slice(0, -1), 10) * 1000;
            } else if (!isNaN(parseInt(resolution, 10))) {
                interval = parseInt(resolution, 10) * 60 * 1000;
            }

            if (!lastBar || tradeTime >= lastBar.time + interval) {
                const barTime = Math.floor(tradeTime / interval) * interval;
                const newBar = {
                    time: barTime,
                    open: tradePrice,
                    high: tradePrice,
                    low: tradePrice,
                    close: tradePrice,
                    volume: tradeVolume,
                };
                lastBarsCache.set(subscriberUID, newBar);
                onRealtimeCallback(newBar);
            } else {
                lastBar.high = Math.max(lastBar.high, tradePrice);
                lastBar.low = Math.min(lastBar.low, tradePrice);
                lastBar.close = tradePrice;
                lastBar.volume += tradeVolume;
                onRealtimeCallback(lastBar);
            }
        };

        polygonWS.subscribe(symbolInfo.name, newSub);
    },

    unsubscribeBars: (subscriberUID: string) => {
        console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
        lastBarsCache.delete(subscriberUID);
    },
});