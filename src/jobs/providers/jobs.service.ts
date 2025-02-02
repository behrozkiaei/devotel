// job.service.ts
import { Injectable } from '@nestjs/common';
import { UnifiedJobDto } from '../dto/unified-job.dto';
import { JobConversionFactory } from '../strategies/job-conversion.factory';


@Injectable()
export class JobService {
  async getUnifiedJobs(apiResponse: any): Promise<UnifiedJobDto[]> {
    const strategy = JobConversionFactory.getConversionStrategy(apiResponse);
    return strategy.convert(apiResponse);
  }
}