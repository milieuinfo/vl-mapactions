import Select from "ol/interaction/Select";
import Translate from "ol/interaction/Translate";
import {MapAction} from "./vl-mapactions-mapaction";

export class TranslateAction extends MapAction {
    constructor(layer, onTranslate) {
        const selectInteraction = new Select({
            layers: [layer],
            style: layer.selectionStyle
        });
        const translateInteraction = new Translate({
            features: selectInteraction.getFeatures(),
            layers: [layer]
        });

        super([selectInteraction, translateInteraction]);
        this.selectInteraction = selectInteraction;
        this.translateInteraction = translateInteraction;

        this.translateInteraction.on('translateend', (event) => {
            event.features.forEach((feature) => {
                onTranslate(feature, (feature) => {
                    feature.getGeometry().setCoordinates(feature.get("entity").geometry.coordinates);
                });
                this.selectInteraction.getFeatures().clear();
            });
        });
    }

    deactivate() {
        this.selectInteraction.getFeatures().clear();
        super.deactivate();
    }
}