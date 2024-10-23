// import axios from 'axios';
// import { calculatePercentageOscillation, fetchGet, getAverage, handleExitSignals } from './../src/utils';

// jest.mock('axios');
// const mockedAxios = axios as jest.Mocked<typeof axios>;

// jest.spyOn(global.process, 'exit').mockImplementation(() => { return undefined as never });
// const mockClearInterval = jest.spyOn(global, 'clearInterval');

// describe('Utils Tests', () => {
//     afterEach(() => {
//         mockClearInterval.mockClear();
//     });

//     it('should fetch ticker data successfully', async () => {
//         const mockTicker = { ask: '1234.56', bid: '1230.12', currency: 'USD' };
//         mockedAxios.get.mockResolvedValue({ data: mockTicker });

//         const result = await fetchGet('https://api.example.com/ticker/BTC-USD');
//         expect(result).toEqual(mockTicker);
//     });

//     it('should return null on fetch failure', async () => {
//         mockedAxios.get.mockRejectedValue(new Error('Bad Request'));
//         const result = await fetchGet('https://api.example.com/ticker/BTC-USD');
//         expect(result).toBeNull();
//     });

//     it('should correctly calculate the average of two numbers', () => {
//         expect(getAverage(1234.56, 1230.12)).toBe(1232.34);
//         expect(getAverage(987, 999)).toBe(993);
//     });

//     it('should calculate percentage oscillation', () => {
//         const lastRate = 1232.34;
//         const currentRate = 993;
//         const result = calculatePercentageOscillation(lastRate, currentRate);
//         expect(result).toBeCloseTo(21.51, 2);
//     });

//     it('should handle termination signals and clear intervals', () => {
//         const nodeTimeouts: NodeJS.Timeout[] = [
//             setInterval(() => { }, 10000),
//         ];

//         handleExitSignals(nodeTimeouts);
//         process.emit('SIGINT');
//         process.emit('SIGTERM');

//         expect(mockClearInterval).toHaveBeenCalledTimes(2);
//         expect(process.exit).toHaveBeenCalledWith(0);
//     });
// });

import axios from 'axios';
import { fetchGet, handleExitSignals, getAverage, calculatePercentageOscillation } from './../src/utils';
import { createApiLog } from './../src/repositories/api-log.repo';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock createApiLog 
jest.mock('./../src/repositories/api-log.repo', () => ({
    createApiLog: jest.fn(),
}));

jest.spyOn(global.process, 'exit').mockImplementation(() => { return undefined as never });
const mockClearInterval = jest.spyOn(global, 'clearInterval');

describe('Utils Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch ticker data successfully', async () => {
        const mockTicker = { ask: '1234.56', bid: '1100.11', currency: 'BTC-USD' };
        mockedAxios.get.mockResolvedValue({ data: mockTicker });

        const result = await fetchGet('https://api.example.com/ticker/BTC-USD');
        expect(result).toEqual(mockTicker);

        expect(createApiLog).toHaveBeenCalledTimes(0);
    });

    it('should return null and log error on fetch failure', async () => {
        mockedAxios.get.mockRejectedValue(new Error('Bad Request'));

        const result = await fetchGet('https://api.example.com/ticker/BTC-USD');
        expect(result).toBeNull();

        expect(createApiLog).toHaveBeenCalledWith('https://api.example.com/ticker/BTC-USD', '{}');
    });

    it('should correctly calculate the average of two numbers', () => {
        expect(getAverage(1234.56, 1230.12)).toBe(1232.34);
        expect(getAverage(987, 999)).toBe(993);
    });

    it('should calculate percentage oscillation', () => {
        const lastRate = 1232.34;
        const currentRate = 993;
        const result = calculatePercentageOscillation(lastRate, currentRate);
        expect(result).toBeCloseTo(21.51, 2);
    });

    it('should handle termination signals and clear intervals', () => {
        const nodeTimeouts: NodeJS.Timeout[] = [
            setInterval(() => { }, 10000),
        ];

        handleExitSignals(nodeTimeouts);
        process.emit('SIGINT');
        process.emit('SIGTERM');

        expect(mockClearInterval).toHaveBeenCalledTimes(2);
        expect(process.exit).toHaveBeenCalledWith(0);
    });
});
