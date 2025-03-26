import { applyDecorators } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiCommonResponse = (type: any) => {
  return applyDecorators(
    ApiResponse({
      schema: {
        properties: {
          data: { $ref: getSchemaPath(type) },
          statusCode: { type: 'number' },
          message: { type: 'string' }
        }
      }
    })
  );
}; 