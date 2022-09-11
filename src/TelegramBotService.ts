import { Injectable } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import { SortedList } from './utils/SortedList';
import { CommandListener } from './listeners/CommandListener';
import { RegExpListener } from './listeners/RegExpListener';
import { TextListener } from './listeners/TextListener';

@Injectable()
export class TelegramBotService {
  private bot: TelegramBot | null;
  private waiters: ((bot: TelegramBot) => void)[];
  private commandListeners: SortedList<CommandListener>;
  private regexpListeners: SortedList<RegExpListener>;
  private textListeners: SortedList<TextListener>;

  constructor () {
    this.bot = null;
    this.waiters = [];
    this.commandListeners = new SortedList();
    this.regexpListeners = new SortedList();
    this.textListeners = new SortedList();
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

  public addCommandListener (listener: CommandListener, instance: object) {
    if (!this.bot) throw new Error('Invalid adding command listener. You should init bot.');
    listener.setBot(this.bot);
    listener.setInstance(instance);
    this.commandListeners.add(listener.getImportance(), listener);
  }

  public addRegExpListener (listener: RegExpListener, instance: object) {
    if (!this.bot) throw new Error('Invalid adding regexp listener. You should init bot.');
    listener.setBot(this.bot);
    listener.setInstance(instance);
    this.regexpListeners.add(listener.getImportance(), listener);
  }

  public addTextListener (listener: TextListener, instance: object) {
    if (!this.bot) throw new Error('Invalid adding text listener. You should init bot.');
    listener.setBot(this.bot);
    listener.setInstance(instance);
    this.textListeners.add(listener.getImportance(), listener);
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
      for (const listener of this.textListeners.list()) {
        const isValid = listener.checkIfValidate(message);
        if (isValid) return listener.resolve(message);
      }

      for (const listener of this.commandListeners.list()) {
        const isValid = listener.checkIfValidate(message);
        if (isValid) return listener.resolve(message);
      }

      for (const listener of this.regexpListeners.list()) {
        const isValid = listener.checkIfValidate(message);
        if (isValid) return listener.resolve(message);
      }
    });
  }
}