import { ProfileVm } from './models/view-models/profile-vm';
import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { User } from './models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { ModelType } from 'typegoose';
import { MapperService } from '../shared/mapper/mapper.service';
import { RegisterVm } from './models/view-models/register-vm.model';
import { compare, genSalt, hash } from 'bcryptjs';
import { tryCatch } from 'rxjs/internal-compatibility';
import { LoginVm } from './models/view-models/login-vm.model';
import { LoginResponseVm } from './models/view-models/login-response-vm';
import { JwtPayload } from '../shared/auth/jwt-payload';
import { AuthService } from '../shared/auth/auth.service';
import { UserVm } from './models/view-models/user-vm.model';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(@InjectModel(User.modelName) private readonly _userModel: ModelType<User>,
              private readonly _mapperService: MapperService,
              @Inject(forwardRef(()=> AuthService)) readonly _authService: AuthService)  {
    super();
    this._model = _userModel;
    this._mapper = _mapperService.mapper;
  }

  async register(registerVm: RegisterVm) : Promise<User> {
    const { username, password, email } = registerVm;

    const newUser = new this._model();
    newUser.username = username;
    newUser.email = email;
    newUser.displayname = username;

    const salt = await genSalt(10);
    newUser.password = await hash(password, salt);

    try{
      const result = await this.create(newUser);
      return result.toJSON() as User;
    } catch(e){
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
    }

  }


  async login(loginVm: LoginVm): Promise<LoginResponseVm>{
    const {username, password} = loginVm;
    const user = await this.findOne({ username});
    if(!user){
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const isMatch = await compare(password, user.password);

    if(!isMatch){
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const payload: JwtPayload = {
      username: user.username,
      role: user.role
    };

    const token = await this._authService.singPayload(payload);
    const userVm: UserVm = await this.map<UserVm>(user.toJSON());

    return{
      token,
      user: userVm,
    }

  }

  async setAvatar(user: User, avatarId: string) :Promise<void>{
    if(avatarId!==''){
      user.avatarId = avatarId;
      this.update(user.id, user);
      return;
    }
    throw new HttpException('Wrong AvatarId', HttpStatus.BAD_REQUEST);
  }


  async changePassword(user: User, password: string, newpassword: string) : Promise<User> {

    if(!password || !newpassword){
      throw new HttpException('No password.', HttpStatus.BAD_REQUEST);
    }

    const isMatch = await compare(password, user.password);

    if(!isMatch){
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
    const salt = await genSalt(10);
    user.password = await hash(newpassword, salt);

    try{
      const result = await this.update(user.id, user);
      return result.toJSON() as User;
    } catch(e){
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
    }

  }

  async changeUsername(user: User, username: string, password: string){
    if(!user || !username || !password){
      throw new HttpException('Missing arguments', HttpStatus.BAD_REQUEST);
    }
    const isMatch = await compare(password, user.password);
    if(!isMatch){
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
    let exists;
    try {
      exists = await this.findOne({username: username});
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if(exists){
      throw new HttpException('username exists', HttpStatus.BAD_REQUEST);
    }
    user.username = username;

    try {
      const result = await this.update(user.id,user);
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
