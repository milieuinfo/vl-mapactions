import {VlBoxSelectAction} from '../../src/vl-mapactions-box-select-action';
import sinon from 'sinon/pkg/sinon-esm';
import Feature from 'ol/Feature';
import {expect} from 'chai';

describe('box select action', () => {
  let intersectingFeature;
  let callback;

  const createVlBoxSelectAction = () => {
    callback = sinon.spy();
    const action = new VlBoxSelectAction({
      getSource: () => {
        return {
          getFeatures: () => {
            return [];
          },
          forEachFeatureIntersectingExtent: (extent, fn) => {
            intersectingFeature = new Feature();
            fn(intersectingFeature);
          },
        };
      },
    }, callback);
    sinon.stub(action.dragBoxInteraction, 'getGeometry').returns({
      getExtent: () => {},
    });
    return action;
  };

  it('kan op actief gezet worden, zodat de selectie, hover en dragbox interacties op actief gezet worden', () => {
    const VlboxSelectAction = createVlBoxSelectAction();
    VlboxSelectAction.map = {
      on: sinon.spy(),
      un: sinon.spy(),
    };
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
    VlboxSelectAction.map = {
      on: sinon.spy(),
      un: sinon.spy(),
    };
    VlboxSelectAction.activate();
    VlboxSelectAction.deactivate();
    expect(VlboxSelectAction.hoverInteraction.getActive()).to.be.false;
    expect(VlboxSelectAction.selectInteraction.getActive()).to.be.false;
    expect(VlboxSelectAction.dragBoxInteraction.getActive()).to.be.false;
  });

  it('zal de callback functie nog niet gebeurd zijn na het actief maken van de box selectie', () => {
    const VlboxSelectAction = createVlBoxSelectAction();
    VlboxSelectAction.map = {
      on: sinon.spy(),
      un: sinon.spy(),
    };

    VlboxSelectAction.activate();
    expect(callback.notCalled).to.be.true;
  });

  it('zal bij het slepen van de box selectie, de features van de layer toevoegen aan de hover interactie', () => {
    const VlboxSelectAction = createVlBoxSelectAction();
    VlboxSelectAction.dragBoxInteraction.dispatchEvent('boxdrag');
    expect(VlboxSelectAction.hoverInteraction.getFeatures().getArray()).contain(intersectingFeature);
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
    expect(VlboxSelectAction.hoverInteraction.getFeatures().getArray()).contain(intersectingFeature);
    expect(callback.calledWith([intersectingFeature])).to.be.true;
  });

  it('zal bij het maken van een selectie door een klik, de callback functie aanroepen van de interactie', () => {
    const VlboxSelectAction = createVlBoxSelectAction();
    const selectedFeature = new Feature();
    VlboxSelectAction.selectInteraction.getFeatures().push(selectedFeature);
    VlboxSelectAction.selectInteraction.dispatchEvent('select');
    expect(callback.calledWith([selectedFeature])).to.be.true;
  });
});
