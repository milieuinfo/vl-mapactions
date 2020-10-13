import './setup.js';
import {expect} from 'chai';
import {VlSnapInteraction} from '../../src/vl-mapactions-snap-interaction';
import {Vector as SourceVector} from 'ol/source';
import {Vector} from 'ol/layer';

describe('snapinteraction interaction', () => {
  it('bij het aanmaken van een snap interactie zullen de options correct worden gezet', () => {
    const source = new SourceVector({features: []});
    const layer = new Vector({source: source});
    const snapInteraction = new VlSnapInteraction(layer);
    expect(snapInteraction.snapOptions.source).to.equal(source);
    expect(snapInteraction.snapOptions.pixelTolerance).to.equal(7);
  });
});
