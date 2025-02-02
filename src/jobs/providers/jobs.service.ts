import { Injectable } from '@nestjs/common';
import { StateService } from './state.service';
import { CityService } from './city.service';
import { CompanyService } from './company.service';
import { IndustryService } from './industry.service';
import { SkillService } from './skill.service';
import { SuperbaseService } from './superbase.service';
import { ContractTypeService } from './contractType.service';
import { UnifiedJobDto } from '../dto/unified-job.dto';

@Injectable()
export class JobService {
  constructor(
    private readonly stateService: StateService,
    private readonly cityService: CityService,
    private readonly companyService: CompanyService,
    private readonly industryService: IndustryService,
    private readonly skillService: SkillService,
    private readonly contractTypeService: ContractTypeService,
    private readonly supabaseService: SuperbaseService,
  ) {}

  async insertJob(dto: UnifiedJobDto) {
    const supabase = this.supabaseService.getClient();
    const {
      jobId,
      title,
      remote,
      experience,
      city,
      state,
      fullAddress,
      contractType,
      compensation,
      company,
      industry,
      skills,
      postedDate,
    } = dto;

    // Check if the job already exists
    const { data: existingJob, error: existingJobError } = await supabase
      .from('Job')
      .select('jobId')
      .eq('jobId', jobId)
      .single();

    if (existingJobError) throw existingJobError;
    if (existingJob) return; // Job already exists, no need to insert

    const dbState = await this.stateService.findOrCreate(state);
    const dbCity = await this.cityService.findOrCreate(city, dbState.id!);
    const dbCompany = await this.companyService.findOrCreate(company);
    const dbIndustry = await this.industryService.findOrCreate(industry);

    // Create and save job
    const { data: job, error: jobError } = await supabase
      .from('Job')
      .insert({
        jobId,
        title,
        remote,
        experience,
        city_id: dbCity.id,
        full_address: fullAddress,
        compensation_min: compensation.min,
        compensation_max: compensation.max,
        compensation_currency: compensation.currency,
        compensation_salary_range: compensation.salaryRange,
        company_id: dbCompany.id,
        industry_id: dbIndustry.id,
        posted_date: new Date(postedDate),
      })
      .select()
      .single();

    if (jobError) throw jobError;

    // Ensure contract types exist or insert and relate to job
    for (const type of contractType) {
      const dbContractType = await this.contractTypeService.findOrCreate(type);
      const { error: jobContractTypeError } = await supabase
        .from('JobContractType')
        .insert({ job_id: job.jobId, contract_type_id: dbContractType.id });

      if (jobContractTypeError) throw jobContractTypeError;
    }

    // Ensure skills exist or insert and relate to job
    for (const skill of skills) {
      const dbSkill = await this.skillService.findOrCreate(skill);
      const { error: jobSkillError } = await supabase
        .from('JobSkill')
        .insert({ job_id: job.jobId, skill_id: dbSkill.id });

      if (jobSkillError) throw jobSkillError;
    }
  }
}
