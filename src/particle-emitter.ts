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

  public emitOriginX: number;
  public emitOriginY: number;
  public emitOriginWidth: number;
  public emitOriginHeight: number;

  public emitInterval: number;
  public emitCount: number;
  public particleDuration: number;

  public emitDistance: number;
  public emitDistanceVariation: number;
  public emitAngle: number;
  public emitAngleVariation: number;

  public colorPalette: Color[];

  public showDebug: boolean;

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
    const x = randRange(this.emitOriginX - this.emitOriginWidth / 2, this.emitOriginX + this.emitOriginWidth / 2) - SIZE / 2;
    const y = randRange(this.emitOriginY - this.emitOriginHeight / 2, this.emitOriginY + this.emitOriginHeight / 2) - SIZE / 2;
    const distance = randRange(this.emitDistance - this.emitDistanceVariation, this.emitDistance + this.emitDistanceVariation);
    const angle = randRange(this.emitAngle - this.emitAngleVariation, this.emitAngle + this.emitAngleVariation);
    const angleRad = angle / 180 * Math.PI;
    const dx = x + Math.cos(angleRad) * distance;
    const dy = y - Math.sin(angleRad) * distance;

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
      duration: this.particleDuration,
      curve: CURVE,
    }).then(() => {
      this.releaseParticle(p);
    });
  }

  private start() {
    this.timerId = setInterval(() => {
      for (let i = 0; i < this.emitCount; i++) {
        this.emitParticle();
      }
    }, this.emitInterval);
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

  public emitIntervalChanged() {
    if (this.isEmitting) {
      this.stop();
      this.start();
    }
  }

  updateDebugElements() {
    this.updateDE(
      this.emitBoxDebug,
      this.emitOriginX - this.emitOriginWidth / 2 - 1,
      this.emitOriginY - this.emitOriginHeight / 2 - 1,
      this.emitOriginWidth + 2,
      this.emitOriginHeight + 2
    );

    this.updateDE(
      this.emitDirectionMinDebug,
      this.emitOriginX,
      this.emitOriginY,
      this.emitDistance - this.emitDistanceVariation,
      1,
      -this.emitAngle);

    this.updateDE(
      this.emitDirectionMaxDebug,
      this.emitOriginX,
      this.emitOriginY,
      this.emitDistance + this.emitDistanceVariation,
      1,
      -this.emitAngle);

    this.updateDE(
      this.emitAngleStartDebug,
      this.emitOriginX,
      this.emitOriginY,
      this.emitDistance,
      1,
      -this.emitAngle - this.emitAngleVariation);

    this.updateDE(
      this.emitAngleEndDebug,
      this.emitOriginX,
      this.emitOriginY,
      this.emitDistance,
      1,
      -this.emitAngle + this.emitAngleVariation);
  }

  private updateDE(de: View, left: number, top: number, width: number, height: number, rotate: number = 0) {
    if (this.showDebug) {
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

export const emitOriginXProperty = new Property<ParticleEmitter, number>({
  name: "emitOriginX",
  defaultValue: 0,
  valueConverter: parseFloat,
  valueChanged: updateDebugElements
});
emitOriginXProperty.register(ParticleEmitter);

export const emitOriginYProperty = new Property<ParticleEmitter, number>({
  name: "emitOriginY",
  defaultValue: 0,
  valueConverter: parseFloat,
  valueChanged: updateDebugElements
});
emitOriginYProperty.register(ParticleEmitter);

export const emitOriginWidthProperty = new Property<ParticleEmitter, number>({
  name: "emitOriginWidth",
  defaultValue: 1,
  valueConverter: parseFloat,
  valueChanged: updateDebugElements
});
emitOriginWidthProperty.register(ParticleEmitter);

export const emitOriginHeightProperty = new Property<ParticleEmitter, number>({
  name: "emitOriginHeight",
  defaultValue: 1,
  valueConverter: parseFloat,
  valueChanged: updateDebugElements
});
emitOriginHeightProperty.register(ParticleEmitter);

export const emitCountProperty = new Property<ParticleEmitter, number>({
  name: "emitCount",
  defaultValue: 5,
  valueConverter: parseInt
});
emitCountProperty.register(ParticleEmitter);

export const emitIntervalProperty = new Property<ParticleEmitter, number>({
  name: "emitInterval",
  defaultValue: 50,
  valueConverter: parseInt,
  valueChanged: (pe) => pe.emitIntervalChanged()
});
emitIntervalProperty.register(ParticleEmitter);

export const particleDurationProperty = new Property<ParticleEmitter, number>({
  name: "particleDuration",
  defaultValue: 800,
  valueConverter: parseInt,
  valueChanged: updateDebugElements
});
particleDurationProperty.register(ParticleEmitter);

export const showDebugProperty = new Property<ParticleEmitter, boolean>({
  name: "showDebug",
  defaultValue: false,
  valueConverter: booleanConverter,
  valueChanged: updateDebugElements
});
showDebugProperty.register(ParticleEmitter);

export const emitDistanceProperty = new Property<ParticleEmitter, number>({
  name: "emitDistance",
  defaultValue: 80,
  valueConverter: parseInt,
  valueChanged: updateDebugElements
});
emitDistanceProperty.register(ParticleEmitter);

export const emitDistanceVariationProperty = new Property<ParticleEmitter, number>({
  name: "emitDistanceVariation",
  defaultValue: 40,
  valueConverter: parseInt,
  valueChanged: updateDebugElements
});
emitDistanceVariationProperty.register(ParticleEmitter);

export const emitAngleProperty = new Property<ParticleEmitter, number>({
  name: "emitAngle",
  defaultValue: 0,
  valueConverter: parseInt,
  valueChanged: updateDebugElements
});
emitAngleProperty.register(ParticleEmitter);

export const emitAngleVariationProperty = new Property<ParticleEmitter, number>({
  name: "emitAngleVariation",
  defaultValue: 180,
  valueConverter: parseInt,
  valueChanged: updateDebugElements
});
emitAngleVariationProperty.register(ParticleEmitter);

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
