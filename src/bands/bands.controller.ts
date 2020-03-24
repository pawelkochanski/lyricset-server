import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Band } from './models/band.model';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../shared/guards/roles.guard';
import { Roles } from '../shared/decorators/roles.decorator';
import { UserRole } from '../user/models/user-role.enum';
import { ApiException } from '../shared/api-exception.model';
import { UserDecorator } from '../shared/decorators/user.decorator';
import { User } from '../user/models/user.model';
import { BandVm } from './models/view-models/band-vm.model';
import { BandParamsVm } from './models/view-models/band-params-vm';
import { BandsService } from './bands.service';
import { UserService } from '../user/user.service';
import { MemberRoles } from './models/member-roles.enum';
import { LyricsetService } from '../lyricset/lyricset.service';


@Controller('bands')
@ApiTags(Band.modelName)
@ApiBearerAuth()
export class BandsController {

  constructor(private readonly _bandsService: BandsService,
              private readonly _userService: UserService,
              private readonly _lyricsetService: LyricsetService) {

  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.User)
  @ApiCreatedResponse({ type: BandVm })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ summary: 'Create Band' })
  async create(@Body() params: BandParamsVm, @UserDecorator() user: User): Promise<BandVm> {
    const name = params.name;
    console.log(user);
    console.log(name);
    if (!name) {
      throw new HttpException('Name is required', HttpStatus.BAD_REQUEST);
    }

    let bandVm;
    try {
      const newBand = await this._bandsService.createBand(params, user);
      bandVm = await this._bandsService.map<BandVm>(newBand);
    } catch (e) {
      throw new HttpException('band exists', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    try {
      user.bands.push(bandVm.id);
      await this._userService.update(user.id, user);
      console.log(user);
    } catch (e) {
      await this._bandsService.delete(bandVm.id);
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return bandVm;
  }

  @Put(':bandid/users/:userid')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.User)
  @ApiOkResponse()
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ summary: 'AddUserToBand' })
  async addUser(@Param('bandid') bandid: string,
                @Param('userid') userid: string,
                @Query('isLeader') isLeader: string,
                @UserDecorator() user: User): Promise<void> {
    let band: Band;
    let userToAdd: User;
    try {
      band = await this._bandsService.fidnById(bandid);
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (!band) {
      throw new HttpException('band not exists', HttpStatus.BAD_REQUEST);
    }
    try {
      userToAdd = await this._userService.fidnById(userid);
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (!userToAdd) {
      throw new HttpException('user not exists', HttpStatus.BAD_REQUEST);
    }

    if (userToAdd.bands.includes(bandid)) {
      throw new HttpException('user exists in band', HttpStatus.BAD_REQUEST);
    }
    const role = isLeader === 'true' ? MemberRoles.Leader : MemberRoles.Member;

    band.members.push({ userId: userToAdd.id, role: role });
    try {
      await this._bandsService.update(band.id, band);
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    userToAdd.bands.push(bandid);
    try {
      await this._userService.update(userToAdd.id, userToAdd);
    } catch (e) {
      await this._bandsService.delete(band.id);
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Get('')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.User)
  @ApiResponse({ status: HttpStatus.OK, type: BandVm, isArray: true })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ summary: 'GetAllBandsFromUser' })
  async getAll(@UserDecorator() user: User): Promise<BandVm[]> {
    console.log(user);
    const returnBands: BandVm[] = [];
    for (const bandId of user.bands) {
      try {
        const band = await this._bandsService.fidnById(bandId);
        returnBands.push(await this._bandsService.map<BandVm>(band.toJSON()));
      } catch (error) {
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    return returnBands;
  }

  @Get(':bandid')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.User)
  @ApiResponse({ status: HttpStatus.OK, type: BandVm })
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ summary: 'GetBandById' })
  async getBandById(@Param('bandid')bandid: string, @UserDecorator() user: User): Promise<BandVm> {
    console.log(user);
    console.log(bandid);
    const { band, member } = await this._bandsService.verifyMember(bandid, user);
    try {
      return await this._bandsService.map<BandVm>((band as any).toJSON());
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':bandid/users/:userid')
  @Roles(UserRole.Admin, UserRole.User)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOkResponse()
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ summary: 'DeleteUserFromBand' })
  async deleteUserFromBand(
    @Param('bandid')bandid: string,
    @Param('userid')userid: string,
    @UserDecorator() user: User): Promise<void> {
    const { band, member } = await this._bandsService.verifyMember(bandid, user);
    if (member.role !== MemberRoles.Leader && member.userId !== userid) {
      throw new HttpException('you are not leader', HttpStatus.UNAUTHORIZED);
    }
    const memberToDelete = band.members.find(member => member.userId === userid);
    if (!memberToDelete) {
      throw new HttpException('member not found', HttpStatus.BAD_REQUEST);
    }
    const indexB = band.members.indexOf(memberToDelete);
    band.members.splice(indexB, 1);
    try {
      await this._bandsService.update(band.id, band);
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    let userToDelete;
    try {
      userToDelete = await this._userService.fidnById(userid);
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (!userToDelete) {
      return;
    }
    const indexU = userToDelete.bands.indexOf(bandid);
    userToDelete.bands.splice(indexU, 1);
    try {
      await this._userService.update(userToDelete.id, userToDelete);
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  @Delete(':id')
  @Roles(UserRole.Admin, UserRole.User)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOkResponse({type: BandVm})
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ summary: 'UpdateBand' })
  async updateBand(@Param('id') bandid: string,
                   @UserDecorator() user,
                   @Body() bandVm: BandVm): Promise<void> {
    const { band, member } = await this._bandsService.verifyMember(bandid, user);
    if (member.role !== MemberRoles.Leader) {
      throw new HttpException('you are not a leader', HttpStatus.UNAUTHORIZED);
    }

    bandVm.tracklist.find(trackItem => {
      if (bandVm.tracklist.find(duplicate => trackItem.track_id === duplicate.track_id && duplicate !== trackItem)) {
        throw new HttpException('track exists', HttpStatus.BAD_REQUEST);
      }
    });

    band.name = bandVm.name;
    band.imageId = bandVm.imageId;
    band.tracklist = bandVm.tracklist;
    try{
      await this._bandsService.update(band.id, band);
    }catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Delete(':id')
  @Roles(UserRole.Admin, UserRole.User)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOkResponse()
  @ApiBadRequestResponse({ type: ApiException })
  @ApiOperation({ summary: 'DeleteBand' })
  async deleteBand(@Param('id')id: string, @UserDecorator() user: User): Promise<void> {
    const { band, member } = await this._bandsService.verifyMember(id, user);
    if (member.role !== MemberRoles.Leader) {
      throw new HttpException('you are not leader', HttpStatus.UNAUTHORIZED);
    }
    for (let member of band.members) {
      const findUser = await this._userService.fidnById(member.userId);
      const index = findUser.bands.indexOf(band.id);
      findUser.bands.splice(index, 1);
      try {
        await this._userService.update(findUser.id, findUser);
      } catch (error) {
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    try {
      await this._bandsService.delete(band.id);
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


}
