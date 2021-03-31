import Snap from 'ol/interaction/Snap';

export class VlSnapInteraction extends Snap {
  constructor(source, options) {
    const snapOptions = Object.assign({}, options);
    snapOptions.source = source;
    if (options && options.pixelTolerance) {
      snapOptions.pixelTolerance = options.pixelTolerance;
    } else {
      snapOptions.pixelTolerance = 7;
    }
    super(snapOptions);
  }
}
