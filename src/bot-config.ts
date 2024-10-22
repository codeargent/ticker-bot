import { BotConfig } from "./dto";

export const botConfig: BotConfig[] = [
    {
        "pair": "BTC-USD",
        "threshold": 0.05,
        "interval": 10000
    },
    {
        "pair": "ETH-USD",
        "threshold": 0.025,
        "interval": 5000
    }
]