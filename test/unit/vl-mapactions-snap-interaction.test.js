import {expect} from 'chai';
import {SnapInteraction} from '../../../src/vl-mapactions-snap-interaction';
import {Vector as SourceVector} from 'ol/src/ol/source';
import {Vector} from 'ol/src/ol/layer';

describe('snapinteraction interaction', function() {

  it('bij het aanmaken van een snap interactie zullen de options correct worden gezet', function() {
    const source = new SourceVector({features: []});
    const layer = new Vector({source: source});
    const snapInteraction = new SnapInteraction(layer);
    expect(snapInteraction.snapOptions.source).to.equal(source);
    expect(snapInteraction.snapOptions.pixelTolerance).to.equal(7);
  });
});
