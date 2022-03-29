import {VlBoxSelectAction} from '../../src/vl-mapactions-box-select-action';
import sinon from 'sinon/pkg/sinon-esm';
import Map from 'ol/Map';
import Feature from 'ol/Feature';
import {expect} from 'chai';

describe('box select action', () => {
  const feature1 = new Feature({id: 1});
  const feature2 = new Feature({id: 2});
  const intersectingFeatures = [feature1, feature2];
  let callback;

  const createVlBoxSelectAction = (filter) => {
    callback = sinon.spy();
    const action = new VlBoxSelectAction({
      getSource: () => {
        return {
          getFeatures: () => {
            return [];
          },
          forEachFeatureIntersectingExtent: (extent, fn) => {
            intersectingFeatures.forEach(fn);
          },
        };
      },
    }, callback, {filter});
    sinon.stub(action.dragBoxInteraction, 'getGeometry').returns({getExtent: () => {}});
    action.map = new Map();
    return action;
  };

  it('kan op actief gezet worden, zodat de selectie, hover en dragbox interacties op actief gezet worden', () => {
    const VlboxSelectAction = createVlBoxSelectAction();
    expect(VlboxSelectAction.hoverInteraction.getActive()).to.be.false;
    expect(VlboxSelectAction.selectInteraction.getActive()).to.be.false;
    expect(VlboxSelectAction.dragBoxInteraction.getActive()).to.be.false;

    VlboxSelectAction.activate();
    expect(VlboxSelectAction.hoverInteraction.getActive()).to.be.true;
    expect(VlboxSelectAction.selectInteraction.getActive()).to.be.true;
    expect(VlboxSelectAction.dragBoxInteraction.getActive()).to.be.true;
  });

  it('kan terug op deactief gezet worden, zodat de selectie, hover en dragbox interacties op deactief gezet worden', () => {
    const VlboxSelectAction = createVlBoxSelectAction();
    VlboxSelectAction.activate();
    VlboxSelectAction.deactivate();
    expect(VlboxSelectAction.hoverInteraction.getActive()).to.be.false;
    expect(VlboxSelectAction.selectInteraction.getActive()).to.be.false;
    expect(VlboxSelectAction.dragBoxInteraction.getActive()).to.be.false;
  });

  it('zal de callback functie nog niet gebeurd zijn na het actief maken van de box selectie', () => {
    const VlboxSelectAction = createVlBoxSelectAction();
    VlboxSelectAction.activate();
    expect(callback.notCalled).to.be.true;
  });

  it('zal bij het slepen van de box selectie, de features van de layer toevoegen aan de hover interactie', () => {
    const VlboxSelectAction = createVlBoxSelectAction();
    VlboxSelectAction.dragBoxInteraction.dispatchEvent('boxdrag');
    expect(VlboxSelectAction.hoverInteraction.getFeatures().getArray()).to.have.members([feature1, feature2]);
  });

  it('zal bij het slepen van de box selectie, enkel de features van de layer toevoegen aan de hover interactie die voldoen aan de geconfigureerde filter', () => {
    const VlboxSelectAction = createVlBoxSelectAction((feature) => feature === feature1);
    VlboxSelectAction.dragBoxInteraction.dispatchEvent('boxdrag');
    expect(VlboxSelectAction.hoverInteraction.getFeatures().getArray()).to.have.members([feature1]);
  });

  it('zal bij het einde van de box selectie als er geen features intersecten, geen callbcak functie oproepen', () => {
    const VlboxSelectAction = createVlBoxSelectAction();
    VlboxSelectAction.dragBoxInteraction.dispatchEvent('boxend');
    expect(callback.notCalled).to.be.true;
  });

  it('zal bij het einde van de box selectie, de features toegevoegd hebben aan de selectie interactie, en de callback functie oproepen van de interactie met de intersecting feature', () => {
    const VlboxSelectAction = createVlBoxSelectAction();
    VlboxSelectAction.dragBoxInteraction.dispatchEvent('boxdrag');
    VlboxSelectAction.dragBoxInteraction.dispatchEvent('boxend');
    expect(VlboxSelectAction.hoverInteraction.getFeatures().getArray()).to.have.members([feature1, feature2]);
    expect(callback.calledWith([feature1, feature2])).to.be.true;
  });

  it('zal bij het maken van een selectie door een klik, de callback functie aanroepen van de interactie', () => {
    const VlboxSelectAction = createVlBoxSelectAction();
    const selectedFeature = new Feature();
    VlboxSelectAction.selectInteraction.getFeatures().push(selectedFeature);
    VlboxSelectAction.selectInteraction.dispatchEvent('select');
    expect(callback.calledWith([selectedFeature])).to.be.true;
  });
});
