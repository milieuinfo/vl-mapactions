import Snap from 'ol/src/ol/interaction/Snap';

export class SnapInteraction extends Snap {
  constructor(layer) {
    const source = layer ? layer.getSource() : null;
    const snapOptions = {
      source: source,
      pixelTolerance: 7,
    };
    super(snapOptions);
    this.snapOptions = snapOptions;
  }
}

