import TelegramBot, { Message } from 'node-telegram-bot-api';
import { AbstractListener } from './AbstractListener';

export interface IRegExpListener extends AbstractListener {
  resolve(message: Message): void
}

type Config = {
  regexp: RegExp
}

type Resolver = (bot: TelegramBot, message: Message) => any

export class RegExpListener extends AbstractListener implements IRegExpListener {
  constructor (
    private config: Config,
    private resolver: Resolver
  ) {
    super();
    this.resolve = this.resolve.bind(this);
  }

  public checkIfValidate (message: Message) {
    const text = message.text;
    const searchRegExp = this.config.regexp;
    const bot = this.getBot();
    const instance = this.getInstance();

    if (!text || !searchRegExp || !this.resolver || !bot || !instance) return false;

    const isDesiredRegExp = searchRegExp.test(text);
    return isDesiredRegExp;
  }

  public resolve (message: Message) {
    const bot = this.getBot();
    const instance = this.getInstance();
    if (!bot) throw new Error('Invalid bot. You should set bot.');
    if (!instance) throw new Error('Invalid instance. You should set instance.');

    this.resolver.call(instance, bot, message);
  }
}