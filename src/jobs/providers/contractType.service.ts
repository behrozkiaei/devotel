import { Injectable } from "@nestjs/common";
import { GenericRepository } from "./IRepository";
import { ContractType } from "../dto/unified-job.dto";
import { SuperbaseService } from "./superbase.service";

@Injectable()
export class ContractTypeService {
  private readonly contractTypeRepository: GenericRepository<ContractType>;

  constructor(supabaseService: SuperbaseService) {
    this.contractTypeRepository = new GenericRepository<ContractType>('ContractType', supabaseService);
  }

  async findOrCreate(type: string): Promise<ContractType> {
    let dbContractType = await this.contractTypeRepository.findOne({ type });
    if (!dbContractType) {
      dbContractType = await this.contractTypeRepository.insert({ type });
    }
    return dbContractType;
  }
}