import TelegramBot, { Message } from 'node-telegram-bot-api';

export abstract class AbstractListener {
  private bot: TelegramBot | null;
  private instance: object | null;
  
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

  public abstract checkIfValidate (message: Message): boolean
}