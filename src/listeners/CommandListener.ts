import TelegramBot, { Message } from 'node-telegram-bot-api';
import { AbstractListener } from './AbstractListener';

export interface ICommandListener extends AbstractListener {
  resolve(message: Message): void
}

type Config = {
  command: string
}

type Resolver = (bot: TelegramBot, message: Message) => any

export class CommandListener extends AbstractListener implements ICommandListener {
  constructor (
    private config: Config,
    private resolver: Resolver
  ) {
    super();
    this.resolve = this.resolve.bind(this);
  }

  public checkIfValidate (message: Message) {
    const entities = message.entities;
    const text = message.text;
    const searchCommand = this.config.command;
    const bot = this.getBot();
    const instance = this.getInstance();

    if (!entities || !text || !searchCommand || !this.resolver || !bot || !instance) return false;

    const command = entities.find(({ offset, length, type }) =>
      type === 'bot_command' && text.slice(offset, offset + length) === searchCommand);
    if (!command) return false;

    return true;
  }

  public resolve (message: Message) {
    const bot = this.getBot();
    const instance = this.getInstance();
    if (!bot) throw new Error('Invalid bot. You should set bot.');
    if (!instance) throw new Error('Invalid instance. You should set instance.');

    this.resolver.call(instance, bot, message);
  }
}