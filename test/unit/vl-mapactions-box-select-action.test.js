import {BoxSelectAction} from '../../src/vl-mapactions-box-select-action';
import sinon from 'sinon/pkg/sinon-esm';
import Feature from 'ol/Feature';
import {expect} from 'chai';

describe('box select action', () => {
  let intersectingFeature;
  let callback;

  const createBoxSelectAction = () => {
    callback = sinon.spy();
    const action = new BoxSelectAction({
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
    const boxSelectAction = createBoxSelectAction();
    boxSelectAction.map = {
      on: sinon.spy(),
      un: sinon.spy(),
    };
    expect(boxSelectAction.hoverInteraction.getActive()).to.be.false;
    expect(boxSelectAction.selectInteraction.getActive()).to.be.false;
    expect(boxSelectAction.dragBoxInteraction.getActive()).to.be.false;

    boxSelectAction.activate();
    expect(boxSelectAction.hoverInteraction.getActive()).to.be.true;
    expect(boxSelectAction.selectInteraction.getActive()).to.be.true;
    expect(boxSelectAction.dragBoxInteraction.getActive()).to.be.true;
  });

  it('kan terug op deactief gezet worden, zodat de selectie, hover en dragbox interacties op deactief gezet worden', () => {
    const boxSelectAction = createBoxSelectAction();
    boxSelectAction.map = {
      on: sinon.spy(),
      un: sinon.spy(),
    };
    boxSelectAction.activate();
    boxSelectAction.deactivate();
    expect(boxSelectAction.hoverInteraction.getActive()).to.be.false;
    expect(boxSelectAction.selectInteraction.getActive()).to.be.false;
    expect(boxSelectAction.dragBoxInteraction.getActive()).to.be.false;
  });

  it('zal de callback functie nog niet gebeurd zijn na het actief maken van de box selectie', () => {
    const boxSelectAction = createBoxSelectAction();
    boxSelectAction.map = {
      on: sinon.spy(),
      un: sinon.spy(),
    };

    boxSelectAction.activate();
    expect(callback.notCalled).to.be.true;
  });

  it('zal bij het slepen van de box selectie, de features van de layer toevoegen aan de hover interactie', () => {
    const boxSelectAction = createBoxSelectAction();
    boxSelectAction.dragBoxInteraction.dispatchEvent('boxdrag');
    expect(boxSelectAction.hoverInteraction.getFeatures().getArray()).contain(intersectingFeature);
  });

  it('zal bij het einde van de box selectie als er geen features intersecten, geen callbcak functie oproepen', () => {
    const boxSelectAction = createBoxSelectAction();
    boxSelectAction.dragBoxInteraction.dispatchEvent('boxend');
    expect(callback.notCalled).to.be.true;
  });

  it('zal bij het einde van de box selectie, de features toegevoegd hebben aan de selectie interactie, en de callback functie oproepen van de interactie met de intersecting feature', () => {
    const boxSelectAction = createBoxSelectAction();
    boxSelectAction.dragBoxInteraction.dispatchEvent('boxdrag');
    boxSelectAction.dragBoxInteraction.dispatchEvent('boxend');
    expect(boxSelectAction.hoverInteraction.getFeatures().getArray()).contain(intersectingFeature);
    expect(callback.calledWith([intersectingFeature])).to.be.true;
  });

  it('zal bij het maken van een selectie door een klik, de callback functie aanroepen van de interactie', () => {
    const boxSelectAction = createBoxSelectAction();
    const selectedFeature = new Feature();
    boxSelectAction.selectInteraction.getFeatures().push(selectedFeature);
    boxSelectAction.selectInteraction.dispatchEvent('select');
    expect(callback.calledWith([selectedFeature])).to.be.true;
  });
});
