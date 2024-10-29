import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AbstractAuthenticationService } from './abstract-authentication.service';

@Injectable()
export class BadAuthenticationService extends AbstractAuthenticationService {
  async loginToBackendService() {
    this.loginInProgress = true; // this is BAD, we are inside a promise, it's asynchronous. it's not synchronous, javascript can execute it whenever it wants

    try {
      const response = await firstValueFrom(
        this.httpService.post(`https://backend-service.com/login`, {
          password: 'password',
        }),
      );

      return response;
    } finally {
      this.loginInProgress = false;
    }
  }

  async sendProtectedRequest(route: string, data?: unknown) {
    if (!this.accessToken) {
      if (this.loginInProgress) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return this.sendProtectedRequest(route, data);
      }

      try {
        await this.awsCloudwatchApiService.logLoginCallAttempt();
        const { data: loginData } = await this.loginToBackendService();
        this.accessToken = loginData.accessToken;
      } catch (e: any) {
        console.error(e?.response?.data);
        throw e;
      }
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post(`https://backend-service.com${route}`, data, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }),
      );

      return response;
    } catch (e: any) {
      if (e?.response?.data?.statusCode === 401) {
        this.accessToken = null;
        return this.sendProtectedRequest(route, data);
      }
      console.error(e?.response?.data);
      throw e;
    }
  }
}
