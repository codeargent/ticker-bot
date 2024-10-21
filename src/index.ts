import { calculatePercentageChange, fetchGet, stopBot } from './utils';
import dotenv from 'dotenv';

let nodeTimeout: NodeJS.Timeout;
let lastAskValue: number | null = null;
const ALERT_THRESHOLD_PERCENTAGE = 0.01;
const INTERVAL = 5000;

async function checkPairPrice() {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
        return stopBot(nodeTimeout, "Undefined env variable: API_URL", true);
    }

    const currentAskValue: number | null = await fetchGet(apiUrl + "ticker/BTC-USD");

    if (!currentAskValue) {
        return;
    }

    if (lastAskValue === null) {
        lastAskValue = currentAskValue;
        console.info(`BTC-USD price is currently set to: ${currentAskValue}\n`);
        return;
    }

    const percentageChange = calculatePercentageChange(currentAskValue, lastAskValue);

    if (Math.abs(percentageChange) >= ALERT_THRESHOLD_PERCENTAGE) {
        console.warn(`BTC-USD price changed by ${percentageChange.toFixed(4)}%.\n New price: ${currentAskValue}\n`);
        lastAskValue = currentAskValue;
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