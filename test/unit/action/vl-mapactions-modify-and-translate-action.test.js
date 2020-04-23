import sinon from 'sinon/pkg/sinon-esm';
import {expect} from 'chai';
import {ModifyAndTranslateAction} from '../../../src/action/vl-mapactions-modify-and-translate-action';
import Point from 'ol/src/ol/geom/Point';
import Feature from 'ol/src/ol/Feature';
import {SnapInteraction} from '../../../src/interaction/vl-mapactions-snap-interaction';
import {Vector as SourceVector} from 'ol/src/ol/source';
import {Vector} from 'ol/src/ol/layer';

describe('modify and translate action', function() {
  const source = new SourceVector();
  const layer = new Vector({source: source});

  it('roept de callback functie op nadat er een translate werd uitgevoerd en cleart ook de selectie interactie', function() {
    const callback = sinon.spy();
    const modifyAndTranslateAction = new ModifyAndTranslateAction({}, callback);
    const feature = new Feature({geometry: new Point([0, 0])});
    modifyAndTranslateAction.selectInteraction.getFeatures().push(feature);

    modifyAndTranslateAction.translateInteraction.dispatchEvent({
      type: 'translateend',
      features: [feature],
    });

    expect(callback.calledWith(feature)).to.be.true;
    expect(modifyAndTranslateAction.selectInteraction.getFeatures().getLength()).to.equal(0);
  });

  it('kan snapping aanzetten via opties door de modify action correct aan te roepen', function() {
    const options = {
      snapping: true,
    };

    const action = new ModifyAndTranslateAction(layer, sinon.spy(), options);
    expect(action.interactions.find(interaction => interaction instanceof SnapInteraction)).to.not.be.undefined;
  });
});
