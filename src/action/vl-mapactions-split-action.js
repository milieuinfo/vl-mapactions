import {MultiPolygon} from 'ol/src/ol/geom';
import Feature from 'ol/src/ol/Feature';
import {SelectAction} from "./vl-mapactions-select-action";
import {MapAction} from "./vl-mapactions-mapaction";
import {DrawAction} from "./vl-mapactions-draw-action";
import * as jsts from 'jsts'

export class SplitAction extends MapAction {
    constructor(layer, onSplit, options) {
        const reader = new jsts.io.OL3Parser();
        const interactions = [];

        const selectAction = new SelectAction(layer, (feature) => {
            if (feature) {
                this.selectAction.deactivate();
                super.activate(this.drawAction);
            }
        }, options);

        const drawAction = new DrawAction(layer, 'LineString', (drawnFeature) => {
            const selectedFeature = this.selectAction.selectedFeature;
            const selectedGeometry = reader.read(selectedFeature.getGeometry().getPolygons()[0]);
            const drawnGeometry = reader.read(drawnFeature.getGeometry());
            const union = selectedGeometry.getExteriorRing().union(drawnGeometry);
            const polygonizer = new jsts.operation.polygonize.Polygonizer();
            polygonizer.add(union);

            const result = [];
            const polygons = polygonizer.getPolygons();
            for (let i = polygons.iterator(); i.hasNext();) {
                const multiPolygon = new MultiPolygon([]);
                multiPolygon.appendPolygon(reader.write(i.next()));
                result.push(new Feature({
                    geometry: multiPolygon
                }));
            }

            if (onSplit) {
                onSplit(selectedFeature, result);
            }

            this.selectAction.clearFeatures();

            setTimeout(() => {
                this.drawAction.deactivate();
                this.selectAction.activate();
            });
        }, options);

        super(interactions);

        this.interactions = interactions;
        this.selectAction = selectAction;
        this.drawAction = drawAction;
    }

    activate() {
        this.map.addAction(this.selectAction);
        this.map.addAction(this.drawAction);
        this.selectAction.activate();
    }

    deactivate = function () {
        this.selectAction.deactivate();
        this.drawAction.deactivate();
    }
}