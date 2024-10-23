import axios from "axios";
import { Ticker } from "./dto";
import { createApiLog } from "./repositories/api-log.repo";

export async function fetchGet(path: string): Promise<Ticker | null> {
    let data: Ticker | null = null;

    try {
        const res = await axios.get(path);
        data = res.data satisfies Ticker;
    } catch (error) {
        console.error(`error while fetching: ${path}`);
        createApiLog(path, JSON.stringify(error));
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
    const rateDifference = lastRate - currentRate;
    const midpoint = getAverage(lastRate, currentRate);
    return (rateDifference / midpoint) * 100;
}

export function handleExitSignals(nodeTimeouts: NodeJS.Timeout[]) {
    process.on('SIGINT', () => {
        console.log("Received termination signal: SIGINT");
        nodeTimeouts.forEach((nodeTimeout) => clearInterval(nodeTimeout));
        process.exit(0);
    });

    process.on('SIGTERM', () => {
        console.log("Received termination signal: SIGTERM");
        nodeTimeouts.forEach((nodeTimeout) => clearInterval(nodeTimeout));
        process.exit(0);
    });
}