import {MapAction} from './vl-mapactions-mapaction';
import Select from 'ol/src/ol/interaction/Select';
import Translate from 'ol/src/ol/interaction/Translate';

export class TranslateAction extends MapAction {
  constructor(layer, onTranslate) {
    const selectInteraction = new Select({
      layers: [layer],
      style: layer.selectionStyle,
    });
    const translateOptions = {
      features: selectInteraction.getFeatures(),
      layers: [layer],
    };
    const translateInteraction = new Translate(translateOptions);

    super([selectInteraction, translateInteraction]);
    this.selectInteraction = selectInteraction;
    this.translateInteraction = translateInteraction;

    this.translateInteraction.on('translateend', (event) => {
      event.features.forEach((feature) => {
        onTranslate(feature, (feature) => {
          feature.getGeometry().setCoordinates(feature.get('entity').geometry.coordinates);
        });
        this.selectInteraction.getFeatures().clear();
      });
    });
    this.translateOptions = translateOptions;
  }

  deactivate() {
    this.selectInteraction.getFeatures().clear();
    super.deactivate();
  }
}
