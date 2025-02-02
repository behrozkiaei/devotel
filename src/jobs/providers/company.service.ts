import { Injectable } from '@nestjs/common';
import { GenericRepository } from './IRepository';
import { Company } from '../dto/unified-job.dto';
import { SuperbaseService } from './superbase.service';

@Injectable()
export class CompanyService {
  private readonly companyRepository: GenericRepository<Company>;

  constructor(supabaseService: SuperbaseService) {
    this.companyRepository = new GenericRepository<Company>(
      'Company',
      supabaseService,
    );
  }

  async findOrCreate(company: {
    name: string;
    website: string;
  }): Promise<Company> {
    let dbCompany = await this.companyRepository.findOne({
      name: company.name,
    });
    if (!dbCompany) {
      dbCompany = await this.companyRepository.insert({
        name: company.name,
        website: company.website,
      });
    }
    return dbCompany;
  }
}
