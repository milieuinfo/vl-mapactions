import Snap from 'ol/interaction/Snap';

export class VlSnapInteraction extends Snap {
  constructor(options) {
    const source = options.layer ? options.layer.getSource() : null;
    const snapOptions = {
      source: source,
      pixelTolerance: options.pixelTolerance || 7,
    };
    super(snapOptions);
    this.snapOptions = snapOptions;
  }
}
