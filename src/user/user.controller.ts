import { Body, Controller, HttpException, HttpStatus, Post, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth, ApiCreatedResponse, ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';
import { User} from './models/user.model';
import { UserService } from './user.service';
import { RegisterVm } from './models/view-models/register-vm.model';
import { UserVm } from './models/view-models/user-vm.model';
import { ApiException } from '../shared/api-exception.model';
import { GetOperationId } from '../shared/utilities/get-operation-id';
import { LoginResponseVm } from './models/view-models/login-response-vm';
import { LoginVm } from './models/view-models/login-vm.model';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { UserRole } from './models/user-role.enum';

@Controller('users')
@ApiTags(User.modelName)
export class UserController {
  constructor(private readonly _userService: UserService) {
  }
  @Post('register')
  @ApiCreatedResponse({type: LoginResponseVm})
  @ApiBadRequestResponse({type: ApiException})
  @ApiOperation(GetOperationId(User.modelName, 'Register'))
  async register(@Body() registerVm: RegisterVm): Promise<UserVm>{
    const { username, password} = registerVm;

    if(!username){
      throw new HttpException('Username is required', HttpStatus.BAD_REQUEST);
    }

    if(!password){
      throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
    }
    
    let exist;
    try{
      exist = await this._userService.findOne({username})
    }catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if(exist){
      throw new HttpException(`${username} exists`, HttpStatus.BAD_REQUEST);
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

  @Get()
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'),RolesGuard)
  // @Roles(UserRole.Admin)
  @ApiOkResponse({type: UserVm, isArray: true})
  @ApiBadRequestResponse({type: ApiException})
  @ApiOperation(GetOperationId(User.modelName, 'GetAll'))
  async getAll(): Promise<UserVm[]>{
    try{
      const users = await this._userService.findAll({});
      return this._userService.map<UserVm[]>(users.map(user => user.toJSON()));
    }catch(e){
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
  }



}
