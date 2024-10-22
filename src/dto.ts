export interface Ticker {
    ask: string;
    bid: string;
    currency: string;
}

export interface BotConfig {
    pair: string;
    threshold: number;
    interval: number;
}

export interface RuntimeData {
    nodeTimeout: NodeJS.Timeout;
    lastRate: number | null;
}