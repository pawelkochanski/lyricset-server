import { UserDecorator } from '../shared/decorators/user.decorator';
import { diskStorage } from 'multer';
import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from '../shared/middlewares/image-filter';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../shared/guards/roles.guard';
import { Roles } from '../shared/decorators/roles.decorator';
import { UserRole } from '../user/models/user-role.enum';
import { Image } from './models/image';
import { ApiException } from '../shared/api-exception.model';
import { UserService } from '../user/user.service';
import * as fs from 'fs';
import { LyricsetService } from '../lyricset/lyricset.service';
import { BandsService } from '../bands/bands.service';
import { Band } from '../bands/models/band.model';
import { Member } from '../bands/models/member.model';
import { MemberRoles } from '../bands/models/member-roles.enum';
import { User } from '../user/models/user.model';
import { Lyricset } from '../lyricset/models/lyricset.model';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';

@Controller('images')
@ApiTags('Avatar')
export class ImageController {
  constructor(private readonly _userService: UserService,
              private readonly _lyricsetService: LyricsetService,
              private readonly _bandsService: BandsService) {
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
    const newPath = file.path.replace(/images\\/g, '');
    await this._userService.setAvatar(user, `${newPath}`);
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
    const newPath = file.path.replace(/images\\/g, '');
    if(!user.setlist.includes(id)){
      throw new HttpException('Set doesnt exist', HttpStatus.BAD_REQUEST);
    }
    await this._lyricsetService.setImageSet(`${newPath}`, id);
    return { imageId: newPath};
  }

  @Post('band/:id')
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
  @ApiOperation({ summary: 'PostBandImage' })
  async postBandImage(@UploadedFile() file, @UserDecorator() user, @Param('id')id: string): Promise<{ imageId: string }> {
    const newPath = file.path.replace(/images\\/g, '');
    let band: Band, member: Member;
    try {
      band = await this._bandsService.fidnById(id);
    } catch(e){
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if(!band){
      throw new HttpException('band doesnt exist', HttpStatus.BAD_REQUEST);
    }
    try{
      member = await band.members.find(member => member.userId === user.id);
    }catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if(!member){
      throw new HttpException('you are not a member', HttpStatus.BAD_REQUEST);
    }
    if(member.role !== MemberRoles.Leader){
      throw new HttpException('you are not a leader', HttpStatus.BAD_REQUEST);
    }

    await this._bandsService.setImageBand(`${newPath}`, id);
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
  @ApiImplicitQuery({
    name: 'setId',
    required: false,
    type: String
  })
  @ApiImplicitQuery({
    name: 'bandId',
    required: false,
    type: String
  })
  async removeAvatar(
    @Param('id')fileId: string,
    @UserDecorator() user: User,
    @Query('setId')setid :string,
    @Query('bandId')bandid: string): Promise<void> {
    let todelete = false;
    if(setid && user.setlist.includes(setid)){
      let exists: Lyricset;
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
    else if(bandid && user.bands.includes(bandid)) {
      let exists: Band;
      try {
        exists = await this._bandsService.fidnById(bandid);
      } catch (e) {
        throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      let member = exists.members.find(member => member.userId === user.id);
      if(!member){
        throw new HttpException('you are not a member', HttpStatus.BAD_REQUEST);
      }
      if(member.role!==MemberRoles.Leader){
        throw new HttpException('you are not a leader', HttpStatus.BAD_REQUEST);
      }
      exists.imageId = null;
      try{
        await this._bandsService.update(bandid, exists);
      }catch (e) {
        throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      todelete = true;
    }
    else if (user.avatarId === fileId) {
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
