import { Ticker } from './dto';
import { calculatePercentageOscillation, fetchGet, getAverage, stopBot } from './utils';
import dotenv from 'dotenv';

let nodeTimeout: NodeJS.Timeout;
let lastRate: number | null = null;
const ALERT_THRESHOLD_PERCENTAGE = 0.01;
const INTERVAL = 5000;

async function checkPairPrice() {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
        return stopBot(nodeTimeout, "Undefined env variable: API_URL", true);
    }

    const currentPair: Ticker | null = await fetchGet(apiUrl + "ticker/BTC-USD");

    if (!currentPair) {
        return;
    }

    const currentRate: number = getAverage(parseFloat(currentPair.ask), parseFloat(currentPair.bid));

    if (lastRate === null) {
        lastRate = currentRate;
        console.info(`BTC-USD price rate is currently set to: ${currentRate}\n`);
        return;
    }

    const percentageChange = calculatePercentageOscillation(lastRate, currentRate);

    if (Math.abs(percentageChange) >= ALERT_THRESHOLD_PERCENTAGE) {
        console.warn(`BTC-USD price rate changed by ${percentageChange.toFixed(4)}%.\n New rate: ${currentRate}\n`);
        lastRate = currentRate;
    }
}

dotenv.config();
nodeTimeout = setInterval(checkPairPrice, INTERVAL);

process.on('SIGINT', () => {
    stopBot(nodeTimeout, "Received termination signal: SIGINT", false);
});

process.on('SIGTERM', () => {
    stopBot(nodeTimeout, "Received termination signal: SIGTERM", false);
});