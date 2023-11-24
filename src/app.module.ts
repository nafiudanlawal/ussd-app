import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UssdModule } from './ussd/ussd.module';
import { RedisService } from './redis/redis.service';

@Module({
  imports: [UssdModule],
  controllers: [AppController],
  providers: [AppService, RedisService],
})
export class AppModule {}
