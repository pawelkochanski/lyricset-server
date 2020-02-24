import { AppModule } from './../app.module';
import { editFileName, imageFileFilter } from './../shared/middlewares/image-filter';
import { ProfileVm } from './models/view-models/profile-vm';
import { User as UserDecorator } from './../shared/decorators/user.decorator';
import { ValidationPipe } from './../shared/pipes/validation.pipe';
import { Body, Controller, HttpException, HttpStatus, Post, Get, UseGuards, Param, Query, Put, Req, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth, ApiCreatedResponse, ApiBadRequestResponse, ApiOkResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { User} from './models/user.model';
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
import { iif } from 'rxjs';
import { FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import { Avatar } from 'src/avatar/avatar';

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
      throw new HttpException('username is required', HttpStatus.BAD_REQUEST);
    }

    if(!password){
      throw new HttpException('password is required', HttpStatus.BAD_REQUEST);
    }

    if(!email){
      throw new HttpException('email is required', HttpStatus.BAD_REQUEST);
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

    @Put()
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'),RolesGuard)
    @Roles(UserRole.User)
    @ApiCreatedResponse()
    @ApiBadRequestResponse({type: ApiException})
    @ApiOperation(GetOperationId(User.modelName, 'Update'))
    async update(@Body() profileVm: ProfileVm, @UserDecorator() user: User): Promise<void>{
        const{displayname, bio, url} = profileVm;
      
        if(displayname!==''){
          console.log(displayname);
          user.displayname = displayname;
        }
        if (bio!=='') {
          console.log(bio);
          user.bio = bio;
        }
        if(url!==''){
          console.log(url);
          user.url = url;
        }
       
        try{
          await this._userService.update(user.id, user);
        }catch(e){
          throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return 
    }

    @Post('avatar')
    @UseInterceptors(FileInterceptor('file',{
      storage: diskStorage({
        destination: './avatars',
        filename:  editFileName
      }),
      fileFilter: imageFileFilter,
    }
    ))
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'),RolesGuard)
    @Roles(UserRole.User)
    @ApiCreatedResponse()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
      description: 'Avatars',
      type: Avatar,
    })
    @ApiBadRequestResponse({type: ApiException})
    @ApiOperation(GetOperationId(User.modelName, 'PostAvatar'))
    async postAvatar(@UploadedFile() file, @UserDecorator() user): Promise<void>{
      console.log(file);
      this._userService.setAvatar(user, `${AppModule.host}:${AppModule.port}/${file.path}`)
      console.log(user);
    }

    @Get('avatar/:id')
    @ApiCreatedResponse()
    @ApiBadRequestResponse({type: ApiException})
    @ApiOperation(GetOperationId(User.modelName, 'ServeAvatar'))
    async serveAvatar(@Param('id')fileId: string, @Res() res): Promise<void>{
      res.sendFile(fileId, { root: 'avatars'});
    }



}
