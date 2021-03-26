import './setup.js';
import {expect} from 'chai';
import {VlSnapInteraction} from '../../src/vl-mapactions-snap-interaction';
import {Vector as SourceVector} from 'ol/source';

describe('snapinteraction interaction', () => {
  it('bij het aanmaken van een snap interactie zullen de options correct worden gezet', () => {
    const source = new SourceVector({features: []});
    const snapInteraction = new VlSnapInteraction({source: source});
    expect(snapInteraction.snapOptions.source).to.equal(source);
    expect(snapInteraction.snapOptions.pixelTolerance).to.equal(7);
  });

  it('pixel tolerance kan ook meegegeven worden', () => {
    const source = new SourceVector({features: []});
    const snapInteraction = new VlSnapInteraction({source: source, pixelTolerance: 1000});
    expect(snapInteraction.snapOptions.source).to.equal(source);
    expect(snapInteraction.snapOptions.pixelTolerance).to.equal(1000);
  });
});
