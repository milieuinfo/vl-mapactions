import sinon from 'sinon/pkg/sinon-esm';
import {expect} from 'chai';
import {Vector as SourceVector} from 'ol/src/ol/source';
import {Vector} from 'ol/src/ol/layer';
import {MeasureAction} from '../../../src/action/vl-mapactions-measure-action';
import Feature from 'ol/src/ol/Feature';
import LineString from 'ol/src/ol/geom/LineString';
import * as OlObservable from 'ol/src/ol/Observable';

'use strict';

describe('measure action', function() {
  let measureAction, layer, addOverlay, removeOverlay, unByKey, handler,
    moveMouse, source, callback;

  beforeEach(function setUp() {
    source = new SourceVector({features: []});
    layer = new Vector({source: source});

    measureAction = new MeasureAction(layer);
    callback = sinon.spy();
    addOverlay = sinon.spy();
    removeOverlay = sinon.spy();
    unByKey = sinon.spy();
    handler = 'handler';
    measureAction.map = {
      addOverlay: addOverlay,
      removeOverlay: removeOverlay,
      on: function(type, callback) {
        moveMouse = callback;
        return handler;
      },
    };
  });

  it('geeft de snapping configuratie door aan de draw action', function() {
    const snappingLayer = sinon.spy();
    const snapping = {
      layer: snappingLayer,
    };

    const action = new MeasureAction(layer, snapping);
    expect(action.measureOptions.layer).to.deep.equal(snappingLayer);
  });

  it('Als het tekenen gestart en er met de muis verschoven wordt zal er een tooltip verschijnen', function() {
    const sketchFeature = new Feature({geometry: new LineString([[0, 0], [1, 1]])});

    measureAction.drawInteraction.dispatchEvent({
      type: 'drawstart',
      feature: sketchFeature,
    });

    expect(addOverlay.called).to.be.true;
  });

  it('bij het deactiveren worden de tooltips niet verwijderd, maar de listener wordt wel weggegooid', function() {
    const unByKey = sinon.spy(OlObservable, 'unByKey');
    const sketchFeature = new Feature({geometry: new LineString([[0, 0], [1, 1]])});
    measureAction.drawInteraction.dispatchEvent({
      type: 'drawstart',
      feature: sketchFeature,
    });
    measureAction.drawInteraction.dispatchEvent({
      type: 'drawend',
      feature: sketchFeature,
    });
    source.addFeature(sketchFeature);

    measureAction.deactivate();

    expect(unByKey.calledWith(measureAction.measurePointermoveHandler)).to.be.true;
    expect(removeOverlay.called).to.be.false;
  });

  it('bij het deactiveren worden de tooltips van features die nog niet volledig getekend waren wel van de kaart verwijderd', function() {
    const sketchFeature = new Feature({geometry: new LineString([[0, 0], [1, 1]])});
    measureAction.drawInteraction.dispatchEvent({
      type: 'drawstart',
      feature: sketchFeature,
    });
    measureAction.drawInteraction.dispatchEvent({
      type: 'drawend',
      feature: sketchFeature,
    });
    const tooltip = measureAction.getTooltipFor(sketchFeature.getId());

    measureAction.deactivate();

    expect(removeOverlay.calledWith(tooltip)).to.be.true;
  });

  it('wanneer een feature wordt verwijderd van de layer zal de bijhorende tooltip ook verwijderd worden', function() {
    const sketchFeature = new Feature({
      id: 1,
      geometry: new LineString([[0, 0], [1, 1]]),
    });

    measureAction.drawInteraction.dispatchEvent({
      type: 'drawstart',
      feature: sketchFeature,
    });

    measureAction.drawInteraction.dispatchEvent({
      type: 'drawend',
      feature: sketchFeature,
    });
    expect(addOverlay.called).to.be.true;

    const tooltip = measureAction.getTooltipFor(sketchFeature.getId());
    expect(tooltip).to.not.be.undefined;

    source.dispatchEvent({type: 'removefeature', feature: sketchFeature});
    expect(removeOverlay.calledWith(tooltip)).to.be.true;
  });
});
