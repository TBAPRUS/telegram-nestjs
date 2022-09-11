import 'reflect-metadata';
import { Injectable } from '@nestjs/common';
import { MetadataScanner, ModuleRef } from '@nestjs/core';
import { TG_LISTENER } from './constants';
import { TelegramBotService } from './TelegramBotService';
import { CommandListener, TextListener } from './listeners';
import { RegExpListener } from './listeners/RegExpListener';

@Injectable()
export class TelegramRegisterService {
  private metadataScanner: MetadataScanner;

  constructor (private telegramBotService: TelegramBotService) {
    this.metadataScanner = new MetadataScanner();
  }
  
  public initBot (token: string) {
    this.telegramBotService.initBot(token);
  }

  public async register <Controller extends new (...args: any[]) => any> (controller: Controller, moduleRef: ModuleRef) {
    try {
      await this.telegramBotService.waitBot();
      const instance = moduleRef.get<Controller>(controller);
  
      const instancePrototype = Object.getPrototypeOf(instance);
  
      const methods = this.getMethods(instance, instancePrototype);
      for (const method of methods) {
        const listener = Reflect.getMetadata(TG_LISTENER, method);
  
        if (!listener) continue;
  
        if (listener instanceof CommandListener) {
          this.telegramBotService.addCommandListener(listener, instance);
          continue;
        }

        if (listener instanceof RegExpListener) {
          this.telegramBotService.addRegExpListener(listener, instance);
          continue;
        }

        if (listener instanceof TextListener) {
          this.telegramBotService.addTextListener(listener, instance);
          continue;
        }
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  private getMethods<Instance extends new (...args: any[]) => any> (instance: Instance, instancePrototype: Record<string, Function>) {
    return this.metadataScanner.scanFromPrototype(instance, instancePrototype, (name) => instancePrototype[name]);
  }
}