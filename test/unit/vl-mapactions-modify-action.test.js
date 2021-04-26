import './setup.js';
import sinon from 'sinon/pkg/sinon-esm';
import {expect} from 'chai';
import Map from 'ol/Map';
import {Vector as SourceVector} from 'ol/source';
import {Vector} from 'ol/layer';
import {VlModifyAction} from '../../src/vl-mapactions-modify-action';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {VlSnapInteraction} from '../../src/vl-mapactions-snap-interaction';
import Select from 'ol/interaction/Select';
import Modify from 'ol/interaction/Modify';

describe('modify action', () => {
  const source = new SourceVector();
  const layer = new Vector({source: source});
  const callback = sinon.spy();
  const filter = () => {};

  it('roept de callback functie op nadat er een modify werd uitgevoerd', () => {
    const modifyAction = new VlModifyAction({}, callback);
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

  it('na het deactiveren wordt de selectie verwijderd', () => {
    const modifyAction = new VlModifyAction({});
    modifyAction.map = new Map();
    const feature = new Feature({
      geometry: new Point([0, 0]),
    });
    modifyAction.selectInteraction.getFeatures().push(feature);
    modifyAction.deactivate();
    expect(modifyAction.selectInteraction.getFeatures().getLength()).to.equal(0);
  });

  it('de feature filter zal doorgegeven worden aan de select action', () => {
    const layers = {};
    const options = {
      filter: filter,
    };
    const modifyAction = new VlModifyAction(layers, null, options);
    expect(modifyAction.filter).to.equal(filter);
  });

  it('bevat standaard 4 interacties: select, modify, hover en mark interaction', () => {
    const modifyAction = new VlModifyAction(layer, callback, {});
    expect(modifyAction.interactions.length).to.equal(4);
    expect(modifyAction.interactions.filter((interaction) => interaction instanceof Modify).length).to.equal(1);
    expect(modifyAction.interactions.filter((interaction) => interaction instanceof Select).length).to.equal(3);
  });

  it('kan snapping aanzetten via opties met als standaard snapping layer de modify action layer', () => {
    const options = {
      filter: filter,
    };
    let modifyAction = new VlModifyAction(layer, callback, options);
    expect(modifyAction.interactions.length).to.equal(4);
    expect(modifyAction.interactions.find((interaction) => interaction instanceof VlSnapInteraction)).to.be.undefined;

    options.snapping = false;
    modifyAction = new VlModifyAction(layer, callback, options);
    expect(modifyAction.interactions.length).to.equal(4);
    expect(modifyAction.interactions.find((interaction) => interaction instanceof VlSnapInteraction)).to.be.undefined;

    options.snapping = true;
    modifyAction = new VlModifyAction(layer, callback, options);
    expect(modifyAction.interactions.length).to.equal(5);
    expect(modifyAction.interactions.find((interaction) => interaction instanceof VlSnapInteraction)).to.not.be.undefined;
    expect(modifyAction.interactions.find((interaction) => interaction instanceof VlSnapInteraction).source_).to.equal(source);

    const snappingSource = new SourceVector({features: []});
    const snappingLayer = new Vector({source: snappingSource});
    options.snapping = {
      layer: snappingLayer,
      pixelTolerance: 1000,
    };
    modifyAction = new VlModifyAction(layer, callback, options);
    expect(modifyAction.interactions.length).to.equal(5);
    const snapInteraction = modifyAction.interactions.find((interaction) => interaction instanceof VlSnapInteraction);
    expect(snapInteraction.source_).to.equal(snappingSource);
    expect(snapInteraction.pixelTolerance_).to.equal(1000);
  });
});
