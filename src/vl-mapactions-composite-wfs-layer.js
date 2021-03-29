import OlVectorLayer from 'ol/layer/Vector';
import {CompositeVectorSource} from './vl-mapactions-composite-wfs-source';


export class CompositeWfsLayer extends OlVectorLayer {
  constructor(wfsLayers, options) {
    super({
      title: options.title,
      source: new CompositeVectorSource(wfsLayers.map(layer => layer.getSource())),
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      minResolution: wfsLayers.map(layer => layer.getMinResolution()).reduce((x, y) => Math.min(x, y)),
      maxResolution: wfsLayers.map(layer => layer.getMaxResolution()).reduce((x, y) => Math.max(x, y)),
    });
  }  
}
