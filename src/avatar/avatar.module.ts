import { Module } from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { AvatarController } from './avatar.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [AvatarService],
  imports: [UserModule],
  controllers: [AvatarController]
})
export class AvatarsModule {}
