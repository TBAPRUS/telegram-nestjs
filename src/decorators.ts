import 'reflect-metadata';
import { TG_LISTENER } from './constants';
import { TextListener } from './listeners/TextListener';
import { CommandListener } from './listeners';
import { RegExpListener } from './listeners/RegExpListener';

type Config = {
  importance: number
}

export function Command (command: string, config?: Config) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const commandListener = new CommandListener(descriptor.value, config?.importance || 0, { command });
    Reflect.defineMetadata(TG_LISTENER, commandListener, descriptor.value);
    return descriptor;
  };
}

export function RegExp (regexp: RegExp, config?: Config) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const commandListener = new RegExpListener(descriptor.value, config?.importance || 0, { regexp });
    Reflect.defineMetadata(TG_LISTENER, commandListener, descriptor.value);
    return descriptor;
  };
}

export function Text (text: string, config?: Config) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const commandListener = new TextListener(descriptor.value, config?.importance || 0, { text });
    Reflect.defineMetadata(TG_LISTENER, commandListener, descriptor.value);
    return descriptor;
  };
}