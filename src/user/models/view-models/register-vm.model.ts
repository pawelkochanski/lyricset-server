import { LoginVm } from './login-vm.model';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class RegisterVm extends LoginVm{
  @ApiModelProperty()
  email: string;
}
