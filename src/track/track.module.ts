import { HttpModule, Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';

@Module({
  imports: [HttpModule],
  providers: [TrackService],
  controllers: [TrackController],
})
export class TrackModule {
}
