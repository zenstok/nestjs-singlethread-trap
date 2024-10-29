import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  readMe() {
    return `
     Call "/simulate-2-requests-bad-version" to simulate 2 requests with a bad version
     <br />
     Call "/simulate-2-requests-good-version" to simulate 2 requests with a good version
    `;
  }

  @Get('/simulate-2-requests-bad-version')
  simulate2RequestsBadVersion() {
    return this.appService.simulate2RequestsBadVersion();
  }

  @Get('/simulate-2-requests-good-version')
  simulate2RequestGoodVersion() {
    return this.appService.simulate2RequestGoodVersion();
  }
}
