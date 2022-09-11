import { Message } from 'node-telegram-bot-api';
import { AbstractListener, GeneralResolver } from './AbstractListener';

type Config = {
  text: string
}

export class TextListener extends AbstractListener<GeneralResolver> {
  constructor (
    resolver: GeneralResolver,
    importance: number,
    private config: Config,
  ) {
    super(resolver, importance);
  }

  public checkIfValidate (message: Message) {
    const text = message.text;
    const searchText = this.config.text;
    const bot = this.getBot();
    const instance = this.getInstance();

    if (!text || !searchText || !bot || !instance) return false;

    const isDesiredText = text === searchText;
    return isDesiredText;
  }
}