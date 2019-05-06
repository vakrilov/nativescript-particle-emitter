
import { View, backgroundInternalProperty, backgroundProperty, backgroundColorProperty, Color } from 'tns-core-modules/ui/core/view';
import { layout } from 'tns-core-modules/utils/utils';
import { Particle as ParticleDef } from "./particle";

export const SIZE = 50;

export class ParticleView extends android.view.View {
    public paint: android.graphics.Paint;
    private radius: number;

    public constructor(context) {
        super(context);

        this.paint = new android.graphics.Paint();
        this.paint.setAntiAlias(true);
        this.paint.setColor(android.graphics.Color.RED);

        this.radius = SIZE * layout.getDisplayDensity() / 2;
    }

    onDraw(canvas: android.graphics.Canvas) {
        canvas.drawCircle(this.radius, this.radius, this.radius, this.paint);
    }
}

export class Particle extends View implements ParticleDef {
    nativeViewProtected: ParticleView;

    public createNativeView() {
        this.width = SIZE;
        this.height = SIZE;

        const view = new ParticleView(this._context);

        return view;
    }

    [backgroundInternalProperty.setNative](value: any) {
        // NOOP
    }

    [backgroundColorProperty.setNative](value: Color) {
        this.nativeViewProtected.paint.setColor(value.android);
        this.nativeViewProtected.invalidate();
    }

    public show() {
        // NOOP
    }

    public hide() {
        // NOOP
    }
}