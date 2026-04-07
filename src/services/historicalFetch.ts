import { KlineData, TickerData, TickerSymbol } from '@/types';

const BINANCE_API = 'https://api.binance.com/api/v3';

export async function fetchKlines(
  symbol: TickerSymbol,
  interval: string = '1m',
  limit: number = 500
): Promise<KlineData[]> {
  try {
    const url = `${BINANCE_API}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: number[][] = await response.json();

    return data.map((kline: number[]) => ({
      time: Math.floor(kline[0] / 1000),
      open: kline[1],
      high: kline[2],
      low: kline[3],
      close: kline[4],
      volume: kline[7],
    }));
  } catch (err) {
    console.error('Error fetching klines:', err);
    return [];
  }
}

export async function fetch24hTicker(symbol: TickerSymbol): Promise<TickerData | null> {
  try {
    const url = `${BINANCE_API}/ticker/24hr?symbol=${symbol}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      symbol: data.symbol,
      priceChange: parseFloat(data.priceChange),
      priceChangePercent: parseFloat(data.priceChangePercent),
      quoteAssetVolume: parseFloat(data.quoteAssetVolume),
    };
  } catch (err) {
    console.error('Error fetching 24h ticker:', err);
    return null;
  }
}
