import { Injectable } from '@nestjs/common';
import { GenericRepository } from './IRepository';
import { Industry } from '../dto/unified-job.dto';
import { SuperbaseService } from './superbase.service';

@Injectable()
export class IndustryService {
  private readonly industryRepository: GenericRepository<Industry>;

  constructor(supabaseService: SuperbaseService) {
    this.industryRepository = new GenericRepository<Industry>('Industry', supabaseService);
  }

  async findOrCreate(industry: string): Promise<Industry> {
    let dbIndustry = await this.industryRepository.findOne({ name: industry });
    if (!dbIndustry) {
      dbIndustry = await this.industryRepository.insert({ name: industry });
    }
    return dbIndustry;
  }
}
