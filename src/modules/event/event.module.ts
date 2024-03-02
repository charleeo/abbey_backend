import { Module } from '@nestjs/common';
import { Event } from './event';

@Module({
  providers: [Event]
})
export class EventModule {}
