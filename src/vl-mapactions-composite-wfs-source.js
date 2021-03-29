import OlVectorSource from 'ol/source/Vector';
import * as OlLoadingstrategy from 'ol/loadingstrategy';

export class VlCompositeVectorSource extends OlVectorSource {
  constructor(wfsSources) {
    super({
      strategy: OlLoadingstrategy.bbox,
      loader: (extent, resolution, projection) => {
        const featurePromises = wfsSources.map((source) => {
          const url = source.getUrl()(extent, resolution, projection);
          return fetch(url).then((response) => response.text());
        });
        Promise.all(featurePromises).then((featureResults) => {
          featureResults.forEach((featureResult, index) => {
            const features = wfsSources[index].getFormat().readFeatures(featureResult);
            this.addFeatures(features);
          });
        });
      },
    });
  }
}
