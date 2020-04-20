import {DrawAction} from "./vl-mapactions-draw-action";

export class DrawLijnstukAction extends DrawAction {
    constructor(layer, onDraw, options) {
        options = options || {};
        options.maxPoints = 2;
        super(layer, 'LineString', onDraw, options);
        this.drawLijnstukOptions = options;
    }
}
