// unified-job.dto.ts
export class UnifiedJobDto {
    jobId: string;
    title: string;
    remote: boolean;
    experience: number;
    location: {
      city: string;
      state: string;
      fullAddress: string;
    };
    contractType: string;
    compensation: {
      min: number;
      max: number;
      currency: string;
      salaryRange: string;
    };
    company: {
      name: string;
      industry: string;
      website: string;
    };
    skills: string[];
    postedDate: string;
  }