import {VlDrawAction} from './vl-mapactions-draw-action';
import {LINE_STRING} from 'ol/geom/GeometryType';

export class VlDrawLineAction extends VlDrawAction {
  constructor(layer, onDraw, options) {
    options = options || {};
    options.maxPoints = 2;
    super(layer, LINE_STRING, onDraw, options);
    this.drawLineOptions = options;
  }
}
