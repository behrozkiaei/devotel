// src/job/job.controller.ts
import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { JobFilterDto } from 'src/jobs/dto/job-filter.dto';
import { PaginatedResponseDto } from 'src/jobs/dto/paginated-response.dto';
import { UnifiedJobDto } from 'src/jobs/dto/unified-job.dto';
import { Job } from 'src/jobs/entity/jobs.entity';
import { ApiService } from 'src/jobs/providers/api.service';

@ApiTags('Job Offers')
@Controller('api/job-offers')
export class ApiController {
  constructor(private readonly apiService:ApiService ) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get paginated job offers with filters',
    description: 'Retrieve job offers with optional filters and pagination'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully retrieved job offers',
    type: PaginatedResponseDto
  })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getJobOffers(@Query() filters: JobFilterDto): Promise<{ data: Job[]; total: number }> {
    try {
      return await this.apiService.getJobs(filters);
    } catch (error) {
      throw new HttpException(
        {
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'Internal server error',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}