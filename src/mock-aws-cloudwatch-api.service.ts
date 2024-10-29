import { Injectable } from '@nestjs/common';
import { delay, firstValueFrom, of } from 'rxjs';

@Injectable()
export class MockAwsCloudwatchApiService {
  logLoginCallAttempt(): Promise<{
    status: number;
    statusText: string;
    data: { message: string };
  }> {
    const randomDelay = Math.floor(Math.random() * 1000); // Random delay between 0 and 1000 ms

    return firstValueFrom(
      of({
        data: { message: 'Logged successfully.' },
        status: 200,
        statusText: 'OK',
      }).pipe(delay(randomDelay)),
    );
  }
}
