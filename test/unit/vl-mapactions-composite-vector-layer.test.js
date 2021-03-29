import './setup.js';
import {VlCompositeVectorLayer} from '../../src/vl-mapactions-composite-vector-layer';
import {VlCompositeVectorSource} from '../../src/vl-mapactions-composite-vector-source';
import {Vector} from 'ol/layer';
import OlVectorSource from 'ol/source/Vector';
import OlGML2 from 'ol/format/GML2';
import {expect} from 'chai';

describe('composite wfs layer', () => {
  it('maakt een combinatie van alle layers', () => {
    const source1 = new OlVectorSource({
      format: new OlGML2(),
      url: (extent, resolution, projection) => {
        return 'http://localhost/kaartlaag1';
      },
    });
    const source2 = new OlVectorSource({
      format: new OlGML2(),
      url: (extent, resolution, projection) => {
        return 'http://localhost/kaartlaag2';
      },
    });

    const layer1 = new Vector({
      title: 'Laag 1',
      source: source1,
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      minResolution: 4,
      maxResolution: 8,
    });
    const layer2 = new Vector({
      title: 'Laag 1',
      source: source2,
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      minResolution: 2,
      maxResolution: 10,
    });
    const compositeVectorLayer = new VlCompositeVectorLayer([layer1, layer2], {title: 'Composite laag'});
    expect(compositeVectorLayer.getMinResolution()).to.equal(2);
    expect(compositeVectorLayer.getMaxResolution()).to.equal(10);
    expect(compositeVectorLayer.getSource() instanceof VlCompositeVectorSource).to.equal(true);
    expect(compositeVectorLayer.getSource().sources[0]).to.equal(source1);
    expect(compositeVectorLayer.getSource().sources[1]).to.equal(source2);
  });
});

