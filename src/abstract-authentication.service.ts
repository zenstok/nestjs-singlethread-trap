import { MockHttpService } from './mock-http.service';
import { MockAwsCloudwatchApiService } from './mock-aws-cloudwatch-api.service';
import { LoginThrottleService } from './login-throttle.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class AbstractAuthenticationService {
  protected accessToken: string | null = null;
  protected loginInProgress = false;

  constructor(
    protected readonly httpService: MockHttpService,
    protected readonly awsCloudwatchApiService: MockAwsCloudwatchApiService,
    private readonly loginThrottleService: LoginThrottleService,
  ) {}

  /*
   * This method is used only for illustrative purposes. In production, this method should not exist.
   */
  resetState() {
    this.accessToken = null;
    this.loginInProgress = false;
    this.loginThrottleService.resetState();
  }

  updateSomeData(dto: any) {
    return this.sendProtectedRequest('/update-some-data', dto);
  }

  protected abstract sendProtectedRequest(
    route: string,
    data?: unknown,
  ): Promise<unknown>;

  protected abstract loginToBackendService(): Promise<{
    status: number;
    statusText: string;
    data?: { accessToken: string };
  }>;
}
