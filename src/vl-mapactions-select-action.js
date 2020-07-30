import {Select} from 'ol/src/interaction';
import {pointerMove} from 'ol/src/events/condition';
import {MapAction} from './vl-mapactions-mapaction';

export class SelectAction extends MapAction {
  constructor(layer, onSelect, options) {
    const cluster = options && options.cluster;
    const filter = options && options.filter ? options.filter : () => true;
    const style = options ? options.style : null;
    const hoverStyle = options ? options.hoverStyle || style : style;

    const selectInteractionFilter = (feature, layer) => {
      this.selectInteraction.getFeatures().clear();
      return this.filter(feature, layer);
    };

    const hoverInteractionFilter = (feature, layer) => {
      const isSelected = this.selectInteraction.getFeatures().getArray().indexOf(feature) !== -1;
      return this.filter(feature, layer) && !isSelected;
    };

    const hoverInteraction = new Select({
      filter: hoverInteractionFilter,
      condition: pointerMove,
      style: hoverStyle,
    });

    const markInteraction = new Select({
      style: style,
    });

    const selectInteraction = new Select({
      filter: selectInteractionFilter,
    });

    super([markInteraction, selectInteraction, hoverInteraction]);

    this.cluster = cluster;
    this.filter = filter;
    this.layer = layer;
    this.style = style;
    this.hoverStyle = hoverStyle;
    this.hoverInteraction = hoverInteraction;
    this.markInteraction = markInteraction;
    this.selectInteraction = selectInteraction;

    this.hoverInteraction.on('select', () => {
      const element = this.map.getTargetElement();
      if (this.hoverInteraction.getFeatures().getLength() > 0) {
        element.style.cursor = 'pointer';
      } else {
        element.style.cursor = '';
      }
    });

    this.selectedFeature = null;

    this.getLayer = () => layer;

    const nextFeature = (features) => {
      const index = features.getArray().indexOf(this.selectedFeature);
      let next = index + 1;
      if (next > features.getLength() - 1) {
        next = 0;
      }
      return features.getArray()[next];
    };

    this.selectInteraction.on('select', (event) => {
      this.markInteraction.getFeatures().clear();
      if (this.selectInteraction.getFeatures().getLength() > 0) {
        const selectedFeature = null;
        if (this.selectInteraction.getFeatures().getLength() === 1) {
          this.selectedFeature = this.selectInteraction.getFeatures().getArray()[0];
        } else {
          this.selectedFeature = nextFeature(this.selectInteraction.getFeatures());
        }
        if (onSelect) {
          onSelect(this.selectedFeature, event, this.getLayer(selectedFeature));
        }
      } else {
        this.selectedFeature = null;
        if (onSelect) {
          onSelect();
        }
      }
    });
    this.selectInteractionFilter = selectInteractionFilter;
    this.hoverInteractionFilter = hoverInteractionFilter;
  }

  _fixClusterBehavior() {
    if (this.selectedFeature) {
      const features = this.selectedFeature.get('features') || [this.selectedFeature];
      this.selectInteraction.getFeatures().clear();
      this.markInteraction.getFeatures().clear();
      if (features) {
        features.forEach((feature) => {
          if (feature.getId()) {
            this.markFeatureWithId(feature.getId());
          }
        });
      }
    }
  }

  getClusterWithFeatureId(clusters, id) {
    for (let i = 0; i < clusters.length; i++) {
      const features = clusters[i].get('features');
      if (features && this.getFeatureById(features, id)) {
        return clusters[i];
      }
    }
  };

  getFeatureById(features, id) {
    for (let i = 0; i < features.length; i++) {
      if (features[i].getId() === id) {
        return features[i];
      }
    }
  }

  clearFeatures() {
    this.selectInteraction.getFeatures().clear();
    this.markInteraction.getFeatures().clear();
    this.hoverInteraction.getFeatures().clear();
  }

  activate() {
    if (this.cluster && this.map) {
      this._fixClusterBehaviorListener = () => this._fixClusterBehavior();
      this.map.on('moveend', this._fixClusterBehaviorListener);
      this.selectInteraction.on('select', this._fixClusterBehaviorListener);
    }
    super.activate();
  }

  deactivate() {
    if (this._fixClusterBehaviorListener) {
      this.map.un('moveend', this._fixClusterBehaviorListener);
      this.selectInteraction.un('select', this._fixClusterBehaviorListener);
    }
    this.clearFeatures();
    super.deactivate();
  }

  selectFeature(feature) {
    this.selectInteraction.getFeatures().push(feature);
    this.selectInteraction.dispatchEvent({
      type: 'select',
      feature: feature,
    });
  }

  getSelectedFeatures() {
    return this.selectInteraction.getFeatures();
  }

  vergeetLaatstGeselecteerdeFeature() {
    this.selectedFeature = null;
  }

  markFeatureWithId(id, layer) {
    layer = layer || this.layer;
    const feature = layer.getSource().getFeatureById(id) || this.getClusterWithFeatureId(layer.getSource().getFeatures(), id);
    if (feature) {
      if (this.markInteraction.getFeatures().getArray().indexOf(feature) === -1) {
        this.markInteraction.getFeatures().push(feature);
      }
    }
  }

  isMarked(feature) {
    let marked = false;
    this.markInteraction.getFeatures().forEach((selectedFeature) => {
      if (selectedFeature === feature) {
        marked = true;
      }
    });
    return marked;
  }

  demarkAllFeatures() {
    this.markInteraction.getFeatures().clear();
  }
}
