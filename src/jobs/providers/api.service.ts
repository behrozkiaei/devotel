// src/job/job.service.ts
import { Injectable, Logger, Inject } from '@nestjs/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { UnifiedJobDto } from '../dto/unified-job.dto';
import { PaginatedResponseDto } from '../dto/paginated-response.dto';
import { JobFilterDto } from '../dto/job-filter.dto';
import { SuperbaseService } from './superbase.service';

@Injectable()
export class ApiService {
  private readonly logger = new Logger(ApiService.name);


  constructor(private configService: ConfigService,  private superabase: SuperbaseService) {
  }
  
  async getJobs(filters: JobFilterDto): Promise<PaginatedResponseDto<UnifiedJobDto>> {
    const supabase = this.superabase.getClient();
    const { page = 1, limit = 10, ...queryFilters } = filters;
    const offset = (page - 1) * limit;
   
    try {
      let query = supabase
        .from('Job')
        .select(`
          jobId,
          title,
          remote,
          experience,
          city,
          state,
          fullAddress:full_address,
          compensation_min,
          compensation_max,
          compensation_currency,
          compensation_salary_range,
          company:company_id (name, website),
          industry:industry_id (name),
          skills:JobSkill (skill:skill_id (name)),
          contractTypes:JobContractType (contractType:contract_type_id (type)),
          postedDate:posted_date
        `)
        .range(offset, offset + limit - 1);

      // Apply filters
      if (queryFilters.title) {
        query = query.ilike('title', `%${queryFilters.title}%`);
      }

      if (queryFilters.location) {
        const [city, state] = queryFilters.location.split(',').map(s => s.trim());
        query = query.or(`city.ilike.%${city}%,state.ilike.%${state || city}%`);
      }

      if (queryFilters.salaryMin || queryFilters.salaryMax) {
        const min = queryFilters.salaryMin || 0;
        const max = queryFilters.salaryMax || Number.MAX_SAFE_INTEGER;
        query = query.gte('compensation_min', min).lte('compensation_max', max);
      }
      if (queryFilters.company) {
        query = query.ilike('company.name', `%${queryFilters.company}%`);
      }
  
      if (queryFilters.skills?.length) {
        query = query.contains('skills.skill.name', queryFilters.skills);
      }
  
      if (queryFilters.contractTypes?.length) {
        query = query.contains('contractTypes.contractType.type', queryFilters.contractTypes);
      }
      const { data, error, count } = await query;

      if (error) {
        this.logger.error(`Supabase error: ${error.message}`);
        throw new Error('Failed to fetch jobs from database');
      }

      const jobs = data.map(job => this.mapToUnifiedJobDto(job));

      return new PaginatedResponseDto({
        data: jobs,
        total: count ?? 0,
        page,
        limit,
        totalPages: Math.ceil(count! / limit)
      });

    } catch (error) {
      this.logger.error(`Failed to fetch jobs: ${error.message}`);
      throw error;
    }
  }

  private mapToUnifiedJobDto(job: any): UnifiedJobDto {
    return {
      jobId: job.jobId,
      title: job.title,
      remote: job.remote,
      experience: job.experience,
      city: job.city,
      state: job.state,
      fullAddress: job.fullAddress,
      contractType: job.contractTypes.map(ct => ct.contractType.type),
      compensation: {
        min: job.compensation_min,
        max: job.compensation_max,
        currency: job.compensation_currency,
        salaryRange: job.compensation_salary_range
      },
      company: {
        name: job.company.name,
        website: job.company.website
      },
      industry: job.industry.name,
      skills: job.skills.map(s => s.skill.name),
      postedDate: job.postedDate
    };
  }
}