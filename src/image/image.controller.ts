import { User as UserDecorator } from './../shared/decorators/user.decorator';
import { diskStorage } from 'multer';
import {
  Controller,
  Post,
  UseInterceptors,
  UseGuards,
  UploadedFile,
  Get,
  Param,
  Res,
  Delete,
  HttpException,
  HttpStatus,
  Req, Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from 'src/shared/middlewares/image-filter';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiConsumes,
  ApiBody,
  ApiBadRequestResponse,
  ApiOperation,
  ApiTags,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRole } from 'src/user/models/user-role.enum';
import { Image } from './models/image';
import { ApiException } from 'src/shared/api-exception.model';
import { UserService } from 'src/user/user.service';
import * as fs from 'fs';
import { LyricsetService } from '../lyricset/lyricset.service';

@Controller('images')
@ApiTags('Avatar')
export class ImageController {
  constructor(private readonly _userService: UserService,
              private readonly _lyricsetService: LyricsetService) {
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file', {
      storage: diskStorage({
        destination: './images',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    },
  ))
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.User)
  @ApiCreatedResponse()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Avatar',
    type: Image,
  })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ summary: 'PostAvatar' })
  async postAvatar(@UploadedFile() file, @UserDecorator() user): Promise<{ imageId: string }> {
    console.log(file);
    const newPath = file.path.replace(/images\\/g, '');
    await this._userService.setAvatar(user, `${newPath}`);
    console.log(user);
    return { imageId: user.avatarId };
  }

  @Post('set/:id')
  @UseInterceptors(FileInterceptor('file', {
      storage: diskStorage({
        destination: './images',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    },
  ))
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.User)
  @ApiCreatedResponse()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'setImage',
    type: Image,
  })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ summary: 'PostSetImage' })
  async postSetImage(@UploadedFile() file, @UserDecorator() user, @Param('id')id: string): Promise<{ imageId: string }> {
    console.log(file);
    const newPath = file.path.replace(/images\\/g, '');
    if(!user.setlist.includes(id)){
      throw new HttpException('Set doesnt exist', HttpStatus.BAD_REQUEST);
    }
    await this._lyricsetService.setImageSet(`${newPath}`, id);
    return { imageId: newPath};
  }

  @Get(':id')
  @ApiOkResponse()
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ summary: 'GetAvatar' })
  async serveAvatar(@Param('id')fileId: string, @Res() res): Promise<void> {
    res.sendFile(fileId, { root: 'images' });
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.User)
  @ApiOkResponse()
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ summary: 'RemoveAvatar' })
  async removeAvatar(@Param('id')fileId: string, @UserDecorator() user, @Req() req, @Query('setId')setid :string): Promise<void> {
    console.log(setid);
    let todelete = false;
    if(setid && user.setlist.includes(setid)){
      let exists;
      try {
        exists = await this._lyricsetService.fidnById(setid);
      } catch (e) {
        throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      exists.imageId = null;
      try{
        await this._lyricsetService.update(setid, exists);
      }catch (e) {
        throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      todelete = true;
    }
    if (user.avatarId === fileId) {
      user.avatarId = null;
      todelete = true;
      try{
        await this._userService.update(user.id, user);
      }catch (e) {
        throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    if(todelete){
      fs.unlink(`images\\${fileId}`, (err) => {
        console.log(err);
      });
      return;
    }
    throw new HttpException('Unauthorized.', HttpStatus.UNAUTHORIZED);
  }
}
