import Snap from 'ol/interaction/Snap';

export class VlSnapInteraction extends Snap {
  constructor(options) {
    const snapOptions = Object.assign({}, options);
    snapOptions.pixelTolerance = options.pixelTolerance || 7;
    super(snapOptions);
    this.snapOptions = snapOptions;
  }
}
