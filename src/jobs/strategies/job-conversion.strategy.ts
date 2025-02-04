import { UnifiedJobDto } from "../dto/unified-job.dto";


export interface JobConversionStrategy {
  convert(apiResponse: any): UnifiedJobDto;
}

export class JobMapper {
  static fromRawJsonToDto(rawJob: any): UnifiedJobDto {
    return {
      jobId: rawJob.id,
      title: rawJob.title,
      city: rawJob.location?.city || '',
      state: rawJob.location?.state || '',
      fullAddress: this.buildFullAddress(rawJob.location?.city, rawJob.location?.state),
      remote: this.isRemote(rawJob.location?.city),
      compensation: {
        min: rawJob.salary?.min || 0,
        max: rawJob.salary?.max || 0,
        currency: rawJob.salary?.currency || 'USD',
        salaryRange: this.formatSalaryRange(rawJob.salary?.min, rawJob.salary?.max),
      },
      contractType: rawJob.type || [],
      company: {
        name: rawJob.company?.name || '',
        website: rawJob.company?.website || '',
      },
      industry: '',
      skills: rawJob.skills || [],
      postedDate: rawJob.posted_date || new Date().toISOString(),
      experience: 0,
    };
  }

  private static buildFullAddress(city?: string, state?: string): string {
    if (!city && !state) return '';
    if (!state) return city || '';
    if (!city) return state;
    return `${city}, ${state}`;
  }

  private static isRemote(city?: string): boolean {
    return city?.toLowerCase() === 'remote';
  }

  private static formatSalaryRange(min?: number, max?: number): string {
    if (!min && !max) return '';
    const minStr = min ? `$${Math.floor(min/1000)}k` : '';
    const maxStr = max ? `$${Math.floor(max/1000)}k` : '';
    return `${minStr}${min && max ? ' - ' : ''}${maxStr}`;
  }
}

export class JobMapperV2 {
  static fromRawJsonToDto(rawJob: any): UnifiedJobDto {
    const jobId = Object.keys(rawJob)[0];
    const job = rawJob[jobId];

    return {
      jobId,
      title: job.position,
      city: job.city || '',
      state: job.state || '',
      fullAddress: this.buildFullAddress(job.city, job.state),
      remote: this.isRemote(job.city),
      compensation: {
        min: job.compensation?.minimum || 0,
        max: job.compensation?.maximum || 0,
        currency: job.compensation?.currency || 'USD',
        salaryRange: this.formatSalaryRange(job.compensation?.minimum, job.compensation?.maximum),
      },
      contractType: job.contractType || [],
      company: {
        name: job.employer?.companyName || '',
        website: job.employer?.url || '',
      },
      industry: '',
      skills: job.requiredSkills || [],
      postedDate: job.datePosted || new Date().toISOString(),
      experience: 0,
    };
  }

  private static buildFullAddress(city?: string, state?: string): string {
    if (!city && !state) return '';
    if (!state) return city || '';
    if (!city) return state;
    return `${city}, ${state}`;
  }

  private static isRemote(city?: string): boolean {
    return city?.toLowerCase() === 'remote';
  }

  private static formatSalaryRange(min?: number, max?: number): string {
    if (!min && !max) return '';
    const minStr = min ? `$${Math.floor(min/1000)}k` : '';
    const maxStr = max ? `$${Math.floor(max/1000)}k` : '';
    return `${minStr}${min && max ? ' - ' : ''}${maxStr}`;
  }
}