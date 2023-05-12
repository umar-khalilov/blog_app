import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RoleTypes } from '@/common/enums/role-types.enum';

export const RolesGuard = (
    ...requiredRoles: RoleTypes[]
): Type<CanActivate> => {
    class RoleGuardMixin extends JwtAuthGuard {
        async canActivate(context: ExecutionContext): Promise<boolean> {
            await super.canActivate(context);
            const { user } = context.switchToHttp().getRequest();
            return requiredRoles.includes(user.role);
        }
    }
    return mixin<RoleGuardMixin>(RoleGuardMixin);
};
