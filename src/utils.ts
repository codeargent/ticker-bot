import axios from "axios";
import { Ticker } from "./dto";

export async function fetchGet(path: string): Promise<number | null> {
    let data: Ticker;

    try {
        const res = await axios.get(path);
        data = res.data satisfies Ticker;
    } catch (error) {
        console.error(`error while fetching (${path}):`, JSON.stringify(error));
        return null;
    }

    return parseFloat(data.ask);
}

export function calculatePercentageChange(currentAskValue: number, lastAskValue: number): number {
    return ((currentAskValue - lastAskValue) / lastAskValue) * 100;
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