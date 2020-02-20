import { ValidationPipe } from './../shared/pipes/validation.pipe';
import { Body, Controller, HttpException, HttpStatus, Post, Get, UseGuards, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth, ApiCreatedResponse, ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';
import { User} from './models/user.model';
import { UserService } from './user.service';
import { RegisterVm } from './models/view-models/register-vm.model';
import { UserVm } from './models/view-models/user-vm.model';
import { ApiException } from '../shared/api-exception.model';
import { GetOperationId } from '../shared/utilities/get-operation-id';
import { LoginResponseVm } from './models/view-models/login-response-vm';
import { LoginVm } from './models/view-models/login-vm.model';

@Controller('users')
@ApiTags(User.modelName)
export class UserController {
  constructor(private readonly _userService: UserService) {
  }
  @Post('register')
  @ApiCreatedResponse({type: LoginResponseVm})
  @ApiBadRequestResponse({type: ApiException})
  @ApiOperation(GetOperationId(User.modelName, 'Register'))
  async register(@Body(new ValidationPipe()) registerVm: RegisterVm): Promise<UserVm>{
    const { username, email, password} = registerVm;

    if(!username){
      throw new HttpException('Username is required', HttpStatus.BAD_REQUEST);
    }

    if(!password){
      throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
    }

    if(!email){
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }
    
    let existEmail, existUsername;
    try{
      existEmail = await this._userService.findOne({email})
    }catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    try{
      existEmail = await this._userService.findOne({username})
    }catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if(existEmail){
      throw new HttpException(`email exists`, HttpStatus.BAD_REQUEST);
    }

    if(existUsername){
      throw new HttpException(`username exists`, HttpStatus.BAD_REQUEST);
    }

    const newUser = await this._userService.register(registerVm);
    return this._userService.map<UserVm>(newUser);

  }
  @Post('login')
  @ApiCreatedResponse({type: LoginResponseVm})
  @ApiBadRequestResponse({type: ApiException})
  @ApiOperation(GetOperationId(User.modelName, 'Login'))
  async login(@Body() loginVm: LoginVm): Promise<LoginResponseVm>{
    const fields = Object.keys(loginVm);
    fields.forEach(field=>{
      if (!loginVm[field]){
        throw new HttpException(`${field} is required`, HttpStatus.BAD_REQUEST);
      }
    });
    return this._userService.login(loginVm);
  }

  @Get('usernames')
  @ApiOkResponse()
  @ApiBadRequestResponse({type: ApiException})
  @ApiOperation(GetOperationId(User.modelName, 'GetUsernames'))
  async getUsernames(): Promise<{usernames: string[]}>{
    try{
      const users = await this._userService.findAll();
      return {usernames: users.map(user => {return user.username})};
    }catch(e){
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
  }

  @Get('emails')
  @ApiOkResponse()
  @ApiBadRequestResponse({type: ApiException})
  @ApiOperation(GetOperationId(User.modelName, 'GetEmails'))
  async getEmails(): Promise<{emails: string[]}>{
    try{
      const users = await this._userService.findAll();
      return {emails: users.map(user => {return user.email})};
    }catch(e){
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
  }



}
