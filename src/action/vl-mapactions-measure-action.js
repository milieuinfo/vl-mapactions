import Overlay from 'ol/src/ol/Overlay';
import {unByKey} from 'ol/src/ol/Observable';
import {DrawAction} from "./vl-mapactions-draw-action";

export class MeasureAction extends DrawAction {
    constructor(layer, options) {
        super(layer, 'LineString', () => {
            unByKey(this.measurePointermoveHandler);
        }, options);

        let featureCounter = 0;

        this.layer = layer;
        this.measureTooltips = [];
        this.measurePointermoveHandler = undefined;

        function showMeasureTooltip(feature, tooltip, tooltipElement) {
            const length = feature.getGeometry().getLength().toFixed(2);
            tooltipElement.textContent = length + " m";
            tooltip.setElement(tooltipElement);
            tooltip.setPosition(feature.getGeometry().getLastCoordinate());
        }

        this.drawInteraction.on('drawstart', (event) => {
            const id = featureCounter++;
            const measureFeature = event.feature;
            measureFeature.setId(id);
            const tooltipElement = document.createElement('div');
            tooltipElement.setAttribute('class', 'measure-tooltip');
            const tooltip = new Overlay({
                offset: [-15, 10],
                positioning: 'bottom-center'
            });
            this.map.addOverlay(tooltip);
            this.measureTooltips[id] = tooltip;
            this.measurePointermoveHandler = this.map.on('pointermove', function () {
                showMeasureTooltip(measureFeature, tooltip, tooltipElement);
            });
        });

        const removeTooltip = (id) => {
            this.map.removeOverlay(this.measureTooltips[id]);
            this.measureTooltips[id] = null;
        };

        this.layer.getSource().on("removefeature", (event) => {
            removeTooltip(event.feature.getId());
        });

        this.cleanUp = () => {
            unByKey(this.measurePointermoveHandler);
            const tooltipsToRemove = [];
            this.measureTooltips.forEach((value, index) => {
                if (this.layer.getSource().getFeatureById(index) == null) {
                    tooltipsToRemove.push(index);
                }
            });
            tooltipsToRemove.forEach((id) => {
                removeTooltip(id);
            });
        };

        this.getTooltipFor = (id) => {
            return this.measureTooltips[id];
        };

    }

    deactivate() {
        this.cleanUp();
        acd.ol.action.MapAction.prototype.deactivate.call(this);
    }

}
