import { useStore } from '@/store/useStore';
import { processTrade } from './dataProcessor';
import { Symbol } from '@/types';

class BinanceWSService {
  private ws: WebSocket | null = null;
  private symbol: Symbol = 'BTCUSDT';
  private reconnectDelay = 1000;
  private readonly maxDelay = 30000;
  private readonly maxRetries = 10;
  private retryCount = 0;
  private isManualClose = false;
  // FIX #1 — store the timeout ID so it can be cancelled
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  connect(symbol: Symbol): void {
    // FIX #3 — always close existing socket before opening a new one
    // prevents orphaned sockets when switching symbols
    this.disconnect();

    this.symbol = symbol;
    this.isManualClose = false; // reset after disconnect() sets it true
    this.retryCount = 0;
    this.reconnectDelay = 1000;
    this.attemptConnect();
  }

  private attemptConnect(): void {
    // Guard: never reconnect if a manual close was requested
    // This check catches the case where the ghost timeout fires
    // after disconnect() was already called
    if (this.isManualClose) return;

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
          // FIX #5 — processTrade now returns null on invalid messages
          const trade = processTrade(msg);
          if (trade) {
            useStore.getState().addTrade(trade);
          }
        } catch (err) {
          // Safe to ignore: one bad message should not kill the connection
          console.error('Error processing trade message:', err);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        useStore.getState().setWsStatus('error');
      };

      this.ws.onclose = () => {
        console.log('WebSocket closed');

        // FIX #4 — set status to 'disconnected' on intentional close
        // previously status was left stuck at 'connected' in the UI
        if (this.isManualClose) {
          useStore.getState().setWsStatus('disconnected');
          return;
        }

        if (this.retryCount < this.maxRetries) {
          this.retryCount++;
          const delay = Math.min(
            this.reconnectDelay * Math.pow(2, this.retryCount - 1),
            this.maxDelay
          );
          console.log(`Reconnecting in ${delay}ms (attempt ${this.retryCount}/${this.maxRetries})`);

          // FIX #1 — store the timer ID so disconnect() can cancel it
          this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            this.attemptConnect();
          }, delay);
        } else {
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

    // FIX #1 — cancel any pending reconnect timer before it fires
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    // FIX #4 — immediately reflect the disconnected state in the store
    useStore.getState().setWsStatus('disconnected');
  }

  getStatus(): string {
    return useStore.getState().wsStatus;
  }
}

export const binanceWSService = new BinanceWSService();
