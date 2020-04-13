import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { Band } from './models/band.model';
import { User } from '../user/models/user.model';
import { Member } from './models/member.model';
import { MemberRoles } from './models/member-roles.enum';
import { BandParamsVm } from './models/view-models/band-params-vm';
import { InjectModel } from '@nestjs/mongoose';
import { ModelType } from 'typegoose';
import { MapperService } from '../shared/mapper/mapper.service';

@Injectable()
export class BandsService extends BaseService<Band> {

  constructor(@InjectModel(Band.modelName) private readonly _bandModel: ModelType<Band>,
              private readonly _mapperService: MapperService,
  ) {
    super();
    this._model = _bandModel;
    this._mapper = _mapperService.mapper;
  }

  async createBand(bandVm: BandParamsVm, user: User) {
    const newBand: Band = new this._model();
    newBand.members = [];
    newBand.members.push(new Member(user.id, MemberRoles.Leader));
    newBand.name = bandVm.name;
    newBand.tracklist = [];

    try {
      const result =
        await this.create(newBand);
      return result.toJSON() as Band;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  async setImageBand(imageId: string, bandId: string): Promise<void> {
    let exists: Band;
    try {
      exists = await this.fidnById(bandId);
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (!exists) {
      throw new HttpException('set doesnt exist.', HttpStatus.BAD_REQUEST);
    }

    exists.imageId = imageId;

    try {
      await this.update(bandId, exists);
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  async verifyMember(bandid: string, user: User): Promise<{ band: Band, member: Member }> {
    console.log(user);
    console.log(bandid);
    console.log(bandid==='5e76638a402a5d03dc4ef575');
    let band, member;
    if(!user.bands.includes(bandid)){
      throw new HttpException('not your band', HttpStatus.BAD_REQUEST);
    }
    try {
      band = await this.fidnById(bandid);
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    member = band.members.find(member => member.userId===user.id);
    if(!member){
      throw new HttpException('you are not a member', HttpStatus.BAD_REQUEST);
    }
    return {
      band:band,
      member: member
    }
  }



}
