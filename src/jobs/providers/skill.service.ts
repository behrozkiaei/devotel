import { Injectable } from '@nestjs/common';
import { GenericRepository } from './IRepository';
import { Skill } from '../dto/unified-job.dto';
import { SuperbaseService } from './superbase.service';


@Injectable()
export class SkillService {
  private readonly skillRepository: GenericRepository<Skill>;

  constructor(supabaseService: SuperbaseService) {
    this.skillRepository = new GenericRepository<Skill>('Skill', supabaseService);
  }

  async findOrCreate(skill: string): Promise<Skill> {
    let dbSkill = await this.skillRepository.findOne({ name: skill });
    if (!dbSkill) {
      dbSkill = await this.skillRepository.insert({ name: skill });
    }
    return dbSkill;
  }
}

