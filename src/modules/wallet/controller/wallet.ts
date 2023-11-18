import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Res, Query, Body } from '@nestjs/common';
import { getBalanceDto, checkDto, opDto } from './wallet.dto';

import { WalletService } from '../service';
import { Response } from 'express';
import { RequestModel } from './request.model';

@ApiTags('Wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly service: WalletService) {}
  @Get('/test')
  public async test(): Promise<string> {
    return 'test';
  }
  // @Get('/batchCreate')
  // public async batchCreate(): Promise<string> {
  //   return this.service.batchCreate();
  // }
  @Post('/bind')
  public async bind(@Body() dto: RequestModel, @Res() res: Response) {
    const result = await this.service.bind(dto.certificate);
    res
      .status(result.status)
      .json({ message: result.message, data: result.data });
  }
  @Get('/check')
  public async check(@Query() dto: checkDto, @Res() res: Response) {
    const result = await this.service.check(dto);
    res
      .status(result.status)
      .json({ message: result.message, data: result.data });
  }
  @Post('/clearBind')
  public async clearBind(@Body() model: RequestModel, @Res() res: Response) {
    const result = await this.service.clearBind(model.certificate);
    res
      .status(result.status)
      .json({ message: result.message, data: result.data });
  }
