import { AbsoluteLayout } from 'tns-core-modules/ui/layouts/absolute-layout';
import * as app from 'tns-core-modules/application';
import { isAndroid } from 'tns-core-modules/platform';
import { View } from 'tns-core-modules/ui/core/view';
import { AnimationDefinition } from 'tns-core-modules/ui/animation';
import { Label } from 'tns-core-modules/ui/label';
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures/gestures';

const D = 10;
const INTERVAL = 50;
const DURATION = 500;
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

  private particlePool: Particle[] = [];
  private timerId;

  constructor() {
    super();
    this.clipToBounds = false;
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
    particle.width = D;
    particle.height = D;
    particle.borderRadius = D / 2;
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
    log("releaseParticle");

    p.visibility = "hidden";
    this.particlePool.push(p);
  }

  public emitParticle() {
    const p = this.getParticle();
    const x = 150 - D / 2;
    const y = 150 - D / 2;

    this.prepareParticle(p, x, y);

    const dx = x + Math.random() * 150 - 75;
    const dy = y + Math.random() * 150 - 75;


    p.animate({
      translate: { x: dx, y: dy },
      scale: { x: 5, y: 5 },
      opacity: 0,
      duration: DURATION,
      curve: CURVE,
    }).then(() => {
      this.releaseParticle(p);
    });
  }

  public start() {
    if (!this.isEmitting) {
      this.isEmitting = true;

      this.timerId = setInterval(() => {
        this.emitParticle();
        this.emitParticle();
      }, INTERVAL);
      log("Emitter -> started");

    }
  }

  public stop() {
    if (this.isEmitting) {
      clearInterval(this.timerId);
      this.isEmitting = false;
      this.timerId = undefined;
      log("Emitter -> stopped");
    }
  }
}
