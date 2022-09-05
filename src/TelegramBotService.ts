import { Injectable } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import { ICommandListener } from './listeners/CommandListener';
import { IRegExpListener } from './listeners/RegExpListener';

@Injectable()
export class TelegramBotService {
  private bot: TelegramBot | null;
  private waiters: ((bot: TelegramBot) => void)[];
  private commandListeners: ICommandListener[];
  private regexpListeners: IRegExpListener[];

  constructor () {
    this.bot = null;
    this.waiters = [];
    this.commandListeners = [];
    this.regexpListeners = [];
  }

  public initBot (token: string) {
    this.bot = new TelegramBot(token, { polling: true });
    this.triggerWaiters();
    this.startListen();
  }

  public waitBot (): Promise<TelegramBot> {
    return new Promise((resolve, reject) => {
      if (this.bot) return resolve(this.bot);
      this.waiters.push(resolve);
    });
  }

  public addCommandListener (listener: ICommandListener, instance: object) {
    if (!this.bot) throw new Error('Invalid adding command listener. You should init bot.');
    listener.setBot(this.bot);
    listener.setInstance(instance);
    this.commandListeners.push(listener);
  }

  public addRegExpListener (listener: ICommandListener, instance: object) {
    if (!this.bot) throw new Error('Invalid adding regexp listener. You should init bot.');
    listener.setBot(this.bot);
    listener.setInstance(instance);
    this.regexpListeners.push(listener);
  }

  private triggerWaiters () {
    if (!this.bot) return;

    while(this.waiters.length) {
      const waiter = this.waiters.pop();
      if (waiter) {
        waiter(this.bot);
      }
    }
  }

  private startListen () {
    if (!this.bot) return;

    this.bot.addListener('text', (message) => {
      for (const listener of this.commandListeners) {
        const isValid = listener.checkIfValidate(message);
        if (isValid) return listener.resolve(message);
      }

      for (const listener of this.regexpListeners) {
        const isValid = listener.checkIfValidate(message);
        if (isValid) return listener.resolve(message);
      }
    });
  }
}