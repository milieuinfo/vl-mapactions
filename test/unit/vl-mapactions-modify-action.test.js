import sinon from 'sinon/pkg/sinon-esm';
import {expect} from 'chai';
import {Vector as SourceVector} from 'ol/src/ol/source';
import {Vector} from 'ol/src/ol/layer';
import {ModifyAction} from '../../../src/vl-mapactions-modify-action';
import Feature from 'ol/src/ol/Feature';
import Point from 'ol/src/ol/geom/Point';
import {SnapInteraction} from '../../../src/vl-mapactions-snap-interaction';
import Select from 'ol/src/ol/interaction/Select';
import Modify from 'ol/src/ol/interaction/Modify';

describe('modify action', function() {
  const source = new SourceVector();
  const layer = new Vector({source: source});
  const callback = sinon.spy();
  const filter = (feature) => {
  };

  it('roept de callback functie op nadat er een modify werd uitgevoerd', function() {
    const modifyAction = new ModifyAction({}, callback);
    const feature = new Feature({
      geometry: new Point([0, 0]),
    });

    modifyAction.selectInteraction.getFeatures().push(feature);
    modifyAction.modifyInteraction.dispatchEvent({
      type: 'modifyend',
      features: [feature],
    });
    expect(callback.calledWith(feature)).to.be.true;
  });

  it('na het deactiveren wordt de selectie verwijderd', function() {
    const modifyAction = new ModifyAction({});
    modifyAction.map = {
      on: sinon.spy(),
      un: sinon.spy(),
    };
    const feature = new Feature({
      geometry: new Point([0, 0]),
    });

    modifyAction.selectInteraction.getFeatures().push(feature);
    modifyAction.deactivate();
    expect(modifyAction.selectInteraction.getFeatures().getLength()).to.equal(0);
  });

  it('de feature filter zal doorgegeven worden aan de select action', function() {
    const layers = {};
    const options = {
      filter: filter,
    };
    const modifyAction = new ModifyAction(layers, null, options);

    expect(modifyAction.filter).to.equal(filter);
  });

  it('bevat standaard 4 interacties: select, modify, hover en mark interaction', function() {
    const modifyAction = new ModifyAction(layer, callback, {});

    expect(modifyAction.interactions.length).to.equal(4);
    expect(modifyAction.interactions.filter(interaction => interaction instanceof Modify).length).to.equal(1);
    expect(modifyAction.interactions.filter(interaction => interaction instanceof Select).length).to.equal(3);
  });

  it('kan snapping aanzetten via opties met als standaard snapping layer de modify action layer', function() {
    const options = {
      filter: filter,
    };
    let modifyAction = new ModifyAction(layer, callback, options);
    expect(modifyAction.interactions.length).to.equal(4);
    expect(modifyAction.interactions.find(interaction => interaction instanceof SnapInteraction)).to.be.undefined;

    options.snapping = false;
    modifyAction = new ModifyAction(layer, callback, options);
    expect(modifyAction.interactions.length).to.equal(4);
    expect(modifyAction.interactions.find(interaction => interaction instanceof SnapInteraction)).to.be.undefined;

    options.snapping = true;
    modifyAction = new ModifyAction(layer, callback, options);
    expect(modifyAction.interactions.length).to.equal(5);
    expect(modifyAction.interactions.find(interaction => interaction instanceof SnapInteraction)).to.not.be.undefined;

    const snappingSource = new SourceVector({features: []});
    const snappingLayer = new Vector({source: snappingSource});
    options.snapping = {
      layer: snappingLayer,
    };
    modifyAction = new ModifyAction(layer, callback, options);
    expect(modifyAction.interactions.length).to.equal(5);
    const snapInteraction = modifyAction.interactions.find(interaction => interaction instanceof SnapInteraction);
    expect(snapInteraction.snapOptions.source).to.equal(snappingSource);
  });
});
