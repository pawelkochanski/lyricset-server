import { BaseModelVm } from '../../../shared/base.model';
import { UserRole } from '../user-role.enum';
import {
  ApiModelProperty,
  ApiModelPropertyOptional,
} from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { EnumToArray } from '../../../shared/utilities/enum-to-array';

export class UserVm extends BaseModelVm{
  @ApiModelProperty()
  username: string;
  @ApiModelProperty()
  email: string;
  @ApiModelPropertyOptional({enum: EnumToArray(UserRole)})
  role?: UserRole
}
