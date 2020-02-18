import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsString, IsEmail, Matches, MinLength } from 'class-validator';

export class RegisterVm {
  @ApiModelProperty()
  @MinLength(3)
  @IsString()
  username: string;
  @ApiModelProperty()
  @IsString()
  @MinLength(6)
  @Matches(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})'))
  password: string;
  @ApiModelProperty()
  @IsEmail()
  email: string;
}
