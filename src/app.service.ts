import { Injectable } from '@nestjs/common';
import { GoodAuthenticationService } from './good-authentication.service';
import { BadAuthenticationService } from './bad-authentication.service';
import { LoginThrottleService } from './login-throttle.service';

@Injectable()
export class AppService {
  constructor(
    private readonly badAuthenticationService: BadAuthenticationService,
    private readonly goodAuthenticationService: GoodAuthenticationService,
    private readonly loginThrottleService: LoginThrottleService,
  ) {}

  async simulate2RequestsBadVersion() {
    await Promise.all([
      this.badAuthenticationService.updateSomeData({ data: 'req1' }),
      this.badAuthenticationService.updateSomeData({ data: 'req2' }),
    ]);

    this.badAuthenticationService.resetState();

    return 'Both requests were successful (BAD VERSION)';
  }

  async simulate2RequestGoodVersion() {
    await Promise.all([
      this.goodAuthenticationService.updateSomeData({ data: 'req1' }),
      this.goodAuthenticationService.updateSomeData({ data: 'req2' }),
    ]);

    this.loginThrottleService.resetState();

    return 'Both requests were successful, guaranteed to always work. (GOOD VERSION)';
  }
}
