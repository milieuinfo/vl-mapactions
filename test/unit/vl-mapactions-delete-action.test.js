import sinon from 'sinon/pkg/sinon-esm';
import {expect} from 'chai';
import Style from 'ol/src/ol/style/Style';
import {DeleteAction} from '../../../src/vl-mapactions-delete-action';
import {Vector as SourceVector} from 'ol/src/ol/source';
import {Vector} from 'ol/src/ol/layer';
import Feature from 'ol/src/ol/Feature';

describe('delete action', function() {
  it('indien er geen delete stijl gedefinieerd is zal de standaard stijl gebruikt worden', function() {
    const deleteAction = new DeleteAction({});
    expect(deleteAction.style).to.not.be.undefined;
  });

  it('de delete stijl kan bepaald worden', function() {
    const style = new Style();
    const deleteAction = new DeleteAction({}, null, {
      style: style,
    });
    expect(deleteAction.style).to.equal(style);
  });

  it('bij het oproepen van de callback zal na een success de selectie weggehaald worden', function() {
    const teVerwijderenFeature = new Feature();
    teVerwijderenFeature.setId(1);
    const layer = new Vector({source: new SourceVector({features: [teVerwijderenFeature]})});
    const callback = function(features, success, cancel) {
      success(teVerwijderenFeature);
    };
    const deleteAction = new DeleteAction(layer, callback);

    deleteAction.selectInteraction.getFeatures().push(teVerwijderenFeature);
    deleteAction.selectInteraction.dispatchEvent('select');

    expect(deleteAction.selectInteraction.getFeatures().getLength()).to.equal(0);
  });

  it('bij het oproepen van de callback zal na een cancel de selectie weggehaald worden', function() {
    const teVerwijderenFeature = new Feature();
    teVerwijderenFeature.setId(1);
    const layer = new Vector({source: new SourceVector({features: [teVerwijderenFeature]})});
    const callback = function(features, success, cancel) {
      cancel();
    };
    const deleteAction = new DeleteAction(layer, callback);

    deleteAction.selectInteraction.getFeatures().push(teVerwijderenFeature);
    deleteAction.selectInteraction.dispatchEvent('select');

    expect(deleteAction.selectInteraction.getFeatures().getLength()).to.equal(0);
  });

  it('bij het oproepen van de callback zal na de success de geselecteerde feature(s) weggehaald worden', function() {
    const teVerwijderenFeature = new Feature();
    teVerwijderenFeature.setId(1);
    const layer = new Vector({source: new SourceVector({features: [teVerwijderenFeature]})});
    const callback = function(features, success, cancel) {
      success(teVerwijderenFeature);
    };
    const deleteAction = new DeleteAction(layer, callback);

    deleteAction.selectInteraction.getFeatures().push(teVerwijderenFeature);
    deleteAction.selectInteraction.dispatchEvent('select');

    expect(layer.getSource().getFeatures().length).to.equal(0);
  });

  it('bij het oproepen van de callback zal na een cancel de geselecteerde feature(s) niet weggehaald worden', function() {
    const teVerwijderenFeature = new Feature();
    teVerwijderenFeature.setId(1);
    const layer = new Vector({source: new SourceVector({features: [teVerwijderenFeature]})});
    const callback = function(features, success, cancel) {
      cancel();
    };
    const deleteAction = new DeleteAction(layer, callback);

    deleteAction.selectInteraction.getFeatures().push(teVerwijderenFeature);
    deleteAction.selectInteraction.dispatchEvent('select');

    expect(layer.getSource().getFeatures().length).to.equal(1);
  });

  it('als er geen callback is meegegeven kunnen worden de features onmiddellijk verwijderd', function() {
    const teVerwijderenFeature = new Feature();
    teVerwijderenFeature.setId(1);
    const layer = new Vector({source: new SourceVector({features: [teVerwijderenFeature]})});
    const deleteAction = new DeleteAction(layer);

    deleteAction.selectInteraction.getFeatures().push(teVerwijderenFeature);
    deleteAction.selectInteraction.dispatchEvent('select');

    expect(layer.getSource().getFeatures().length).to.equal(0);
    expect(deleteAction.selectInteraction.getFeatures().getLength()).to.equal(0);
  });
});
