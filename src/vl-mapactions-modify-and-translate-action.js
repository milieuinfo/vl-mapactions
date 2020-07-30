import {Translate} from 'ol/src/interaction';
import {ModifyAction} from './vl-mapactions-modify-action';

export class ModifyAndTranslateAction extends ModifyAction {
  constructor(layer, onModify, options) {
    super(layer, onModify, options);

    this.translateInteraction = new Translate({
      features: this.selectInteraction.getFeatures(),
    });

    this.addInteraction(this.translateInteraction);

    this.translateInteraction.on('translateend', (event) => {
      event.features.forEach((feature) => {
        onModify(feature, (feature) => {
          feature.getGeometry().setCoordinates(feature.get('entity').geometry.coordinates);
        });
        this.selectInteraction.getFeatures().clear();
      });
    });
  }
}
