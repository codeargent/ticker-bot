import axios from 'axios';
import * as fs from 'fs';
import { fetchGet, getAverage, calculatePercentageOscillation } from '../src/utils';
import { Ticker } from '../src/dto';

// Mock axios and fs modules
jest.mock('axios');
jest.mock('fs');

describe('fetchGet', () => {
    const mockAxiosGet = axios.get as jest.Mock;
    const mockFsExistsSync = fs.existsSync as jest.Mock;
    const mockFsMkdirSync = fs.mkdirSync as jest.Mock;

    const mockTickerData: Ticker = {
        ask: "1234.56",
        bid: "1230.12",
        currency: 'USD',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return data when the request is successful', async () => {
        mockAxiosGet.mockResolvedValueOnce({ data: mockTickerData });

        const result = await fetchGet('https://api.uphold.com/v0/ticker/BTC-USD');

        expect(result).toEqual(mockTickerData);
        expect(mockAxiosGet).toHaveBeenCalledWith('https://api.uphold.com/v0/ticker/BTC-USD');
    });

    it('should return null and log the error when the request fails', async () => {
        mockFsExistsSync.mockReturnValueOnce(false);

        const result = await fetchGet('https://api.uphold.com/v0/ticker/BTC-USD');

        expect(result).toBeNull();
        expect(mockFsExistsSync).toHaveBeenCalledWith('logs/');
        expect(mockFsMkdirSync).toHaveBeenCalledWith('logs/');
    });

    it('should append to logs without creating folder if logs/ already exists', async () => {
        mockFsExistsSync.mockReturnValueOnce(true);

        const result = await fetchGet('https://api.uphold.com/v0/ticker/BTC-USD');

        expect(result).toBeNull();
        expect(mockFsExistsSync).toHaveBeenCalledWith('logs/');
        expect(mockFsMkdirSync).not.toHaveBeenCalled();
    });
});

describe('getAverage', () => {
    it('should correctly calculate the average of two numbers', () => {
        const result = getAverage(10, 20);
        expect(result).toBe(15);
    });

    it('should work with negative numbers', () => {
        const result = getAverage(-10, -20);
        expect(result).toBe(-15);
    });

    it('should work with mixed positive and negative numbers', () => {
        const result = getAverage(-10, 20);
        expect(result).toBe(5);
    });
});

describe('calculatePercentageOscillation', () => {
    it('should calculate the correct percentage oscillation when the price increases', () => {
        const lastRate = 100;
        const currentRate = 110;
        const result = calculatePercentageOscillation(lastRate, currentRate);
        expect(result).toBeCloseTo(-9.5238, 4);
    });

    it('should calculate the correct percentage oscillation when the price decreases', () => {
        const lastRate = 110;
        const currentRate = 100;
        const result = calculatePercentageOscillation(lastRate, currentRate);
        expect(result).toBeCloseTo(9.5238, 4);
    });

    it('should return 0 when both rates are equal', () => {
        const result = calculatePercentageOscillation(100, 100);
        expect(result).toBe(0);
    });
});
