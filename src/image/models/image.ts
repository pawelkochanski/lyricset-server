import { ApiProperty } from "@nestjs/swagger";

export class Image{
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
  }
