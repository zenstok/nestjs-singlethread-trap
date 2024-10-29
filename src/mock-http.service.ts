import { Injectable } from '@nestjs/common';
import { delay, Observable, of } from 'rxjs';
import { LoginThrottleService } from './login-throttle.service';

@Injectable()
export class MockHttpService {
  constructor(private readonly loginThrottleService: LoginThrottleService) {}

  post(
    url: string,
    data?: unknown,
    headers?: unknown,
  ): Observable<{
    status: number;
    statusText: string;
    data?: { accessToken: string };
  }> {
    console.log('MockHttpService.post', url, data);

    if (url.endsWith('/login')) {
      console.log('ops call it login');
    }
    if (url.endsWith('/login') && !this.loginThrottleService.isLoginAllowed()) {
      throw {
        response: {
          data: { statusCode: 429, statusText: 'Too many requests' },
        },
      };
    }

    const randomDelay = Math.floor(Math.random() * 1000); // Random delay between 0 and 1000 ms

    return of({
      data: { accessToken: 'mock-access-token' },
      status: 200,
      statusText: 'OK',
      headers: headers,
    }).pipe(delay(randomDelay));
  }
}
