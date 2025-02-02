// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ScheduleModule } from '@nestjs/schedule';
import { SuperbaseService } from './jobs/providers/superbase.service';
import { JobService } from './jobs/providers/jobs.service';
import { CompanyService } from './jobs/providers/company.service';
import { CityService } from './jobs/providers/city.service';
import { ContractTypeService } from './jobs/providers/contractType.service';
import { IndustryService } from './jobs/providers/industry.service';
import { StateService } from './jobs/providers/state.service';
import { JobFactory } from './jobs/strategies/job-conversion.factory';
import { SkillService } from './jobs/providers/skill.service';
import { JobController } from './jobs/controllers/job/jobs.controller';
import { ApiController } from './jobs/controllers/api/api.controller';
import { ApiService } from './jobs/providers/api.service';
import { JobScheduler } from './jobs/fetching.scheduler';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule.forRoot(), ScheduleModule.forRoot(),HttpModule],
  controllers: [JobController, ApiController],
  providers: [
    SuperbaseService,
    JobService,
    SkillService,
    ApiService,
    CompanyService,
    CityService,
    ContractTypeService,
    IndustryService,
    StateService,
    JobFactory,
    JobScheduler,
  ],
})
export class AppModule {}
