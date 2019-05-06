
import { View, backgroundInternalProperty, backgroundColorProperty, Color } from 'tns-core-modules/ui/core/view';
import { Particle as ParticleDef } from "./particle";

export const SIZE = 50;

export class Particle extends View implements ParticleDef {
    nativeViewProtected: UIView;

    public createNativeView() {
        this.width = SIZE;
        this.height = SIZE;

        const view = UIView.new();
        view.layer.cornerRadius = SIZE / 2;
        return view;
    }

    [backgroundInternalProperty.setNative](value: any) {
        // NOOP
    }

    [backgroundColorProperty.setNative](value: Color) {
        this.nativeViewProtected.backgroundColor = value.ios;
    }

    public show() {
        if (this.nativeViewProtected) {
            this.nativeViewProtected.hidden = false;
        }
    }

    public hide() {
        if (this.nativeViewProtected) {
            this.nativeViewProtected.hidden = true;
        }
    }
}