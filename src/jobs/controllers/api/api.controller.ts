// src/job/job.controller.ts
import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { JobFilterDto } from 'src/jobs/dto/job-filter.dto';
import { PaginatedResponseDto } from 'src/jobs/dto/paginated-response.dto';
import { UnifiedJobDto } from 'src/jobs/dto/unified-job.dto';
import { ApiService } from 'src/jobs/providers/api.service';


@ApiTags('Job Offers')
@Controller('api/job-offers')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

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
  @ApiQuery({ 
    name: 'title', 
    required: false,
    example: 'Developer',
    description: 'Search term for job title' 
  })
  @ApiQuery({ 
    name: 'location', 
    required: false,
    example: 'Austin, TX',
    description: 'Location filter (city or state)' 
  })
  @ApiQuery({ 
    name: 'salaryMin', 
    required: false,
    type: Number,
    example: 60000,
    description: 'Minimum salary filter' 
  })
  @ApiQuery({ 
    name: 'salaryMax', 
    required: false,
    type: Number,
    example: 100000,
    description: 'Maximum salary filter' 
  })
  @ApiQuery({ 
    name: 'page', 
    required: false,
    type: Number,
    example: 1,
    description: 'Page number for pagination' 
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false,
    type: Number,
    example: 10,
    description: 'Number of items per page' 
  })
  async getJobOffers(@Query() filters: JobFilterDto): Promise<PaginatedResponseDto<UnifiedJobDto>> {
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