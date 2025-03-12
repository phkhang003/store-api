import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { UserRole } from '../enums/role.enum';
import { Permission } from '../constants/permissions';
import { Roles } from './roles.decorator';
import { RequirePermissions } from './permissions.decorator';

export function AdminRoute(
  roles: UserRole[] = [], 
  permissions: Permission[] = [],
  summary?: string
) {
  return applyDecorators(
    ApiBearerAuth(),
    ApiSecurity('x-api-key'),
    UseGuards(JwtAuthGuard, ApiKeyGuard),
    Roles(...roles),
    RequirePermissions(...permissions),
    ApiOperation({ summary }),
    ApiResponse({ status: 201, description: 'Thao tác thành công' }),
    ApiResponse({ status: 403, description: 'Forbidden' }),
    ApiResponse({ status: 401, description: 'Unauthorized' })
  );
} 