import { forwardRef, Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { UserModule } from 'src/user/user.module';
import { LyricsetModule } from '../lyricset/lyricset.module';
import { BandsModule } from '../bands/bands.module';

@Module({
  providers: [ImageService],
  imports: [UserModule,LyricsetModule, forwardRef(() => BandsModule)],
  controllers: [ImageController]
})
export class ImageModule {}
