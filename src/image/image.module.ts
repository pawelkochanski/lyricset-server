import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { UserModule } from 'src/user/user.module';
import { LyricsetModule } from '../lyricset/lyricset.module';

@Module({
  providers: [ImageService],
  imports: [UserModule,LyricsetModule],
  controllers: [ImageController]
})
export class ImageModule {}
