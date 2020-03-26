import { forwardRef, Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { BandsModule } from '../bands/bands.module';
import { AuthService } from '../shared/auth/auth.service';
import { UserModule } from '../user/user.module';
import { SharedModule } from '../shared/shared.module';

@Module({
  providers: [ChatGateway],
  imports: [forwardRef(() => BandsModule), forwardRef(() => SharedModule)]
})
export class ChatModule {}
