import { ApiModelPropertyOptional } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class ApiException{
  @ApiModelPropertyOptional()
  statusCode?: number;
  @ApiModelPropertyOptional()
  message?: string;
  @ApiModelPropertyOptional()
  status?: string;
  @ApiModelPropertyOptional()
  error?: string;
  @ApiModelPropertyOptional()
  errors?: any;
  @ApiModelPropertyOptional()
  timpestamp?: string;
  @ApiModelPropertyOptional()
  path?: string;
}
