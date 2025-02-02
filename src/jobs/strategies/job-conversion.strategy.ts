import { UnifiedJobDto } from "../dto/unified-job.dto";


export interface JobConversionStrategy {
  convert(apiResponse: any): UnifiedJobDto[];
}

// Strategy for a1 response
export class A1ConversionStrategy implements JobConversionStrategy {
  convert(apiResponse: any): UnifiedJobDto[] {
    return apiResponse.map((job) => ({
      jobId: job.jobId,
      title: job.title,
      remote: job.details.type === 'Remote',
      experience: 0, // Default for a1
      location: {
        city: job.details.location.split(', ')[0],
        state: job.details.location.split(', ')[1],
        fullAddress: job.details.location,
      },
      contractType: job.details.type,
      compensation: {
        min: parseInt(job.details.salaryRange.replace(/[^0-9]/g, '').substring(0, 3)) * 1000,
        max: parseInt(job.details.salaryRange.replace(/[^0-9]/g, '').substring(3)) * 1000,
        currency: 'USD',
        salaryRange: job.details.salaryRange,
      },
      company: {
        name: job.company.name,
        industry: job.company.industry,
        website: '', // Default for a1
      },
      skills: job.skills,
      postedDate: job.postedDate,
    }));
  }
}

// Strategy for a2 response
export class A2ConversionStrategy implements JobConversionStrategy {
  convert(apiResponse: any): UnifiedJobDto[] {
    const jobKey = Object.keys(apiResponse)[0]; // e.g., "job-8"
    const jobData = apiResponse[jobKey];

    return [
      {
        jobId: jobKey,
        title: jobData.position,
        remote: jobData.location.remote,
        experience: jobData.requirements.experience,
        location: {
          city: jobData.location.city,
          state: jobData.location.state,
          fullAddress: `${jobData.location.city}, ${jobData.location.state}`,
        },
        contractType: jobData.type || 'Full-Time', // Default for a2
        compensation: {
          min: jobData.compensation.min,
          max: jobData.compensation.max,
          currency: jobData.compensation.currency,
          salaryRange: `${jobData.compensation.min / 1000}k - ${jobData.compensation.max / 1000}k`,
        },
        company: {
          name: jobData.employer.companyName,
          industry: '', // Default for a2
          website: jobData.employer.website,
        },
        skills: jobData.requirements.technologies,
        postedDate: jobData.datePosted,
      },
    ];
  }
}