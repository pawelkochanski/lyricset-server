import { LyricsetService } from './lyricset.service';
import { Controller, Post, HttpStatus, Body, HttpException, Get, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Lyricset } from './models/lyricset.model';
import { GetOperationId } from 'src/shared/utilities/get-operation-id';
import { LyricsetVm } from './models/view-models/lyricset-vm.model';
import { ApiException } from 'src/shared/api-exception.model';
import { LyricSetParams } from './models/view-models/lyricset.params.model';

@Controller('lyricsets')
@ApiTags(Lyricset.modelName)
export class LyricsetController {
    constructor(private readonly _lyricsetService: LyricsetService){}

    @Post()
    @ApiResponse({status: HttpStatus.CREATED, type: LyricsetVm})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, type: ApiException})
    @ApiOperation(GetOperationId(Lyricset.modelName, 'Create'))
    async create(@Body() params: LyricSetParams): Promise<LyricsetVm>{
        const name = params.name;

        if(!name){
            throw new HttpException('Name is required', HttpStatus.BAD_REQUEST);
        }

        try {
            const newLyricset = await this._lyricsetService.createLyricset(params);
            return this._lyricsetService.map<LyricsetVm>(newLyricset);
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    @ApiResponse({status: HttpStatus.OK, type: LyricsetVm})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, type: ApiException})
    @ApiOperation(GetOperationId(Lyricset.modelName, 'Get'))
    async getById(@Param('id') id: string): Promise<LyricsetVm>{
        try{
            const lyricset = await this._lyricsetService.fidnById(id);
            return this._lyricsetService.map<LyricsetVm>(lyricset.toJSON());
        } catch(error){
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put()
    @ApiResponse({status: HttpStatus.CREATED, type: LyricsetVm})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, type: ApiException})
    @ApiOperation(GetOperationId(Lyricset.modelName, 'Update'))
    async update(@Body() vm: LyricsetVm): Promise<LyricsetVm>{
        const{id, name, description, tracklist, imageUrl} = vm;

        if(!vm || !id){
            throw new HttpException('Missing parameters', HttpStatus.BAD_REQUEST);
        }

        const exist = await this._lyricsetService.fidnById(id);

        if(!exist){
            throw new HttpException(`${id} Not found`, HttpStatus.BAD_REQUEST);
        }

        exist.name = name;
        exist.description = description
        exist.tracklist = tracklist;
        exist.imageUrl = imageUrl;

        try{
            const updated = await this._lyricsetService.update(id,exist);
            return this._lyricsetService.map<LyricsetVm>(updated.toJSON());
        }catch(error){
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Delete(':id')
    @ApiResponse({status: HttpStatus.CREATED, type: LyricsetVm})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, type: ApiException})
    @ApiOperation(GetOperationId(Lyricset.modelName, 'Delete'))
    async delete(@Param('id')id: string): Promise<LyricsetVm>{
        try {
            const deleted = await this._lyricsetService.delete(id);
            return this._lyricsetService.map<LyricsetVm>(deleted.toJSON());
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
