import { useStore } from '@/store/useStore';
import { processTrade } from './dataProcessor';
import { Symbol } from '@/types';

class BinanceWSService {
  private ws: WebSocket | null = null;
  private symbol: Symbol = 'BTCUSDT';
  private reconnectDelay = 1000;
  private maxDelay = 30000;
  private maxRetries = 10;
  private retryCount = 0;
  private isManualClose = false;

  connect(symbol: Symbol): void {
    this.symbol = symbol;
    this.isManualClose = false;
    this.retryCount = 0;
    this.attemptConnect();
  }

  private attemptConnect(): void {
    const store = useStore.getState();
    store.setWsStatus('connecting');

    const url = `wss://stream.binance.com:9443/ws/${this.symbol.toLowerCase()}@trade`;

    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log(`WebSocket connected to ${this.symbol}`);
        useStore.getState().setWsStatus('connected');
        this.retryCount = 0;
        this.reconnectDelay = 1000;
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          const trade = processTrade(msg);
          useStore.getState().addTrade(trade);
        } catch (err) {
          console.error('Error processing trade:', err);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        useStore.getState().setWsStatus('error');
      };

      this.ws.onclose = () => {
        console.log('WebSocket closed');
        if (!this.isManualClose && this.retryCount < this.maxRetries) {
          this.retryCount++;
          const delay = Math.min(
            this.reconnectDelay * Math.pow(2, this.retryCount - 1),
            this.maxDelay
          );
          console.log(`Reconnecting in ${delay}ms (attempt ${this.retryCount})`);
          setTimeout(() => this.attemptConnect(), delay);
        } else if (this.retryCount >= this.maxRetries) {
          console.error('Max reconnection attempts reached');
          useStore.getState().setWsStatus('error');
        }
      };
    } catch (err) {
      console.error('Failed to create WebSocket:', err);
      useStore.getState().setWsStatus('error');
    }
  }

  disconnect(): void {
    this.isManualClose = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  getStatus(): string {
    return useStore.getState().wsStatus;
  }
}

export const binanceWSService = new BinanceWSService();
