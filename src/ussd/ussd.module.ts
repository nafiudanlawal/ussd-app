import { Module } from '@nestjs/common';
import { UssdController } from './ussd.controller';
import { UssdService } from './ussd.service';
import { RedisService } from 'src/redis/redis.service';

@Module({
  controllers: [UssdController],
  providers: [UssdService, RedisService],
})
export class UssdModule {}
