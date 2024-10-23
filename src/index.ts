import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { botConfig } from './bot-config';
import { BotConfig, Ticker } from './dto';
import { ApiLog } from './entities/api-log';
import { PriceAlert } from './entities/price-alert';
import { createAlert } from './repositories/price-alert.repo';
import { calculatePercentageOscillation, fetchGet, getAverage, handleExitSignals } from './utils';
import { appDataSource } from './data-source';

dotenv.config();
const apiUrl = process.env.API_URL;
if (!apiUrl) {
    console.error("Undefined env variable: API_URL");
    process.exit(1);
}

const timeouts: NodeJS.Timeout[] = [];
botConfig.forEach(config => {
    const nodeTimeout = setInterval(() => checkPairPrice(config), config.interval);
    timeouts.push(nodeTimeout);
});

export async function checkPairPrice(config: BotConfig) {
    const alertRepository = appDataSource.getRepository(PriceAlert);
    const lastAlert = await alertRepository.findOne({
        where: { pair: config.pair },
        order: {
            createdAt: 'DESC',
        },
    });
    const lastRate = lastAlert ? lastAlert.currentRate : null;

    const currentPair: Ticker | null = await fetchGet(`${apiUrl}ticker/${config.pair}`);
    if (!currentPair) return;

    const currentRate = getAverage(parseFloat(currentPair.ask), parseFloat(currentPair.bid));

    if (lastRate === null) {
        createAlert(config.pair, currentRate, 0, 0, config.threshold, config.interval)
        console.info(`${config.pair} price rate is currently set to: ${currentRate}\n`);
        return;
    }

    const percentageChange = parseFloat(calculatePercentageOscillation(lastRate, currentRate).toFixed(4));

    if (Math.abs(percentageChange) >= config.threshold) {
        createAlert(config.pair, currentRate, lastRate, percentageChange, config.threshold, config.interval)
        console.warn(`${config.pair} price rate changed by ${percentageChange}%.\n New rate: ${currentRate}\n`);
    }
}

handleExitSignals(timeouts);