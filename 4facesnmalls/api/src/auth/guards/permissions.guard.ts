import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY, RequiredPermission } from '../decorators/permissions.decorator';
import { UserRole } from '../../users/schemas/user.schema';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<RequiredPermission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    // Admin tem todas as permissões
    if (user.role === UserRole.ADMIN) {
      return true;
    }
    
    if (!user.permissions) {
      return false;
    }

    return requiredPermissions.every(
      ({ module, action }) => 
        user.permissions[module]?.includes(action)
    );
  }
} 