import { Observable } from 'tns-core-modules/data/observable';
import { ParticleEmitter } from "nativescript-particle-emitter";
import { stop as stopFps, start as startFps, addCallback } from "tns-core-modules/fps-meter";
import { Page } from 'tns-core-modules/ui/page';



export function onLoaded(args) {
    const page = <Page>args.object.page;

    page.bindingContext = new Observable();
    addCallback((fps, minFps) => {
        page.bindingContext.set("fps", "FPS: " + fps.toFixed(2));
        page.bindingContext.set("minfps", "Min FPS: " + minFps.toFixed(2));
    });
}


// Event handler for Page 'loaded' event attached in main-page.xml
export function toggleEmit(args) {
    const emitter = (<ParticleEmitter>args.object);
    if (emitter.isEmitting) {
        emitter.stop();
        stopFps();
    } else {
        emitter.start();
        setTimeout(startFps, 200);
    }

}
