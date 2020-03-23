import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class BandParamsVm {
  @ApiModelProperty()
  name: string;

}
