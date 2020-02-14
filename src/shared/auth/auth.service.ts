import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { sign, SignOptions } from 'jsonwebtoken';
import { UserService } from '../../user/user.service';
import { ConfigurationService } from '../configuration/configuration/configuration.service';
import { Configuration } from '../configuration/configuration/configuration.enum';
import { JwtPayload } from './jwt-payload';
import { User } from '../../user/models/user.model';
import { InstanceType } from 'typegoose';

@Injectable()
export class AuthService {
  private readonly jwtOptions: SignOptions;
  private readonly jwtKey: string;

  constructor(@Inject(forwardRef(() => UserService)) readonly _userService: UserService,
              private readonly _configurationService: ConfigurationService){
    this.jwtOptions = {expiresIn: '12h'};
    this.jwtKey = _configurationService.get(Configuration.JWT_KEY);
  }

  async singPayload(payload: JwtPayload): Promise<string>{
    return sign(payload,this.jwtKey,this.jwtOptions);
  }

  async validatePayload(payload: JwtPayload): Promise<InstanceType<User>>{
    return this._userService.findOne({username: payload.username.toLowerCase()});
  }
}
