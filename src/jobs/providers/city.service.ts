import { Injectable } from '@nestjs/common';

import { City } from '../dto/unified-job.dto';
import { GenericRepository } from './IRepository';
import { SuperbaseService } from './superbase.service';

@Injectable()
export class CityService {
  private readonly cityRepository: GenericRepository<City>;

  constructor(supabaseService: SuperbaseService) {
    this.cityRepository = new GenericRepository<City>('City', supabaseService);
  }

  async findOrCreate(city: string, stateId: number): Promise<City> {
    let dbCity = await this.cityRepository.findOne({
      name: city,
      state_id: stateId,
    });
    if (!dbCity) {
      dbCity = await this.cityRepository.insert({
        name: city,
        state_id: stateId,
      });
    }
    return dbCity;
  }
}
