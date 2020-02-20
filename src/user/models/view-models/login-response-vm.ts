import { UserVm } from './user-vm.model';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class LoginResponseVm{
  @ApiModelProperty()
  exp: string | number;
  @ApiModelProperty()
  token:string;
  @ApiModelProperty()
  user: UserVm;
}
