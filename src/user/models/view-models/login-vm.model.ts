import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';


export class LoginVm {
  @ApiModelProperty()
  username: string;
  @ApiModelProperty()
  password: string;
}
