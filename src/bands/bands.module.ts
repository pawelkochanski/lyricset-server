import { forwardRef, Module } from '@nestjs/common';
import { BandsController } from './bands.controller';
import { BandsService } from './bands.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Band } from './models/band.model';
import { UserModule } from '../user/user.module';
import { LyricsetModule } from '../lyricset/lyricset.module';

@Module({
  imports: [MongooseModule.forFeature([{name: Band.modelName, schema: Band.model.schema}]),
            forwardRef(() => UserModule),
            forwardRef(() => LyricsetModule)],
  controllers: [BandsController],
  providers: [BandsService],
  exports: [BandsService]
})
export class BandsModule {}
