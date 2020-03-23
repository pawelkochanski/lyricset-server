import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { forwardRef, Module } from '@nestjs/common';
import { LyricsetController } from './lyricset.controller';
import { LyricsetService } from './lyricset.service';
import { Lyricset } from './models/lyricset.model';

@Module({
  imports: [ MongooseModule.forFeature([{name: Lyricset.modelName, schema: Lyricset.model.schema}]),forwardRef(() => UserModule)],
  controllers: [LyricsetController],
  providers: [LyricsetService],
  exports: [LyricsetService]
})
export class LyricsetModule {}
