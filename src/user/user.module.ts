import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from './models/user.model';
import { LyricsetModule } from '../lyricset/lyricset.module';

@Module({
  imports: [MongooseModule.forFeature([{name: User.modelName, schema: User.model.schema}]),forwardRef(() => LyricsetModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {

}
