import { UnifiedJobDto } from "../dto/unified-job.dto";
import { JobMapper, JobMapperV2 } from "./job-conversion.strategy";

export class JobFactory {
  static createFromAnyResponse(rawData: any): UnifiedJobDto[] {
    if ('jobsList' in rawData.data) {
      console.log("here arrives " )
      return this.handleFirstResponseFormat(rawData);
    } else if ('jobs' in rawData) {
      return this.handleSecondResponseFormat(rawData);
    }
    throw new Error('Unsupported response format');
  }

  private static handleFirstResponseFormat(response: any): UnifiedJobDto[] {
    console.log(1)
    const jobs = response.data.jobsList;
    console.log(2)
    return Object.keys(jobs).map(jobKey => {
      console.log(jobKey)
      const jobData = { [jobKey]: jobs[jobKey] };
      return JobMapperV2.fromRawJsonToDto(jobData);
    });
  }

  private static handleSecondResponseFormat(response: any): UnifiedJobDto[] {
    return response.jobs.map((job: any) => {
      // Convert second format to first format structure
      const transformedJob = {
        jobId: job.jobId,
        position: job.title,
        location: {
          city: job.details.location.split(',')[0].trim(),
          state: job.details.location.split(',')[1]?.trim() || '',
          remote: job.details.location.toLowerCase().includes('remote')
        },
        compensation: {
          min: parseInt(job.details.salaryRange.match(/\$(\d+)k/)[1]) * 1000,
          max: parseInt(job.details.salaryRange.match(/- \$(\d+)k/)[1]) * 1000,
          currency: 'USD'
        },
        employer: {
          companyName: job.company.name,
          website: job.company.website || ''
        },
        requirements: {
          experience: 0, // Default value
          technologies: job.skills
        },
        datePosted: job.postedDate
      };
      return JobMapper.fromRawJsonToDto(transformedJob);
    });
  }
}