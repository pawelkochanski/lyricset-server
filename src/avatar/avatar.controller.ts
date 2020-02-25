import { User as UserDecorator} from './../shared/decorators/user.decorator';
import { diskStorage } from 'multer';
import { Controller, Post, UseInterceptors, UseGuards, UploadedFile, Get, Param, Res, Delete, HttpException, HttpStatus, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from 'src/shared/middlewares/image-filter';
import { ApiBearerAuth, ApiCreatedResponse, ApiConsumes, ApiBody, ApiBadRequestResponse, ApiOperation, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRole } from 'src/user/models/user-role.enum';
import { Avatar } from './models/avatar';
import { ApiException } from 'src/shared/api-exception.model';
import { GetOperationId } from 'src/shared/utilities/get-operation-id';
import { UserService } from 'src/user/user.service';
import { AppModule } from 'src/app.module';
import * as fs from 'fs'
@Controller('avatars')
@ApiTags('Avatar')
export class AvatarController {
    constructor(private readonly _userService: UserService) {
    }

    @Post()
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
      description: 'Avatar',
      type: Avatar,
    })
    @ApiBadRequestResponse({type: ApiException})
    @ApiOperation({summary: 'PostAvatar'})
    async postAvatar(@UploadedFile() file, @UserDecorator() user): Promise<{avatarId: string}>{
      console.log(file);
      const newPath = file.path.replace(/avatars\\/g, "");
      this._userService.setAvatar(user, `${newPath}`)
      console.log(user);
      return {avatarId: user.avatarId};
    }

    @Get(':id')
    @ApiOkResponse()
    @ApiBadRequestResponse({type: ApiException})
    @ApiOperation({summary: 'GetAvatar'})
    async serveAvatar(@Param('id')fileId: string, @Res() res): Promise<void>{
      res.sendFile(fileId, { root: 'avatars'});
    }

    @Delete(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'),RolesGuard)
    @Roles(UserRole.User)
    @ApiOkResponse()
    @ApiBadRequestResponse({type: ApiException})
    @ApiOperation({summary: 'RemoveAvatar'})
    async removeAvatar(@Param('id')fileId: string, @UserDecorator() user, @Req() req): Promise<void>{ 
      if(user.avatarUrl === `${AppModule.host}:${AppModule.port}${req.url}`){
        user.avatarUrl = null;
        fs.unlink(`avatars\\${fileId}`, (err) =>{console.log(err)});
      }
    }
}
