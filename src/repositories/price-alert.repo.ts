import { appDataSource } from "../data-source";
import { PriceAlert } from "../entities/price-alert";

export async function createAlert(
    pair: string,
    currentRate: number,
    lastRate: number,
    oscillation: number,
    threshold: number,
    interval: number
) {
    const alertRepository = appDataSource.getRepository(PriceAlert);
    const alert = new PriceAlert();

    alert.pair = pair;
    alert.currentRate = currentRate;
    alert.lastRate = lastRate;
    alert.oscillation = oscillation;
    alert.threshold = threshold;
    alert.interval = interval;

    await alertRepository.save(alert);
}
