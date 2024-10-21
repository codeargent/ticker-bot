import axios from "axios";
import { Ticker } from "./dto";

export async function fetchGet(path: string): Promise<Ticker | null> {
    let data: Ticker | null = null;

    try {
        const res = await axios.get(path);
        data = res.data satisfies Ticker;
    } catch (error) {
        console.error(`error while fetching (${path}):`, JSON.stringify(error));
        return null;
    }

    return data;
}

export function getAverage(value1: number, value2: number): number {
    return (value1 + value2) / 2;
}

/**
 * The percentage oscillation is get by the following
 * 
 * The division between:
 * - The rates difference (lastRate - currentRate -> negative result when price increases)
 * - The rates midpoint/average
 * Times 100 to get the percentage
 * 
 * @param lastRate number
 * @param currentRate number
 * @returns number
 */
export function calculatePercentageOscillation(lastRate: number, currentRate: number): number {
    return ((lastRate - currentRate) / getAverage(lastRate, currentRate)) * 100;
}

export function stopBot(nodeTimeout: NodeJS.Timeout, message: string, isError: boolean) {
    clearInterval(nodeTimeout);

    if (isError) {
        console.error(message)
        process.exit(1);
    } else {
        console.log(message)
        process.exit(0);
    }
}