import { UnifiedJobDto } from "../dto/unified-job.dto";


export interface JobConversionStrategy {
  convert(apiResponse: any): UnifiedJobDto;
}

export class JobMapper {
  static fromRawJsonToDto(rawData: any): UnifiedJobDto {
    const dto = new UnifiedJobDto();
    dto.jobId = rawData.jobId;
    dto.title = rawData.title;
    
    // Process location
    const [city, state] = rawData.details.location.split(',').map((s: string) => s.trim());
    dto.city = city;
    dto.state = state || '';
    dto.fullAddress = rawData.details.location;
    
    // Determine remote status
    dto.remote = rawData.details.location.toLowerCase().includes('remote');
    
    // Process compensation
    const salaryMatch = rawData.details.salaryRange.match(/\$(\d+)k\s*-\s*\$(\d+)k/);
    dto.compensation = {
      min: salaryMatch ? parseInt(salaryMatch[1]) * 1000 : 0,
      max: salaryMatch ? parseInt(salaryMatch[2]) * 1000 : 0,
      currency: 'USD',
      salaryRange: rawData.details.salaryRange
    };
    
    // Process contract type
    dto.contractType = [rawData.details.type];
    if (dto.remote) {
      dto.contractType.push('Remote');
    }
    
    // Process company
    dto.company = {
      name: rawData.company.name,
      website: '' // Add website extraction if available in raw data
    };
    
    // Process other fields
    dto.industry = rawData.company.industry;
    dto.skills = rawData.skills;
    dto.postedDate = rawData.postedDate;
    
    // Default values for missing fields
    dto.experience = 0; // Add experience extraction if available in raw data
    
    return dto;
  }
}

export class JobMapperV2 {
  static fromRawJsonToDto(rawData: any): UnifiedJobDto {
    const jobKey = Object.keys(rawData)[0]; // Get the dynamic key (e.g., "job-204")
    const jobData = rawData[jobKey];
    
    const dto = new UnifiedJobDto();
    
    // Basic fields
    dto.jobId = jobKey;
    dto.title = jobData.position;
    
    // Location fields
    dto.city = jobData.location.city;
    dto.state = jobData.location.state;
    dto.fullAddress = `${jobData.location.city}, ${jobData.location.state}`;
    dto.remote = jobData.location.remote || false;
    
    // Contract type
    dto.contractType = dto.remote ? ['Remote'] : [];
    
    // Compensation
    dto.compensation = {
      min: jobData.compensation.min,
      max: jobData.compensation.max,
      currency: jobData.compensation.currency,
      salaryRange: `$${jobData.compensation.min / 1000}k - $${jobData.compensation.max / 1000}k`
    };
    
    // Company
    dto.company = {
      name: jobData.employer.companyName,
      website: jobData.employer.website
    };
    
    // Other fields
    dto.industry = ''; // Not provided in source data
    dto.skills = jobData.requirements.technologies;
    dto.postedDate = jobData.datePosted;
    dto.experience = jobData.requirements.experience;
    
    return dto;
  }
}