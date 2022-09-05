import { Module, Global } from '@nestjs/common';
import { TelegramBotService } from './TelegramBotService';
import { TelegramRegisterService } from './TelegramRegisterService';

@Global()
@Module({
  providers: [
    TelegramRegisterService,
    TelegramBotService
  ],
  exports: [
    TelegramRegisterService,
  ]
})
export class TelegramNestJSModule { }