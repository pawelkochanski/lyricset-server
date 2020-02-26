import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';


export class PasswordVm {
  @ApiModelProperty()
  password: string;
  @ApiModelProperty()
  newpassword: string;
}