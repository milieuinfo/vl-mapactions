import sinon from 'sinon/pkg/sinon-esm';
import {expect} from 'chai';
import Style from 'ol/src/ol/style/Style';
import {Vector as SourceVector} from 'ol/src/ol/source';
import {Vector} from 'ol/src/ol/layer';
import Feature from 'ol/src/ol/Feature';
import {DrawAction} from '../../src/vl-mapactions-draw-action';
import Draw from 'ol/src/ol/interaction/Draw';
import {SnapInteraction} from '../../src/vl-mapactions-snap-interaction';
import Polygon from 'ol/src/ol/geom/Polygon';
import Snap from 'ol/src/ol/interaction/Snap';
import LineString from 'ol/src/ol/geom/LineString';

describe('draw action', function() {
  const source = new SourceVector({features: []});
  const layer = new Vector({source: source});
  const callback = sinon.spy();

  let addOverlay;
  let removeOverlay;
  let unByKey;

  afterEach(function() {
    callback.resetHistory();
    addOverlay = undefined;
    removeOverlay = undefined;
    unByKey = undefined;
  });

  it('kan opties meegeven aan draw action', function() {
    const drawAction = new DrawAction(layer, 'LineString', callback, {maxPoints: 2});

    const options = drawAction.drawOptions;
    expect(options.maxPoints).to.equal(2);
    expect(options.source).to.equal(source);
    expect(options.type).to.equal('LineString');
    expect(drawAction.interactions.length).to.equal(1);
    expect(drawAction.interactions[0] instanceof Draw).to.be.true;
  });

  it('kan snapping aanzetten via opties met als standaard snapping layer de draw action layer', function() {
    const options = {
      maxPoints: 2,
    };

    let drawAction = new DrawAction(layer, 'LineString', callback, options);
    expect(drawAction.interactions.find(interaction => interaction instanceof SnapInteraction)).to.be.undefined;

    options.snapping = false;
    drawAction = new DrawAction(layer, 'LineString', callback, options);
    expect(drawAction.interactions.find(interaction => interaction instanceof SnapInteraction)).to.be.undefined;

    options.snapping = true;
    drawAction = new DrawAction(layer, 'LineString', callback, options);
    expect(drawAction.interactions.length).to.equal(2);
    expect(drawAction.interactions.find(interaction => interaction instanceof SnapInteraction)).to.not.be.undefined;

    const snappingSource = new SourceVector({features: []});
    const snappingLayer = new Vector({source: snappingSource});
    options.snapping = {
      layer: snappingLayer,
    };
    drawAction = new DrawAction(layer, 'LineString', callback, options);
    const snapInteraction = drawAction.interactions.find(interaction => interaction instanceof SnapInteraction);
    expect(snapInteraction.snapOptions.source).to.equal(snappingSource);
  });

  it('roept de callback functie aan na het tekenen', function() {
    const drawAction = new DrawAction(layer, 'Polygon', callback);
    const sketchFeature = new Feature();

    drawAction.drawInteraction.dispatchEvent({
      type: 'drawend',
      feature: sketchFeature,
    });

    expect(callback.calledWith(sketchFeature)).to.be.true;
  });

  it('kan na het tekenen de feature terug verwijderen via de cancel draw functie', function() {
    const callback = function(feature, cancelDraw) {
      cancelDraw();
    };
    const drawAction = new DrawAction(layer, 'Polygon', callback);
    const sketchFeature = new Feature({});

    drawAction.drawInteraction.dispatchEvent({
      type: 'drawend',
      feature: sketchFeature,
    });

    source.addFeature(sketchFeature);
    expect(source.getFeatures().length).to.equal(0);
  });

  it('kan na het tekenen asynchroon de feature terug verwijderen via de cancel draw functie', function() {
    const callback = function(feature, cancelDraw) {
      source.addFeature(feature);
      cancelDraw();
    };
    const drawAction = new DrawAction(layer, 'Polygon', callback);
    const sketchFeature = new Feature({});

    drawAction.drawInteraction.dispatchEvent({
      type: 'drawend',
      feature: sketchFeature,
    });

    expect(source.getFeatures().length).to.equal(0);
  });

  it('Als het tekenen gestart is en er met de muis verschoven wordt zal er een tooltip verschijnen als de optie measure op true staat', function() {
    const options = {
      measure: true,
    };

    let drawAction = createDrawActionWithMap('Polygon', options);
    let sketchFeature = new Feature({geometry: new Polygon([[[0, 0], [0, 1], [1, 1]]])});
    drawAction.drawInteraction.dispatchEvent({
      type: 'drawstart',
      feature: sketchFeature,
    });
    expect(addOverlay.called).to.be.true;
    let tooltip = addOverlay.getCall(0).args[0];
    expect(drawAction.tooltip).to.equal(tooltip);
    let tooltipStub = sinon.stub(drawAction.tooltip, 'setElement').callsFake();
    drawAction.pointermove();
    expect(tooltipStub.called).to.be.true;
    expect(tooltipStub.getCall(0).args[0].textContent).to.equal('1.00 m');
    expect(tooltip.getOffset()).to.deep.equal([-15, 10]);

    addOverlay.resetHistory();

    drawAction = createDrawActionWithMap('LineString', options);
    sketchFeature = new Feature({geometry: new LineString([[0, 0], [1, 1]])});
    drawAction.drawInteraction.dispatchEvent({
      type: 'drawstart',
      feature: sketchFeature,
    });
    expect(addOverlay.called).to.be.true;
    tooltip = addOverlay.getCall(0).args[0];
    expect(drawAction.tooltip).to.equal(tooltip);
    tooltipStub = sinon.stub(drawAction.tooltip, 'setElement').callsFake();
    drawAction.pointermove();
    expect(tooltipStub.called).to.be.true;
    expect(tooltipStub.getCall(0).args[0].textContent).to.equal('1.41 m');
    expect(tooltip.getOffset()).to.deep.equal([-15, 10]);
  });

  it('Als het tekenen gestart is en er met de muis verschoven wordt zal er een tooltip verschijnen als de optie measure een object is met de offset van de tooltip in', function() {
    const options = {
      measure: {
        tooltip: {
          offset: [0, 0],
        },
      },
    };

    let drawAction = createDrawActionWithMap('Polygon', options);
    let sketchFeature = new Feature({geometry: new Polygon([[[0, 0], [0, 1], [1, 1]]])});
    drawAction.drawInteraction.dispatchEvent({
      type: 'drawstart',
      feature: sketchFeature,
    });
    expect(addOverlay.called).to.be.true;
    let tooltip = addOverlay.getCall(0).args[0];
    expect(drawAction.tooltip).to.equal(tooltip);
    let tooltipStub = sinon.stub(drawAction.tooltip, 'setElement').callsFake();
    drawAction.pointermove();
    expect(tooltipStub.called).to.be.true;
    expect(tooltipStub.getCall(0).args[0].textContent).to.equal('1.00 m');
    expect(tooltip.getOffset()).to.deep.equal([0, 0]);

    addOverlay.resetHistory();

    drawAction = createDrawActionWithMap('LineString', options);
    sketchFeature = new Feature({geometry: new LineString([[0, 0], [1, 1]])});
    drawAction.drawInteraction.dispatchEvent({
      type: 'drawstart',
      feature: sketchFeature,
    });
    expect(addOverlay.called).to.be.true;
    tooltip = addOverlay.getCall(0).args[0];
    expect(drawAction.tooltip).to.equal(tooltip);
    tooltipStub = sinon.stub(drawAction.tooltip, 'setElement').callsFake();
    drawAction.pointermove();
    expect(tooltipStub.called).to.be.true;
    expect(tooltipStub.getCall(0).args[0].textContent).to.equal('1.41 m');
    expect(tooltip.getOffset()).to.deep.equal([0, 0]);
  });

  it('Als het tekenen gestart en er met de muis verschoven wordt zal er geen tooltip verschijnen als de optie measure op false staat', function() {
    const drawAction = createDrawActionWithMap('Polygon');

    const sketchFeature = new Feature({geometry: new Polygon([[[0, 0], [0, 1], [1, 1]]])});
    drawAction.drawInteraction.dispatchEvent({
      type: 'drawstart',
      feature: sketchFeature,
    });
    expect(addOverlay.called).to.be.false;
  });

  it('Bij het stoppen worden de tooltips (en listener) verwijderd', function() {
    const options = {
      measure: true,
    };

    const drawAction = createDrawActionWithMap('Polygon', options);
    const sketchFeature = new Feature({geometry: new Polygon([[[0, 0], [0, 1], [1, 1], [0, 0]]])});
    drawAction.drawInteraction.dispatchEvent({
      type: 'drawstart',
      feature: sketchFeature,
    });
    drawAction.drawInteraction.dispatchEvent({
      type: 'drawend',
      feature: sketchFeature,
    });
    expect(removeOverlay.called).to.be.true;
    // expect(unByKey.called).to.be.true;
  });

  it('Bij het deactiveren worden de tooltips en listener verwijderd', function() {
    const options = {
      measure: true,
    };
    const drawAction = createDrawActionWithMap('Polygon', options);

    const sketchFeature = new Feature({geometry: new Polygon([[[0, 0], [0, 1], [1, 1], [0, 0]]])});
    drawAction.drawInteraction.dispatchEvent({
      type: 'drawstart',
      feature: sketchFeature,
    });
    drawAction.deactivate();
    expect(removeOverlay.called).to.be.true;
    // expect(unByKey.called).to.be.true;
  });

  function setMeasureSpies() {
    addOverlay = sinon.spy();
    removeOverlay = sinon.spy();
    unByKey = sinon.spy();
  }

  function createDrawActionWithMap(type, options) {
    setMeasureSpies();
    const drawAction = new DrawAction(layer, type, callback, options);
    drawAction.map = {
      addOverlay: addOverlay,
      removeOverlay: removeOverlay,
      on: function(type, callback) {
        drawAction[type] = callback;
      },
    };
    return drawAction;
  }

});
