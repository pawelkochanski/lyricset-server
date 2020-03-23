import { PasswordVm } from './models/view-models/password-vm';
import { ProfileVm } from './models/view-models/profile-vm';
import { UserDecorator } from '../shared/decorators/user.decorator';
import { ValidationPipe } from './../shared/pipes/validation.pipe';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Get,
  UseGuards,
  Param,
  Query,
  Put,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { User } from './models/user.model';
import { UserService } from './user.service';
import { RegisterVm } from './models/view-models/register-vm.model';
import { UserVm } from './models/view-models/user-vm.model';
import { ApiException } from '../shared/api-exception.model';
import { GetOperationId } from '../shared/utilities/get-operation-id';
import { LoginResponseVm } from './models/view-models/login-response-vm';
import { LoginVm } from './models/view-models/login-vm.model';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRole } from './models/user-role.enum';
import { LyricsetVm } from 'src/lyricset/models/view-models/lyricset-vm.model';
import { UserResponseVm } from './models/view-models/user-response-vm';
import { LyricsetService } from '../lyricset/lyricset.service';

@Controller('users')
@ApiTags(User.modelName)
export class UserController {
  constructor(private readonly _userService: UserService,
              private readonly _lyricsetService: LyricsetService) {
  }

  @Post('register')
  @ApiCreatedResponse({ type: LoginResponseVm })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ summary: 'Register' })
  async register(@Body(new ValidationPipe()) registerVm: RegisterVm): Promise<UserVm> {
    const { username, email, password } = registerVm;

    if (!username) {
      throw new HttpException('username is required', HttpStatus.BAD_REQUEST);
    }

    if (!password) {
      throw new HttpException('password is required', HttpStatus.BAD_REQUEST);
    }

    if (!email) {
      throw new HttpException('email is required', HttpStatus.BAD_REQUEST);
    }

    let existEmail, existUsername;
    try {
      existEmail = await this._userService.findOne({ email });
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    try {
      existEmail = await this._userService.findOne({ username });
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (existEmail) {
      throw new HttpException(`email exists`, HttpStatus.BAD_REQUEST);
    }

    if (existUsername) {
      throw new HttpException(`username exists`, HttpStatus.BAD_REQUEST);
    }

    const newUser = await this._userService.register(registerVm);
    return this._userService.map<UserVm>(newUser);

  }

  @Post('login')
  @ApiCreatedResponse({ type: LoginResponseVm })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ summary: 'Login' })
  async login(@Body() loginVm: LoginVm): Promise<LoginResponseVm> {
    const fields = Object.keys(loginVm);
    fields.forEach(field => {
      if (!loginVm[field]) {
        throw new HttpException(`${field} is required`, HttpStatus.BAD_REQUEST);
      }
    });
    return this._userService.login(loginVm);
  }

  @Get('usernames')
  @ApiOkResponse()
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ summary: 'GetUsernames' })
  async getUsernames(): Promise<{ usernames: string[] }> {
    try {
      const users = await this._userService.findAll();
      return {
        usernames: users.map(user => {
          return user.username;
        }),
      };
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Get('emails')
  @ApiOkResponse()
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ summary: 'GetEmails' })
  async getEmails(): Promise<{ emails: string[] }> {
    try {
      const users = await this._userService.findAll();
      return {
        emails: users.map(user => {
          return user.email;
        }),
      };
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Put()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.User)
  @ApiOkResponse({ type: ProfileVm })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ summary: 'UpdateSettings' })
  async updateSettings(@Body() profileVm: ProfileVm, @UserDecorator() user: User): Promise<ProfileVm> {
    const { displayname, bio, url } = profileVm;

    if (displayname !== '') {
      console.log(displayname);
      user.displayname = displayname;
    }
    if (bio !== '') {
      console.log(bio);
      user.bio = bio;
    }
    if (url !== '') {
      console.log(url);
      user.url = url;
    }

    try {
      await this._userService.update(user.id, user);
      return { displayname: user.displayname, bio: user.bio, url: user.url };
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('password')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.User)
  @ApiOkResponse()
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ summary: 'changePassword' })
  async changePassword(@Body() passwordVm: PasswordVm, @UserDecorator() user: User): Promise<void> {

    try {
      await this._userService.changePassword(user, passwordVm.password, passwordVm.newpassword);
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return;
  }

  @Put('username')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.User)
  @ApiOkResponse()
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ summary: 'changeUsername' })
  async changeUsername(@Body() usernameVm: LoginVm, @UserDecorator() user: User): Promise<void> {

    await this._userService.changeUsername(user, usernameVm.username, usernameVm.password);
    return;
  }

  @Get('search')
  @ApiOkResponse({ type: UserVm, isArray: true })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ summary: 'searchUser' })
  async searchUser(@Query('user') userQuery: string): Promise<UserResponseVm[]> {
    console.log(userQuery);
    const result = await this._userService.findAll();
    const returnValue = [] as UserResponseVm[];
    for (const user of result.filter(user => user.displayname.toLowerCase().includes(userQuery.toLowerCase()))) {
      const userMap = await this._userService.map<UserResponseVm>(user.toJSON(), false, null, 'UserResponseVm');
      returnValue.push(userMap);
    }
    return returnValue;
  }


  @Get(':id')
  @ApiOkResponse({ type: UserResponseVm })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ summary: 'GetUser' })
  async getUser(@Param('id') id: string): Promise<UserResponseVm> {
    console.log(id);
    const exists = await this._userService.fidnById(id);
    console.log(exists);
    return await this._userService.map<UserResponseVm>(exists.toJSON(), false, null, 'UserResponseVm');
  }

  @Get(':id/setlist')
  @ApiOkResponse({ type: LyricsetVm })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ summary: 'getUserSetList' })
  async getUserSetlist(@Param('id') id: string): Promise<LyricsetVm[]> {
    let exists;
    try {
      (exists as User) = await this._userService.fidnById(id);
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (!exists) {
      throw new HttpException('user not exists', HttpStatus.BAD_REQUEST);
    }
    const returnSets: LyricsetVm[] = [];
    for (const setid of exists.setlist) {
      let set;
      try {
        set = await this._lyricsetService.fidnById(setid);
        console.log(set);
      } catch (error) {
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      if (!set.isPrivate) {
        returnSets.push(await this._lyricsetService.map<LyricsetVm>(set.toJSON()));
      }
    }
    return returnSets;
  }
}

