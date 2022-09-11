import { Message } from 'node-telegram-bot-api';
import { AbstractListener, GeneralResolver } from './AbstractListener';

type Config = {
  command: string
}

export class CommandListener extends AbstractListener<GeneralResolver> {
  constructor (
    resolver: GeneralResolver,
    importance: number,
    private config: Config,
  ) {
    super(resolver, importance);
  }

  public checkIfValidate (message: Message) {
    const entities = message.entities;
    const text = message.text;
    const searchCommand = this.config.command;
    const bot = this.getBot();
    const instance = this.getInstance();

    if (!entities || !text || !searchCommand || !bot || !instance) return false;

    const command = entities.find(({ offset, length, type }) =>
      type === 'bot_command' && text.slice(offset, offset + length) === searchCommand);
    if (!command) return false;

    return true;
  }
}