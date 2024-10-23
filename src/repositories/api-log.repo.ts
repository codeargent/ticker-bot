import { appDataSource } from "../data-source";
import { ApiLog } from "../entities/api-log";

export async function createApiLog(path: string, log: string) {
    const apiLogRepository = appDataSource.getRepository(ApiLog);
    const apiLog = new ApiLog();

    apiLog.path = path;
    apiLog.log = log;

    await apiLogRepository.save(apiLog);
}