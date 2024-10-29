import { Injectable } from '@nestjs/common';

@Injectable()
export class LoginThrottleService {
  private lastLoginAttempt: number | null = null;
  private loginAttemptCount: number = 0;

  isLoginAllowed(): boolean {
    const now = Date.now();
    if (this.lastLoginAttempt && now - this.lastLoginAttempt < 60000) {
      if (this.loginAttemptCount >= 1) {
        return false;
      }
      this.loginAttemptCount++;
    } else {
      this.lastLoginAttempt = now;
      this.loginAttemptCount = 1;
    }
    return true;
  }

  resetState() {
    this.lastLoginAttempt = null;
    this.loginAttemptCount = 0;
  }
}
