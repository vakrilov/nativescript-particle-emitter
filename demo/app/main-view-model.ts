import { Observable } from 'tns-core-modules/data/observable';
import { ParticleEmitter } from 'nativescript-particle-emitter';

export class HelloWorldModel extends Observable {
  public message: string;
  private particleEmitter: ParticleEmitter;

  constructor() {
    super();

    this.particleEmitter = new ParticleEmitter();
    this.message = this.particleEmitter.message;
  }
}
