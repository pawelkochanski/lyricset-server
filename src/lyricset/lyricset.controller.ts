import { LyricsetUpdateVm } from './models/view-models/update-vm.model';
import { UserService } from '../user/user.service';
import { User } from '../user/models/user.model';

import { UserRole } from '../user/models/user-role.enum';
import { LyricsetService } from './lyricset.service';
import {
    Controller,
    Post,
    HttpStatus,
    Body,
    HttpException,
    Get,
    Param,
    Put,
    Delete,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth, ApiCreatedResponse, ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';
import { Lyricset } from './models/lyricset.model';
import { GetOperationId } from 'src/shared/utilities/get-operation-id';
import { LyricsetVm } from './models/view-models/lyricset-vm.model';
import { ApiException } from 'src/shared/api-exception.model';
import { LyricSetParams } from './models/view-models/lyricset.params.model';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import {User as UserDecorator}  from 'src/shared/decorators/user.decorator' ;
import { Track } from '../track/models/track.model';

@Controller('lyricsets')
@ApiBearerAuth()
@ApiTags(Lyricset.modelName)
export class LyricsetController {
    constructor(private readonly _lyricsetService: LyricsetService,
        private readonly _userService: UserService){}

    @Post()
    @UseGuards(AuthGuard('jwt'),RolesGuard)
    @Roles(UserRole.User)
    @ApiCreatedResponse({type: LyricsetVm})
    @ApiBadRequestResponse({type: ApiException})
    @ApiOperation(GetOperationId(Lyricset.modelName, 'Create'))
    async create(@Body() params: LyricSetParams, @UserDecorator() user: User): Promise<LyricsetVm>{
        const name = params.name;
        if(!name){
            throw new HttpException('Name is required', HttpStatus.BAD_REQUEST);
        }

        try {
            const newLyricset = await this._lyricsetService.createLyricset(params);
            user.setlist.push(newLyricset.id);
            try{
                await this._userService.update(user.id, user);
            } catch(e){
                await this._lyricsetService.delete(newLyricset.id);
                throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return this._lyricsetService.map<LyricsetVm>(newLyricset);
        } catch (e) {
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('')
    @UseGuards(AuthGuard('jwt'),RolesGuard)
    @Roles(UserRole.User)
    @ApiResponse({status: HttpStatus.OK, type: LyricsetVm, isArray: true})
    @ApiBadRequestResponse({type: ApiException})
    @ApiOperation(GetOperationId(Lyricset.modelName, 'GetAll'))
    async getAll(@UserDecorator() user: User): Promise<LyricsetVm[]>{
        const returnSets : LyricsetVm[] = [];
        for (const setid of user.setlist) {
            try {
                returnSets.push(await this._lyricsetService.fidnById(setid));
            } catch (error) {
                throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return returnSets;
    }

    @Get(':id')
    @ApiResponse({status: HttpStatus.OK, type: LyricsetVm})
    @ApiBadRequestResponse({type: ApiException})
    @ApiOperation(GetOperationId(Lyricset.modelName, 'Get'))
    async getById(@Param('id') id: string): Promise<LyricsetVm>{
        try{
            const lyricset = await this._lyricsetService.fidnById(id);
            return this._lyricsetService.map<LyricsetVm>(lyricset.toJSON());
        } catch(error){
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Put(':id')
    @UseGuards(AuthGuard('jwt'),RolesGuard)
    @Roles(UserRole.User)
    @ApiOkResponse()
    @ApiBadRequestResponse({type: ApiException})
    @ApiOperation(GetOperationId(Lyricset.modelName, 'Update'))
    async update(@Param('id') id: string, @Body(new ValidationPipe()) vm: LyricsetUpdateVm, @UserDecorator() user: User){
        const{name, description, tracklist} = vm;

        if(!vm){
            throw new HttpException('Missing parameters', HttpStatus.BAD_REQUEST);
        }

        const exist: Lyricset = await this._lyricsetService.fidnById(id);

        if(!exist){
            throw new HttpException(`${id} Not found`, HttpStatus.BAD_REQUEST);
        }

        if(!user.setlist.includes(id)){
            throw new HttpException('Permission denied.', HttpStatus.UNAUTHORIZED);
        }

        exist.name = name;
        exist.description = description;
        exist.tracklist = tracklist;
        console.log(exist);

        try{
            const updated = await this._lyricsetService.update(id,exist);
        }catch(error){
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }


    @Delete(':id')
    @Roles(UserRole.Admin,UserRole.User)
    @UseGuards(AuthGuard('jwt'),RolesGuard)
    @ApiOkResponse({type: LyricsetVm})
    @ApiBadRequestResponse({type: ApiException})
    @ApiOperation(GetOperationId(Lyricset.modelName, 'Delete'))
    async delete(@Param('id')id: string): Promise<LyricsetVm>{
        try {
            const deleted = await this._lyricsetService.delete(id);
            return this._lyricsetService.map<LyricsetVm>(deleted.toJSON());
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }


    @Delete('user/:id')
    @Roles(UserRole.Admin,UserRole.User)
    @UseGuards(AuthGuard('jwt'),RolesGuard)
    @ApiOkResponse({type: LyricsetVm})
    @ApiBadRequestResponse({type: ApiException})
    @ApiOperation(GetOperationId(Lyricset.modelName, 'DeleteFromUser'))
    async deleteUsersset(@Param('id')id: string, @UserDecorator() user: User): Promise<void>{
        const length = user.setlist.length;
        try {
            const deleted = this._lyricsetService.delete(id);
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        user.setlist.splice(user.setlist.indexOf(id), 1);
        if(length===user.setlist.length){
            throw new HttpException('set doesnt exist', HttpStatus.BAD_REQUEST);
        }
        try {
            this._userService.update(user.id, user);
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
    }
}
