import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AbstractAuthenticationService } from './abstract-authentication.service';

@Injectable()
export class GoodAuthenticationService extends AbstractAuthenticationService {
  async loginToBackendService() {
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

      // Critical: Set the flag before ANY promise call
      this.loginInProgress = true;

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
