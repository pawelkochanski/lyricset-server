import { ApiProperty } from "@nestjs/swagger";

export class Avatar {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
  }
  