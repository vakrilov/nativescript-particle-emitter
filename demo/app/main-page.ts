import { Observable } from 'tns-core-modules/data/observable';
import { ParticleEmitter } from "nativescript-particle-emitter";
import { stop as stopFps, start as startFps, addCallback } from "tns-core-modules/fps-meter";
import { Page } from 'tns-core-modules/ui/page';
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures/gestures';


let page: Page;
export function onLoaded(args) {
    page = <Page>args.object.page;

    page.bindingContext = new Observable();

    page.bindingContext.set("x", 100);
    page.bindingContext.set("y", 200);
    page.bindingContext.set("isEmitting", false);
    page.bindingContext.set("showDebugElement", true);
    page.bindingContext.set("areaWidth", 1);
    page.bindingContext.set("areaHeight", 1);
    page.bindingContext.set("emitBatch", 1);
    page.bindingContext.set("duration", 1000);
    page.bindingContext.set("interval", 50);

    page.bindingContext.set("velocity", 80);
    page.bindingContext.set("velocityVariation", 40);
    page.bindingContext.set("emitDirection", 0);
    page.bindingContext.set("emitDirectionVariation", 180);


    addCallback((fps, minFps) => {
        page.bindingContext.set("fps", "FPS: " + fps.toFixed(2));
        page.bindingContext.set("minfps", "Min FPS: " + minFps.toFixed(2));
    });
    startFps();
}


// Event handler for Page 'loaded' event attached in main-page.xml
export function resetFps() {
    stopFps();
    startFps();
}

let tracking = false;
export function onTouch(args: TouchGestureEventData) {
    if (args.action === 'down') {
        tracking = true;
    } else if (args.action === "up" || args.action === "cancel") {
        tracking = false;
    }

    if (tracking) {
        page.bindingContext.set("x", args.getX());
        page.bindingContext.set("y", args.getY());
    }
}