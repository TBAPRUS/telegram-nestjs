import TelegramBot, { Message } from 'node-telegram-bot-api';

export type GeneralResolver = (bot: TelegramBot, message: Message) => any

export abstract class AbstractListener<Resolver extends GeneralResolver = GeneralResolver> {
  private bot: TelegramBot | null;
  private instance: object | null;
  
  constructor (
    private resolver: Resolver,
    private importance: number,
  ) {
    this.resolve = this.resolve.bind(this);
  }
  
  public setBot (bot: TelegramBot | null): void {
    this.bot = bot;
  }

  public getBot (): TelegramBot | null {
    return this.bot;
  }

  public setInstance (instance: object) {
    this.instance = instance;
  }

  public getInstance (): object | null {
    return this.instance;
  }

  public getImportance () {
    return this.importance;
  }

  public abstract checkIfValidate (message: Message): boolean

  public resolve (message: Message) {
    const bot = this.getBot();
    const instance = this.getInstance();
    if (!bot) throw new Error('Invalid bot. You should set bot.');
    if (!instance) throw new Error('Invalid instance. You should set instance.');

    this.resolver.call(instance, bot, message);
  }
}