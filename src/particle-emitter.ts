import { AbsoluteLayout } from 'tns-core-modules/ui/layouts/absolute-layout';
import { isAndroid } from 'tns-core-modules/platform';
import { View, booleanConverter, Color } from 'tns-core-modules/ui/core/view';
import { Label } from 'tns-core-modules/ui/label';
import { Property } from "tns-core-modules/ui/core/properties";
import { Particle, SIZE } from "./particle";

const CURVE = "easeOut";
const isLogEnabled = false;

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

  public velocity: number;
  public velocityVariation: number;
  public emitDirection: number;
  public emitDirectionVariation: number;

  public colorPalette: Color[];

  private particlePool: Particle[] = [];
  private timerId;

  private emitBoxDebug: View;
  private emitDirectionMinDebug: View;
  private emitDirectionMaxDebug: View;
  private emitAngleStartDebug: View;
  private emitAngleEndDebug: View;

  constructor() {
    super();
    this.clipToBounds = false;

    this.createDebugElements();
  }

  private createDebugElements() {
    this.emitBoxDebug = new Label();
    this.emitBoxDebug.borderColor = "black";
    this.emitBoxDebug.borderWidth = 1;
    this.emitBoxDebug.style.zIndex = 100;
    this.emitBoxDebug.width = 2;
    this.emitBoxDebug.height = 2;

    this.emitDirectionMaxDebug = this.createDebugLine("orange");
    this.emitDirectionMinDebug = this.createDebugLine("red");
    this.emitAngleStartDebug = this.createDebugLine("green");
    this.emitAngleEndDebug = this.createDebugLine("green");

    this.addChild(this.emitBoxDebug);
    this.addChild(this.emitAngleStartDebug);
    this.addChild(this.emitAngleEndDebug);
    this.addChild(this.emitDirectionMaxDebug);
    this.addChild(this.emitDirectionMinDebug);
  }

  private createDebugLine(color: string): View {
    const line = new Label();
    line.backgroundColor = color;
    line.style.zIndex = 100;
    line.width = 1;
    line.height = 1;
    line.originX = 0;
    line.originY = 0.5;
    return line;
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

    this.addChild(particle);

    return particle;
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
    log("releaseParticle");

    p.hide();

    this.particlePool.push(p);
  }

  public emitParticle() {
    const p = this.getParticle();

    // Get origin coordinates in the box
    const x = randRange(this.x - this.areaWidth / 2, this.x + this.areaWidth / 2) - SIZE / 2;
    const y = randRange(this.y - this.areaHeight / 2, this.y + this.areaHeight / 2) - SIZE / 2;
    const vel = randRange(this.velocity - this.velocityVariation, this.velocity + this.velocityVariation);
    const angle = randRange(this.emitDirection - this.emitDirectionVariation, this.emitDirection + this.emitDirectionVariation);
    const angleRad = angle / 180 * Math.PI;
    const dx = x + Math.cos(angleRad) * vel;
    const dy = y - Math.sin(angleRad) * vel;

    p.opacity = 1;
    p.translateX = x;
    p.translateY = y;
    p.scaleX = 0.2;
    p.scaleY = 0.2;
    p.backgroundColor = this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];
    p.show();

    p.animate({
      translate: { x: dx, y: dy },
      scale: { x: 1, y: 1 },
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

  updateDebugElements() {
    this.updateDE(
      this.emitBoxDebug,
      this.x - this.areaWidth / 2 - 1,
      this.y - this.areaHeight / 2 - 1,
      this.areaWidth + 2,
      this.areaHeight + 2
    );

    this.updateDE(
      this.emitDirectionMinDebug,
      this.x,
      this.y,
      this.velocity - this.velocityVariation,
      1,
      -this.emitDirection);

    this.updateDE(
      this.emitDirectionMaxDebug,
      this.x,
      this.y,
      this.velocity + this.velocityVariation,
      1,
      -this.emitDirection);

    this.updateDE(
      this.emitAngleStartDebug,
      this.x,
      this.y,
      this.velocity,
      1,
      -this.emitDirection - this.emitDirectionVariation);

    this.updateDE(
      this.emitAngleEndDebug,
      this.x,
      this.y,
      this.velocity,
      1,
      -this.emitDirection + this.emitDirectionVariation);
  }

  private updateDE(de: View, left: number, top: number, width: number, height: number, rotate: number = 0) {
    if (this.showDebugElement) {
      de.visibility = "visible";
      de.left = left;
      de.top = top;
      de.width = width;
      de.height = height;
      de.rotate = rotate;
    } else {
      de.visibility = "collapse";
    }
  }
}
function randRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function updateDebugElements(pe: ParticleEmitter, newValue: any, oldValue: any) {
  pe.updateDebugElements();
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
  valueChanged: updateDebugElements
});
xProperty.register(ParticleEmitter);

export const yProperty = new Property<ParticleEmitter, number>({
  name: "y",
  defaultValue: 0,
  valueConverter: parseFloat,
  valueChanged: updateDebugElements
});
yProperty.register(ParticleEmitter);


export const areaWidthProperty = new Property<ParticleEmitter, number>({
  name: "areaWidth",
  defaultValue: 20,
  valueConverter: parseFloat,
  valueChanged: updateDebugElements
});
areaWidthProperty.register(ParticleEmitter);

export const areaHeightProperty = new Property<ParticleEmitter, number>({
  name: "areaHeight",
  defaultValue: 20,
  valueConverter: parseFloat,
  valueChanged: updateDebugElements
});
areaHeightProperty.register(ParticleEmitter);

export const showDebugElementProperty = new Property<ParticleEmitter, boolean>({
  name: "showDebugElement",
  defaultValue: false,
  valueConverter: booleanConverter,
  valueChanged: updateDebugElements
});
showDebugElementProperty.register(ParticleEmitter);

export const durationProperty = new Property<ParticleEmitter, number>({
  name: "duration",
  defaultValue: 800,
  valueConverter: parseInt,
  valueChanged: updateDebugElements
});
durationProperty.register(ParticleEmitter);

export const velocityProperty = new Property<ParticleEmitter, number>({
  name: "velocity",
  defaultValue: 80,
  valueConverter: parseInt,
  valueChanged: updateDebugElements
});
velocityProperty.register(ParticleEmitter);

export const velocityVariationProperty = new Property<ParticleEmitter, number>({
  name: "velocityVariation",
  defaultValue: 40,
  valueConverter: parseInt,
  valueChanged: updateDebugElements
});
velocityVariationProperty.register(ParticleEmitter);

export const emitDirectionProperty = new Property<ParticleEmitter, number>({
  name: "emitDirection",
  defaultValue: 90,
  valueConverter: parseInt,
  valueChanged: updateDebugElements
});
emitDirectionProperty.register(ParticleEmitter);

export const emitDirectionVariationProperty = new Property<ParticleEmitter, number>({
  name: "emitDirectionVariation",
  defaultValue: 180,
  valueConverter: parseInt,
  valueChanged: updateDebugElements
});
emitDirectionVariationProperty.register(ParticleEmitter);

function colorPaletteConverter(value: string): Color[] {
  return value.split(",").map(v => new Color(v.trim()));
}
export const colorPaletteProperty = new Property<ParticleEmitter, Color[]>({
  name: "colorPalette",
  defaultValue: [new Color("blue")],
  valueConverter: colorPaletteConverter,
  valueChanged: updateDebugElements
});
colorPaletteProperty.register(ParticleEmitter);
