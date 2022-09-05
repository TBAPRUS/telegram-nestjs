# telegram-nestjs

## Description

[node-telegram-bot-api](https://www.npmjs.com/package/node-telegram-bot-api) wrapper for the Telegram Bots API made to work with the [Nest](https://github.com/nestjs/nest) framework.

## Installation

```bash
$ npm install telegram-nestjs
```

## Using the Module

```typescript
// Inside of your module imports
@Module({
  imports: [
    TelegramNestJSModule,
    // ...other modules
  ],
  providers: [AppController]
})
export class AppModule {
  constructor (
    private telegramRegister: TelegramRegisterService,
    private moduleRef: ModuleRef
  ) {
    this.telegramRegister.initBot(token); // insert your telegram token once in all app
    this.telegramRegister.register(AppController, this.moduleRef);
  }
}
```
```typescript
// Inside of your controller(provider)
@Injectable()
export class AppController {
  @Command('/start')
  public start (bot: TelegramBot, message: TelegramBot.Message) {
    bot.sendMessage(message.chat.id, 'Hello world!');
  }
}
```

## Support

If any bugs are found in the API wrapper, please open an issue on GitHub, or a Pull Request if you want to fix it yourself! Please be as explicit as possible and provide a minimum reproducing repository if at all possible, as it helps track down what went wrong.

## Stay in touch

- Author - [Mukhin Constantine](https://github.com/TBAPRUS)

## License

Telegram-nestjs is [MIT licensed](LICENSE).