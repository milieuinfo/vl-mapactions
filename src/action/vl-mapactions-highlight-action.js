import {Select} from 'ol/src/ol/interaction';
import {pointerMove} from 'ol/src/ol/events/condition';
import {MapAction} from "./vl-mapactions-mapaction";

export class HighlightAction extends MapAction {
    constructor(layer, options) {
        const highlightInteraction = new Select({
            layers: [layer],
            condition: pointerMove,
            style: options ? options.style : null
        });

        super([highlightInteraction]);

        this.layer = layer;
        this.highlightInteraction = highlightInteraction;
    }

    deactivate() {
        this.dehighlightAllFeatures();
        super.deactivate();
    }

    highlightFeatureWithId(id) {
        if (id) {
            const feature = this.layer.getSource().getFeatureById(id) || this._getClusterByFeatureId(this.layer.getSource().getFeatures(), id);
            if (feature) {
                if (this.highlightInteraction.getFeatures().getArray().indexOf(feature) === -1) {
                    this.highlightInteraction.getFeatures().push(feature);
                }
            }
        }
    }

    _getClusterByFeatureId(clusters, id) {
        for (let i = 0; i < clusters.length; i++) {
            const features = clusters[i].get('features');
            if (features && this._getFeatureById(features, id)) {
                return clusters[i];
            }
        }
    }

    _getFeatureById(features, id) {
        for (let i = 0; i < features.length; i++) {
            if (features[i].getId() === id) {
                return features[i];
            }
        }
    }

    isHighlighted(feature) {
        let highlighted = false;
        this.highlightInteraction.getFeatures().forEach(function (highlightedFeature) {
            if (highlightedFeature === feature) {
                highlighted = true;
            }
        });
        return highlighted;
    }

    dehighlightAllFeatures() {
        this.highlightInteraction.getFeatures().clear();
    }
}