import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthGuardData, createAuthGuard } from 'keycloak-angular';
import { MatDialog } from '@angular/material/dialog';
import { ForbiddenDialog } from '../../shared/components/forbidden-dialog/forbidden-dialog';

const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  authData: AuthGuardData
): Promise<boolean | UrlTree> => {
  const { authenticated, grantedRoles } = authData;

  const requiredRole = route.data['role'];
  if (!requiredRole) {
    return false;
  }

  // Helper to check realm or resource roles; also try without the common 'ROLE_' prefix
  const hasRequiredRole = (role: string): boolean => {
    const variants = [role, role.startsWith('ROLE_') ? role.substring(5) : `ROLE_${role}`];
    const normalizedVariants = variants.flatMap((r) => [r, r.toLowerCase()]);

    const realmRoles = grantedRoles.realmRoles?.map((r) => [r, r?.toLowerCase?.()]).flat() ?? [];
    if (normalizedVariants.some((rv) => realmRoles.includes(rv))) return true;

    const resourceRoles = Object.values(grantedRoles.resourceRoles || {}).flatMap((roles) =>
      (roles || []).flatMap((r) => [r, r?.toLowerCase?.()])
    );
    return normalizedVariants.some((rv) => resourceRoles.includes(rv));
  };

  if (authenticated && hasRequiredRole(requiredRole)) {
    return true;
  }

  // Open dialog showing the required role and reason for denial
  const dialog = inject(MatDialog);
  dialog.open(ForbiddenDialog, {
    data: {
      requiredRole: requiredRole,
      attemptedRoute: state.url
    },
    width: '500px',
    disableClose: false
  });

  return false;
};

export const canActivateAuthRole = createAuthGuard<CanActivateFn>(isAccessAllowed);