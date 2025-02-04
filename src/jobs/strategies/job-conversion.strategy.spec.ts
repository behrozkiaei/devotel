import { JobMapper, JobMapperV2 } from './job-conversion.strategy';

describe('JobMapper', () => {
  describe('fromRawJsonToDto', () => {
    it('should correctly map provider1 job data', () => {
      const rawJob = {
        id: 'P1-123',
        title: 'Software Engineer',
        location: {
          city: 'New York',
          state: 'NY',
        },
        salary: {
          min: 80000,
          max: 120000,
          currency: 'USD',
        },
        company: {
          name: 'Tech Corp',
          website: 'https://techcorp.com',
        },
        type: ['Full-Time'],
        skills: ['JavaScript', 'React'],
        posted_date: '2024-01-27T12:00:00Z',
      };

      const result = JobMapper.fromRawJsonToDto(rawJob);

      expect(result).toEqual({
        jobId: 'P1-123',
        title: 'Software Engineer',
        city: 'New York',
        state: 'NY',
        fullAddress: 'New York, NY',
        remote: false,
        compensation: {
          min: 80000,
          max: 120000,
          currency: 'USD',
          salaryRange: '$80k - $120k',
        },
        contractType: ['Full-Time'],
        company: {
          name: 'Tech Corp',
          website: 'https://techcorp.com',
        },
        industry: '',
        skills: ['JavaScript', 'React'],
        postedDate: '2024-01-27T12:00:00Z',
        experience: 0,
      });
    });
  });
});

describe('JobMapperV2', () => {
  describe('fromRawJsonToDto', () => {
    it('should correctly map provider2 job data', () => {
      const rawJob = {
        'job-456': {
          position: 'Senior Developer',
          city: 'San Francisco',
          state: 'CA',
          compensation: {
            minimum: 100000,
            maximum: 150000,
            currency: 'USD',
          },
          employer: {
            companyName: 'StartupCo',
            url: 'https://startupco.com',
          },
          contractType: ['Contract'],
          requiredSkills: ['Python', 'Django'],
          datePosted: '2024-01-28',
        },
      };

      const result = JobMapperV2.fromRawJsonToDto(rawJob);

      expect(result).toEqual({
        jobId: 'job-456',
        title: 'Senior Developer',
        city: 'San Francisco',
        state: 'CA',
        fullAddress: 'San Francisco, CA',
        remote: false,
        compensation: {
          min: 100000,
          max: 150000,
          currency: 'USD',
          salaryRange: '$100k - $150k',
        },
        contractType: ['Contract'],
        company: {
          name: 'StartupCo',
          website: 'https://startupco.com',
        },
        industry: '',
        skills: ['Python', 'Django'],
        postedDate: '2024-01-28',
        experience: 0,
      });
    });

    it('should handle missing optional fields', () => {
      const rawJob = {
        'job-789': {
          position: 'Developer',
          city: 'Remote',
          state: '',
          compensation: {
            minimum: 90000,
            maximum: 110000,
            currency: 'USD',
          },
          employer: {
            companyName: 'TechCo',
          },
          contractType: [],
          requiredSkills: [],
          datePosted: '2024-01-29',
        },
      };

      const result = JobMapperV2.fromRawJsonToDto(rawJob);

      expect(result).toEqual({
        jobId: 'job-789',
        title: 'Developer',
        city: 'Remote',
        state: '',
        fullAddress: 'Remote',
        remote: true,
        compensation: {
          min: 90000,
          max: 110000,
          currency: 'USD',
          salaryRange: '$90k - $110k',
        },
        contractType: [],
        company: {
          name: 'TechCo',
          website: '',
        },
        industry: '',
        skills: [],
        postedDate: '2024-01-29',
        experience: 0,
      });
    });
  });
}); 