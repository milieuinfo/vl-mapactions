import './setup.js';
import {expect} from 'chai';
import Map from 'ol/Map';
import Style from 'ol/style/Style';
import {VlDeleteAction} from '../../src/vl-mapactions-delete-action';
import {Vector as SourceVector} from 'ol/source';
import {Vector} from 'ol/layer';
import Feature from 'ol/Feature';
import sinon from 'sinon/pkg/sinon-esm';

describe('delete action', () => {
  const createVlDeleteAction = ({layer, callback, options = {}}) => {
    const action = new VlDeleteAction(layer, callback, options);
    action.map = new Map();
    action.map.render = sinon.spy();
    return action;
  };

  it('indien er geen delete stijl gedefinieerd is zal de standaard stijl gebruikt worden', () => {
    const deleteAction = createVlDeleteAction({layer: {}});
    expect(deleteAction.style).to.not.be.undefined;
  });

  it('de delete stijl kan bepaald worden', () => {
    const style = new Style();
    const deleteAction = createVlDeleteAction({options: {style: style}});
    expect(deleteAction.style).to.equal(style);
  });

  it('bij het oproepen van de callback zal na een success de selectie weggehaald worden', () => {
    const feature = new Feature();
    feature.setId(1);
    const layer = new Vector({source: new SourceVector({features: [feature]})});
    const callback = (features, success, cancel) => success(feature);
    const deleteAction = createVlDeleteAction({layer: layer, callback: callback});
    deleteAction.selectInteraction.getFeatures().push(feature);
    deleteAction.selectInteraction.dispatchEvent('select');
    expect(deleteAction.selectInteraction.getFeatures().getLength()).to.equal(0);
    expect(deleteAction.map.render.called).to.be.true;
  });

  it('bij het oproepen van de callback zal na een cancel de selectie weggehaald worden', () => {
    const feature = new Feature();
    feature.setId(1);
    const layer = new Vector({source: new SourceVector({features: [feature]})});
    const callback = (features, success, cancel) => cancel();
    const deleteAction = createVlDeleteAction({layer: layer, callback: callback});
    deleteAction.selectInteraction.getFeatures().push(feature);
    deleteAction.selectInteraction.dispatchEvent('select');
    expect(deleteAction.selectInteraction.getFeatures().getLength()).to.equal(0);
    expect(deleteAction.map.render.called).to.be.true;
  });

  it('bij het oproepen van de callback zal na de success de geselecteerde feature(s) weggehaald worden', () => {
    const feature = new Feature();
    feature.setId(1);
    const layer = new Vector({source: new SourceVector({features: [feature]})});
    const callback = (features, success, cancel) => success(feature);
    const deleteAction = createVlDeleteAction({layer: layer, callback: callback});
    deleteAction.selectInteraction.getFeatures().push(feature);
    deleteAction.selectInteraction.dispatchEvent('select');
    expect(layer.getSource().getFeatures().length).to.equal(0);
    expect(deleteAction.map.render.called).to.be.true;
  });

  it('bij het oproepen van de callback zal na een cancel de geselecteerde feature(s) niet weggehaald worden', () => {
    const feature = new Feature();
    feature.setId(1);
    const layer = new Vector({source: new SourceVector({features: [feature]})});
    const callback = (features, success, cancel) => cancel();
    const deleteAction = createVlDeleteAction({layer: layer, callback: callback});
    deleteAction.selectInteraction.getFeatures().push(feature);
    deleteAction.selectInteraction.dispatchEvent('select');
    expect(layer.getSource().getFeatures().length).to.equal(1);
    expect(deleteAction.map.render.called).to.be.true;
  });

  it('als er geen callback is meegegeven kunnen worden de features onmiddellijk verwijderd', () => {
    const feature = new Feature();
    feature.setId(1);
    const layer = new Vector({source: new SourceVector({features: [feature]})});
    const deleteAction = createVlDeleteAction({layer: layer});
    deleteAction.selectInteraction.getFeatures().push(feature);
    deleteAction.selectInteraction.dispatchEvent('select');
    expect(layer.getSource().getFeatures().length).to.equal(0);
    expect(deleteAction.selectInteraction.getFeatures().getLength()).to.equal(0);
    expect(deleteAction.map.render.called).to.be.true;
  });
  
  it('zal bij het einde van de box selectie, de features toegevoegd hebben aan de selectie interactie, en de callback functie oproepen van de interactie met de intersecting feature', () => {
    const feature = new Feature();
    feature.setId(1);
    const layer = {
        getSource: () => {
          return {
            getFeatures: () => {
              return [];
            },
            forEachFeatureIntersectingExtent: (extent, fn) => {
              fn(feature);
            },
          };
        },
      }

    const callback = sinon.spy();
    const deleteAction = createVlDeleteAction({layer: layer, callback: callback});
    sinon.stub(deleteAction.dragBoxInteraction, 'getGeometry').returns({getExtent: () => {}});
    deleteAction.dragBoxInteraction.dispatchEvent('boxdrag');
    deleteAction.dragBoxInteraction.dispatchEvent('boxend');
    expect(callback.calledWith([feature])).to.be.true;
    expect(deleteAction.map.render.called).to.be.true;
   });

});
