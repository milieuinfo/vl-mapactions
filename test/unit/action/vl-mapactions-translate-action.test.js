import sinon from 'sinon/pkg/sinon-esm';
import {expect} from 'chai';
import {TranslateAction} from '../../../src/action/vl-mapactions-translate-action';
import Feature from 'ol/src/ol/Feature';

describe('translate action', function() {
  it('roept de callback functie op nadat er een translate werd uitgevoerd en cleart ook de selectie interactie', function() {
    const callback = sinon.spy();
    const translateAction = new TranslateAction({}, callback);
    const feature = new Feature();
    translateAction.selectInteraction.getFeatures().push(feature);

    translateAction.translateInteraction.dispatchEvent({
      type: 'translateend',
      features: [feature],
    });

    expect(callback.calledWith(feature)).to.be.true;
    expect(translateAction.selectInteraction.getFeatures().getLength()).to.equal(0);
  });

  it('na het deactiveren wordt de selectie verwijderd', function() {
    const translateAction = new TranslateAction({});
    const feature = new Feature();
    translateAction.selectInteraction.getFeatures().push(feature);

    translateAction.deactivate();

    expect(translateAction.selectInteraction.getFeatures().getLength()).to.equal(0);
  });

  it('bij de Translate interaction constructor moet ook de laag meegegeven worden zodat na het selecteren steeds de feature op de laag verplaatst zal worden en geen features op een andere laag', function() {
    const layer = {id: 'layer1'};

    const translateAction = new TranslateAction(layer, {});

    expect(translateAction.translateOptions.layers.length).to.equal(1);
    expect(translateAction.translateOptions.layers[0]).to.deep.equal(layer);
  });
});
