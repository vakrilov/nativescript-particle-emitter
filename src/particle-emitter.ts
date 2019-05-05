import { AbsoluteLayout } from 'tns-core-modules/ui/layouts/absolute-layout';
import { isAndroid } from 'tns-core-modules/platform';
import { View, booleanConverter } from 'tns-core-modules/ui/core/view';
import { AnimationDefinition } from 'tns-core-modules/ui/animation';
import { Label } from 'tns-core-modules/ui/label';
import { Property } from "tns-core-modules/ui/core/properties";

const SIZE = 10;
const CURVE = "easeOut";
const isLogEnabled = false;

class Particle extends Label {

}

function log(...args) {
  if (isLogEnabled) {
    console.log(...args);
  }
}

export class ParticleEmitter extends AbsoluteLayout {
  public isEmitting: boolean = false;

  public x: number;
  public y: number;
  public interval: number;
  public areaWidth: number;
  public areaHeight: number;
  public duration: number;
  public emitBatch: number;
  public showDebugElement: boolean;

  private particlePool: Particle[] = [];
  private timerId;
  private debugElement: Label;

  constructor() {
    super();
    this.clipToBounds = false;

    this.debugElement = new Label();
    this.debugElement.borderColor = "black";
    this.debugElement.borderWidth = 1;
    this.debugElement.style.zIndex = 100;
    this.debugElement.width = 2;
    this.debugElement.height = 2;

    this.addChild(this.debugElement);
  }

  public createNativeView() {
    const result = super.createNativeView();

    if (isAndroid) {
      log("setClipChildren: " + result + " clip: " + (<any>result).getClipChildren());
      (<any>result).setClipChildren(false);
    }

    return result;
  }

  public createParticle(): Particle {
    log("createParticle");

    const particle = new Particle();
    particle.width = SIZE;
    particle.height = SIZE;
    particle.borderRadius = SIZE / 2;
    particle.visibility = "hidden";
    particle.backgroundColor = "blue";
    this.addChild(particle);

    return particle;
  }

  prepareParticle(p: Particle, x: number, y: number) {
    p.opacity = 1;
    p.scaleX = 1;
    p.scaleY = 1;
    p.translateX = x;
    p.translateY = y;
    p.visibility = "visible";
  }

  getParticle(): Particle {
    if (this.particlePool.length) {
      log("getParticle -> recycle");
      return this.particlePool.pop();
    } else {
      log("getParticle -> create");
      return this.createParticle();
    }
  }

  releaseParticle(p: Particle) {
    p.visibility = "hidden";

    setTimeout(() => {
      log("releaseParticle");

      this.particlePool.push(p);
    }, 5);

  }

  public emitParticle() {
    const p = this.getParticle();
    const x = randRange(this.x - this.areaWidth / 2, this.x + this.areaWidth / 2) - SIZE / 2;
    const y = randRange(this.y - this.areaHeight / 2, this.y + this.areaHeight / 2) - SIZE / 2;

    this.prepareParticle(p, x, y);

    const dx = x + Math.random() * 150 - 75;
    const dy = y + Math.random() * 150 - 75;

    p.animate({
      translate: { x: dx, y: dy },
      scale: { x: 5, y: 5 },
      opacity: 0,
      duration: this.duration,
      curve: CURVE,
    }).then(() => {
      this.releaseParticle(p);
    });
  }

  private start() {
    this.timerId = setInterval(() => {
      for (let i = 0; i < this.emitBatch; i++) {
        this.emitParticle();
      }
    }, this.interval);
    log("Emitter -> started");
  }

  private stop() {
    clearInterval(this.timerId);
    this.timerId = undefined;
    log("Emitter -> stopped");
  }

  public IsEmittingChanged() {
    this.isEmitting ? this.start() : this.stop();
  }

  public intervalChanged() {
    if (this.isEmitting) {
      this.stop();
      this.start();
    }
  }

  _update() {
    if (this.showDebugElement) {
      this.debugElement.visibility = "visible";

      this.debugElement.width = this.areaWidth + 2;
      this.debugElement.height = this.areaHeight + 2;
      this.debugElement.left = this.x - this.areaWidth / 2 - 1;
      this.debugElement.top = this.y - this.areaHeight / 2 - 1;

    } else {
      this.debugElement.visibility = "collapse";
    }
  }
}
function randRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function update(pe: ParticleEmitter, newValue: any, oldValue: any) {
  // console.log("update", newValue);
  pe._update();
}

export const isEmittingProperty = new Property<ParticleEmitter, boolean>({
  name: "isEmitting",
  defaultValue: false,
  valueConverter: booleanConverter,
  valueChanged: (pe) => pe.IsEmittingChanged()
});
isEmittingProperty.register(ParticleEmitter);

export const emitBatchProperty = new Property<ParticleEmitter, number>({
  name: "emitBatch",
  defaultValue: 1,
  valueConverter: parseInt
});
emitBatchProperty.register(ParticleEmitter);

export const intervalProperty = new Property<ParticleEmitter, number>({
  name: "interval",
  defaultValue: 50,
  valueConverter: parseInt,
  valueChanged: (pe) => pe.intervalChanged()
});
intervalProperty.register(ParticleEmitter);

export const xProperty = new Property<ParticleEmitter, number>({
  name: "x",
  defaultValue: 0,
  valueConverter: parseFloat,
  valueChanged: update
});
xProperty.register(ParticleEmitter);

export const yProperty = new Property<ParticleEmitter, number>({
  name: "y",
  defaultValue: 0,
  valueConverter: parseFloat,
  valueChanged: update
});
yProperty.register(ParticleEmitter);


export const areaWidthProperty = new Property<ParticleEmitter, number>({
  name: "areaWidth",
  defaultValue: 20,
  valueConverter: parseFloat,
  valueChanged: update
});
areaWidthProperty.register(ParticleEmitter);

export const areaHeightProperty = new Property<ParticleEmitter, number>({
  name: "areaHeight",
  defaultValue: 20,
  valueConverter: parseFloat,
  valueChanged: update
});
areaHeightProperty.register(ParticleEmitter);

export const showDebugElementProperty = new Property<ParticleEmitter, boolean>({
  name: "showDebugElement",
  defaultValue: false,
  valueConverter: booleanConverter,
  valueChanged: update
});
showDebugElementProperty.register(ParticleEmitter);

export const durationProperty = new Property<ParticleEmitter, number>({
  name: "duration",
  defaultValue: 800,
  valueConverter: parseInt,
  valueChanged: update
});
durationProperty.register(ParticleEmitter);