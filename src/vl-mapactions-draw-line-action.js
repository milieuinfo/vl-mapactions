import {VlDrawAction} from './vl-mapactions-draw-action';

export class VlDrawLineAction extends VlDrawAction {
  constructor(layer, onDraw, options) {
    options = options || {};
    options.maxPoints = 2;
    super(layer, 'LineString', onDraw, options);
    this.drawLineOptions = options;
  }
}
