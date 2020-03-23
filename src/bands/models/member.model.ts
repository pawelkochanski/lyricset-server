import { prop } from 'typegoose';
import { MemberRoles } from './member-roles.enum';

export class Member {

  constructor(public userId: string, public role: MemberRoles) {
  }

}
