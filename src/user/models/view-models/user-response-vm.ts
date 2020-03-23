import { BaseModelVm } from '../../../shared/base.model';
import { UserRole } from '../user-role.enum';
import {
  ApiModelProperty,
  ApiModelPropertyOptional,
} from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { EnumToArray } from '../../../shared/utilities/enum-to-array';

export class UserResponseVm{
  @ApiModelPropertyOptional({enum: EnumToArray(UserRole)})
  role?: UserRole;
  @ApiModelProperty()
  displayname:string;
  @ApiModelProperty()
  bio: string;
  @ApiModelProperty()
  url: string;
  @ApiModelProperty()
  avatarId: string;
}
