import {Polygon} from 'ol/src/ol/geom';
import {DrawAction} from './vl-mapactions-draw-action';

export class DrawRectangleAction extends DrawAction {
  constructor(layer, onDraw, options) {
    const drawRectangleOptions = options || {};
    drawRectangleOptions.maxPoints = 2;
    drawRectangleOptions.geometryFunction = function(coordinates, geometry) {
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
