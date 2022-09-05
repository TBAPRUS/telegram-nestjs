import 'reflect-metadata';
import { TG_LISTENER } from './constants';
import { CommandListener } from './listeners';
import { RegExpListener } from './listeners/RegExpListener';

export function Command (command: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const commandListener = new CommandListener({ command }, descriptor.value);
    Reflect.defineMetadata(TG_LISTENER, commandListener, descriptor.value);
    return descriptor;
  };
}

export function RegExp (regexp: RegExp) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const commandListener = new RegExpListener({ regexp }, descriptor.value);
    Reflect.defineMetadata(TG_LISTENER, commandListener, descriptor.value);
    return descriptor;
  };
}