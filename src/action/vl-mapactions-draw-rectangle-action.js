import {Polygon} from 'ol/src/ol/geom';
import {DrawAction} from "./vl-mapactions-draw-action";

export class DrawRectangleAction extends DrawAction {
    constructor(layer, onDraw, options) {
        options = options || {};
        options.maxPoints = 2;
        options.geometryFunction = function (coordinates, geometry) {
            if (!geometry) {
                geometry = new Polygon([]);
            }
            const start = coordinates[0];
            const end = coordinates[1];
            geometry.setCoordinates([
                [start, [start[0], end[1]], end, [end[0], start[1]], start]
            ]);
            return geometry;
        };

        super(layer, 'LineString', onDraw, options);

        this.drawRectangleOptions = options;
    }
}
