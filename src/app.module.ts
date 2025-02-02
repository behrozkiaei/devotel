// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnifiedJobEntity } from './jobs/entities/unified-job.entity';
import { CompanyEntity } from './jobs/entities/company.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // Database type
      host: 'localhost', // Database host
      port: 5432, // Database port
      username: 'your_db_user', // Database username
      password: 'your_db_password', // Database password
      database: 'your_db_name', // Database name
      entities: [UnifiedJobEntity, CompanyEntity], // Entities to be loaded
      synchronize: true, // Automatically sync schema (only for development)
    }),
    TypeOrmModule.forFeature([UnifiedJobEntity, CompanyEntity]), // Register entities for the module
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}