import { botConfig } from './bot-config';
import { BotConfig, RuntimeData, Ticker } from './dto';
import { calculatePercentageOscillation, fetchGet, getAverage, handleExitSignals } from './utils';
import dotenv from 'dotenv';

dotenv.config();
const apiUrl = process.env.API_URL;
if (!apiUrl) {
    console.error("Undefined env variable: API_URL");
    process.exit(1);
}

const runtimeData: Record<string, RuntimeData> = {};
botConfig.forEach(config => {
    const nodeTimeout = setInterval(() => checkPairPrice(config), config.interval);
    runtimeData[config.pair] = {
        nodeTimeout,
        lastRate: null
    };
});

export async function checkPairPrice(config: BotConfig) {
    let lastRate: number | null = runtimeData[config.pair].lastRate;
    const currentPair: Ticker | null = await fetchGet(`${apiUrl}ticker/${config.pair}`);

    if (!currentPair) return;

    const currentRate = getAverage(parseFloat(currentPair.ask), parseFloat(currentPair.bid));

    if (lastRate === null) {
        runtimeData[config.pair].lastRate = currentRate;
        console.info(`${config.pair} price rate is currently set to: ${currentRate}\n`);
        return;
    }

    const percentageChange = calculatePercentageOscillation(lastRate, currentRate);

    if (Math.abs(percentageChange) >= config.threshold) {
        runtimeData[config.pair].lastRate = currentRate;
        console.warn(`${config.pair} price rate changed by ${percentageChange.toFixed(4)}%.\n New rate: ${currentRate}\n`);
    }
}

handleExitSignals(runtimeData);