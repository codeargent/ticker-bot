import { RuntimeData } from '../src/dto';
import { fetchGet, getAverage, calculatePercentageOscillation, handleExitSignals } from './../src/utils';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.spyOn(global.process, 'exit').mockImplementation(() => { return undefined as never });
const mockClearInterval = jest.spyOn(global, 'clearInterval');

describe('Utils Tests', () => {
    afterEach(() => {
        mockClearInterval.mockClear();
    });

    it('should fetch ticker data successfully', async () => {
        const mockTicker = { ask: '1234.56', bid: '1230.12', currency: 'USD' };
        mockedAxios.get.mockResolvedValue({ data: mockTicker });

        const result = await fetchGet('https://api.example.com/ticker/BTC-USD');
        expect(result).toEqual(mockTicker);
    });

    it('should return null on fetch failure', async () => {
        mockedAxios.get.mockRejectedValue(new Error('Bad Request'));
        const result = await fetchGet('https://api.example.com/ticker/BTC-USD');
        expect(result).toBeNull();
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
        const runtimeData: Record<string, RuntimeData> = {
            'BTC-USD': { nodeTimeout: setInterval(() => { }, 10000), lastRate: null }
        };

        handleExitSignals(runtimeData);
        process.emit('SIGINT');
        process.emit('SIGTERM');

        expect(mockClearInterval).toHaveBeenCalledTimes(2);
        expect(process.exit).toHaveBeenCalledWith(0);
    });
});
