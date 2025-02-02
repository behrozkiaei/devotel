import { Injectable } from '@nestjs/common';
import { GenericRepository } from './IRepository';
import { SuperbaseService } from './superbase.service';
import { State } from '../dto/unified-job.dto';

@Injectable()
export class StateService {
  private readonly stateRepository: GenericRepository<State>;

  constructor(superbase: SuperbaseService) {
    this.stateRepository = new GenericRepository<State>('State',superbase);
  }

  async findOrCreate(state: string): Promise<State> {
    let dbState = await this.stateRepository.findOne({ name: state });
    if (!dbState) {
      dbState = await this.stateRepository.insert({
          name: state
      });
    }
    return dbState;
  }
}


