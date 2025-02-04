// src/job/job.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, In } from 'typeorm';
import { City, Company, ContractType, Job, Skill } from '../entity/jobs.entity';
import { JobFilterDto } from '../dto/job-filter.dto';
import { CustomLoggerService } from '../../common/services/logger.service';

@Injectable()
export class ApiService {
  private readonly logger: CustomLoggerService;

  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(ContractType)
    private readonly contractTypeRepository: Repository<ContractType>,
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {
    this.logger = new CustomLoggerService(ApiService.name);
  }

  async getJobs(filter: JobFilterDto): Promise<{ data: Job[]; total: number }> {
    try {
      this.logger.debug(`Fetching jobs with filters: ${JSON.stringify(filter)}`);
      
      const {
        title,
        location,
        salaryMin,
        salaryMax,
        company,
        skills,
        contractTypes,
        page = 1,
        limit = 10,
      } = filter;

      const query = this.jobRepository
        .createQueryBuilder('job')
        .leftJoinAndSelect('job.city', 'city')
        .leftJoinAndSelect('job.company', 'company')
        .leftJoinAndSelect('job.jobContractTypes', 'jobContractType')
        .leftJoinAndSelect('jobContractType.contractType', 'contractType')
        .leftJoinAndSelect('job.jobSkills', 'jobSkill')
        .leftJoinAndSelect('jobSkill.skill', 'skill')
        .take(limit)
        .skip((page - 1) * limit);

      if (title) {
        query.andWhere('job.title LIKE :title', { title: `%${title}%` });
      }

      if (location) {
        query.andWhere('city.name LIKE :location', { location: `%${location}%` });
      }

      if (salaryMin !== undefined && salaryMax !== undefined) {
        query.andWhere('job.compensation_min BETWEEN :salaryMin AND :salaryMax', {
          salaryMin,
          salaryMax,
        });
      } else if (salaryMin !== undefined) {
        query.andWhere('job.compensation_min >= :salaryMin', { salaryMin });
      } else if (salaryMax !== undefined) {
        query.andWhere('job.compensation_max <= :salaryMax', { salaryMax });
      }

      if (company) {
        query.andWhere('company.name LIKE :company', { company: `%${company}%` });
      }

      if (skills) {
        const skillsArray = Array.isArray(skills) ? skills : [skills];
        if (skillsArray.length > 0) {
          query.andWhere('skill.name IN (:...skills)', { skills: skillsArray });
        }
      }

      if (contractTypes) {
        const contractTypesArray = Array.isArray(contractTypes) ? contractTypes : [contractTypes];
        if (contractTypesArray.length > 0) {
          query.andWhere('contractType.type IN (:...contractTypes)', {
            contractTypes: contractTypesArray,
          });
        }
      }

      const [data, total] = await query.getManyAndCount();
      
      this.logger.debug(`Found ${total} jobs matching the criteria`);
      return { data, total };
    } catch (error) {
      this.logger.error(
        `Failed to fetch jobs: ${error.message}`,
        error.stack
      );
      throw new Error(`Failed to fetch jobs: ${error.message}`);
    }
  }
}