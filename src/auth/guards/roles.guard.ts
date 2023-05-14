import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RoleTypes } from '@/common/enums/role-types.enum';

export const RolesGuard = (
    ...requiredRoles: RoleTypes[]
): Type<CanActivate> => {
    class RoleGuardMixin extends JwtAuthGuard {
        async canActivate(context: ExecutionContext): Promise<boolean> {
            const gqlCtx = GqlExecutionContext.create(context).getContext();
            await super.canActivate(gqlCtx);
            const {
                req: { user },
            } = gqlCtx;

            return requiredRoles.includes(user.role);
        }
    }
    return mixin<RoleGuardMixin>(RoleGuardMixin);
};
