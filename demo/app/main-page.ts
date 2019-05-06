import { Observable } from 'tns-core-modules/data/observable';
import { stop as stopFps, start as startFps, addCallback } from "tns-core-modules/fps-meter";
import { Page } from 'tns-core-modules/ui/page';
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures/gestures';
import { Color } from 'tns-core-modules/color';

let paletteIndex = 0;
const palettes = [
    [new Color("#F21D56"), new Color("#03A688"), new Color("#A9F20C"), new Color("#B9BF04"), new Color("#F23005")],
    [new Color("#021D40"), new Color("#073673"), new Color("#117DBF"), new Color("#14A1D9"), new Color("#5CD7F2")],
    [new Color("#F2C12E"), new Color("#D97D0D"), new Color("#A63F03"), new Color("#591902"), new Color("#260401")],
    [new Color("#FF8880"), new Color("#E87495"), new Color("#FF8CE6"), new Color("#D674E8"), new Color("#C980FF")],
    [new Color("#D92B4B"), new Color("#56ACBF"), new Color("#F2CB05"), new Color("#F2B441"), new Color("#F26241")],
    [new Color("#D996D4"), new Color("#A465BF"), new Color("#1A2A40"), new Color("#D97652"), new Color("#A64949")],
    [new Color("blue")],
    [new Color("red"), new Color("green"), new Color("blue")],
]

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

    selectNextpalette();

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

export function selectNextpalette() {
    paletteIndex = (paletteIndex + 1) % palettes.length;
    page.bindingContext.set("colorPalette", palettes[paletteIndex])
}