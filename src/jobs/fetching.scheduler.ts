// src/scheduler/job-scheduler.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CronJob } from 'cron';
import { UnifiedJobDto } from './dto/unified-job.dto';
import { JobFactory } from './strategies/job-conversion.factory';

@Injectable()
export class JobScheduler {
  private readonly logger = new Logger(JobScheduler.name);
  
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry
  ) {}

  async onApplicationBootstrap() {
    await this.configureDynamicScheduler();
  }

  private async configureDynamicScheduler() {
    const frequency = this.configService.get<string>('FETCH_FREQUENCY', '0 */10 * * * *');
    
    const job = new CronJob(frequency, async () => {
      await this.fetchAndProcessJobs();
    });

    this.schedulerRegistry.addCronJob('api-fetch-job', job);
    job.start();
    
    this.logger.log(`Scheduled job with frequency: ${frequency}`);
  }

  private async fetchAndProcessJobs(): Promise<UnifiedJobDto[]> {
    try {
      const apiUrls = [
        this.configService.get<string>('API1_URL'),
        this.configService.get<string>('API2_URL')
      ];

      const allJobs: UnifiedJobDto[] = [];
      
      for (const url of apiUrls) {
        try {
          const response = await firstValueFrom(this.httpService.get(url!));
          const jobs = JobFactory.createFromAnyResponse(response.data);
          allJobs.push(...jobs);
          this.logger.log(`Processed ${jobs.length} jobs from ${url}`);
        } catch (error) {
          this.logger.error(`Failed to fetch from ${url}: ${error.message}`);
        }
      }

      // Here you would typically call your controller/service to process the unified jobs
      // Example: this.jobController.processJobs(allJobs);
      
      this.logger.log(`Total jobs processed: ${allJobs.length}`);
      return allJobs;
    } catch (error) {
      this.logger.error(`Job fetch failed: ${error.message}`);
      return [];
    }
  }
}