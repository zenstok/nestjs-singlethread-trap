import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GoodAuthenticationService } from './good-authentication.service';
import { MockHttpService } from './mock-http.service';
import { AppService } from './app.service';
import { BadAuthenticationService } from './bad-authentication.service';
import { LoginThrottleService } from './login-throttle.service';
import { MockAwsCloudwatchApiService } from './mock-aws-cloudwatch-api.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    BadAuthenticationService,
    GoodAuthenticationService,
    MockHttpService,
    MockAwsCloudwatchApiService,
    LoginThrottleService,
    AppService,
  ],
})
export class AppModule {}
