import {Polygon} from 'ol/geom';
import {VlDrawAction} from './vl-mapactions-draw-action';
import GeometryType from 'ol/geom/GeometryType';

export class VlDrawPolygonAction extends VlDrawAction {
  constructor(layer, onDraw, options) {
    const drawPolygonOptions = options || {};
    drawPolygonOptions.maxPoints = 2;
    drawPolygonOptions.geometryFunction = (coordinates, geometry) => {
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

    super(layer, GeometryType.LINE_STRING, onDraw, drawPolygonOptions);

    this.drawPolygonOptions = drawPolygonOptions;
  }
}
