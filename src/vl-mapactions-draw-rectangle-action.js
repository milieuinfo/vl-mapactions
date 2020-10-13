import {Polygon} from 'ol/geom';
import {VlDrawAction} from './vl-mapactions-draw-action';

export class VlDrawRectangleAction extends VlDrawAction {
  constructor(layer, onDraw, options) {
    const drawRectangleOptions = options || {};
    drawRectangleOptions.maxPoints = 2;
    drawRectangleOptions.geometryFunction = (coordinates, geometry) => {
      if (!geometry) {
        geometry = new Polygon([]);
      }
      const start = coordinates[0];
      const end = coordinates[1];
      geometry.setCoordinates([
        [start, [start[0], end[1]], end, [end[0], start[1]], start],
      ]);
      return geometry;
    };

    super(layer, 'LineString', onDraw, drawRectangleOptions);

    this.drawRectangleOptions = drawRectangleOptions;
  }
}
