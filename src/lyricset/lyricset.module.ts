import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { LyricsetController } from './lyricset.controller';
import { LyricsetService } from './lyricset.service';
import { Lyricset } from './models/lyricset.model';

@Module({
  imports: [ MongooseModule.forFeature([{name: Lyricset.modelName, schema: Lyricset.model.schema}])],
  controllers: [LyricsetController],
  providers: [LyricsetService]
})
export class LyricsetModule {}
