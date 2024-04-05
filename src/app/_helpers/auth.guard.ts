import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AccountService } from '@app/_services/account.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const accountService = inject(AccountService);
  const user = accountService.userValue;

  console.log(state);
  
  if (user) {
    return true;
  }

  router.navigate(['/account/login'], { queryParams: { returnUrl: state.url }});
  return false;
};
