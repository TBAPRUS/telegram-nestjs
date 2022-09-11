import TelegramBot, { Message } from 'node-telegram-bot-api';
import { AbstractListener, GeneralResolver } from './AbstractListener';

type Config = {
  regexp: RegExp
}

type Resolver = (bot: TelegramBot, message: Message) => any

export class RegExpListener extends AbstractListener<GeneralResolver> {
  constructor (
    resolver: Resolver,
    importance: number,
    private config: Config
  ) {
    super(resolver, importance);
  }

  public checkIfValidate (message: Message) {
    const text = message.text;
    const searchRegExp = this.config.regexp;
    const bot = this.getBot();
    const instance = this.getInstance();

    if (!text || !searchRegExp || !bot || !instance) return false;

    const isDesiredRegExp = searchRegExp.test(text);
    return isDesiredRegExp;
  }
}