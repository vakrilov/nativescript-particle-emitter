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
];

let context: Observable;
export function onLoaded(args) {
    const page = <Page>args.object.page;

    context = new Observable();

    initialPreset();

    context.set("isEmitting", true);
    context.set("showDebug", true);

    addCallback((fps, minFps) => {
        context.set("fps", "FPS: " + fps.toFixed(2));
        context.set("minfps", "Min FPS: " + minFps.toFixed(2));
    });

    setTimeout(resetFps, 1000);

    (<Page>args.object.page).bindingContext = context;
}

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
        context.set("emitOriginX", args.getX());
        context.set("emitOriginY", args.getY());
    }
}

export function selectNextPalette() {
    paletteIndex = (paletteIndex + 1) % palettes.length;
    context.set("colorPalette", palettes[paletteIndex]);
}

export function initialPreset() {
    context.set("emitOriginX", 188);
    context.set("emitOriginY", 20);
    context.set("emitOriginWidth", 1);
    context.set("emitOriginHeight", 1);

    context.set("emitInterval", 50);
    context.set("emitCount", 5);
    context.set("particleDuration", 1000);

    context.set("emitDistance", 120);
    context.set("emitDistanceVariation", 60);
    context.set("emitAngle", 270);
    context.set("emitAngleVariation", 30);

    context.set("colorPalette", palettes[0]);
}

export function rainPreset() {
    context.set("emitCount", 8);
    context.set("emitInterval", 50);
    context.set("particleDuration", 1200);

    context.set("emitOriginX", 188);
    context.set("emitOriginY", 0);
    context.set("emitOriginWidth", 300);
    context.set("emitOriginHeight", 1);

    context.set("emitDistance", 130);
    context.set("emitDistanceVariation", 15);
    context.set("emitAngle", 270);
    context.set("emitAngleVariation", 0);

    context.set("colorPalette", palettes[1]);
}

export function partyPreset() {
    context.set("emitCount", 5);
    context.set("emitInterval", 50);
    context.set("particleDuration", 1500);

    context.set("emitOriginX", 188);
    context.set("emitOriginY", 240);
    context.set("emitOriginWidth", 1);
    context.set("emitOriginHeight", 1);

    context.set("emitDistance", 200);
    context.set("emitDistanceVariation", 45);
    context.set("emitAngle", 90);
    context.set("emitAngleVariation", 45);

    context.set("colorPalette", palettes[4]);
}

export function bubblesPreset() {
    context.set("emitCount", 6);
    context.set("emitInterval", 50);
    context.set("particleDuration", 600);

    context.set("emitOriginX", 188);
    context.set("emitOriginY", 120);
    context.set("emitOriginWidth", 150);
    context.set("emitOriginHeight", 150);

    context.set("emitDistance", 0);
    context.set("emitDistanceVariation", 0);
    context.set("emitAngle", 0);
    context.set("emitAngleVariation", 0);

    context.set("colorPalette", palettes[0]);
}

export function rocketPreset() {
    context.set("emitCount", 3);
    context.set("emitInterval", 20);
    context.set("particleDuration", 1000);

    context.set("emitOriginX", 188);
    context.set("emitOriginY", 188);
    context.set("emitOriginWidth", 1);
    context.set("emitOriginHeight", 1);

    context.set("emitDistance", 130);
    context.set("emitDistanceVariation", 15);
    context.set("emitAngle", 270);
    context.set("emitAngleVariation", 8);

    context.set("colorPalette", palettes[2]);
}