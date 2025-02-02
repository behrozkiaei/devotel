// job-conversion.factory.ts
import { Injectable } from '@nestjs/common';
import { JobConversionStrategy, A1ConversionStrategy, A2ConversionStrategy } from './job-conversion.strategy';

@Injectable()
export class JobConversionFactory {
  static getConversionStrategy(apiResponse: any): JobConversionStrategy {
    if (Array.isArray(apiResponse)) {
      return new A1ConversionStrategy(); // a1 response is an array
    } else if (typeof apiResponse === 'object' && Object.keys(apiResponse).length === 1) {
      return new A2ConversionStrategy(); // a2 response is an object with a single key
    }
    throw new Error('Unsupported API response format');
  }
}