import { UserVm } from './user-vm.model';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { MinLength,IsUrl } from 'class-validator';

export class ProfileVm{

  @MinLength(3)
  @ApiModelProperty()
  displayname:string;
  @ApiModelProperty()
  bio: string;
  @ApiModelProperty()
  @IsUrl()
  url: string;
}
