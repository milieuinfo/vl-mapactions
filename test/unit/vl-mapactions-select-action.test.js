import './setup.js';
import sinon from 'sinon/pkg/sinon-esm';
import {expect} from 'chai';
import {SelectAction} from '../../src/vl-mapactions-select-action';
import Style from 'ol/src/style/Style';
import Feature from 'ol/src/Feature';
import {Vector as SourceVector} from 'ol/src/source';
import {Vector} from 'ol/src/layer';

describe('select action', () => {
  it('kan de selectie en hover stijl definiëren', () => {
    const selectieStyle = new Style();
    const hoverStyle = new Style();
    const selectAction = new SelectAction({}, null, {
      style: selectieStyle,
      hoverStyle: hoverStyle,
    });
    expect(selectAction.style).to.equal(selectieStyle);
    expect(selectAction.hoverStyle).to.equal(hoverStyle);
  });

  it('zal terugvallen op de selectie stijl indien er geen hover stijl gedefinieerd is', () => {
    const style = new Style();
    const selectAction = new SelectAction({}, null, {
      style: style,
    });
    expect(selectAction.hoverStyle).to.equal(style);
  });

  it('kan de selectie en hover stijl niet bepalen als die niet gedefinieerd is', () => {
    const selectAction = new SelectAction({});
    expect(selectAction.style).to.be.null;
    expect(selectAction.hoverStyle).to.be.null;
  });

  it('kan features markeren en demarkeren', () => {
    const feature1 = new Feature();
    const feature2 = new Feature();
    feature1.setId(1);
    feature2.setId(2);
    const selectAction = new SelectAction({
      getSource: () => {
        return {
          getFeatureById: (id) => id == 1 ? feature1 : feature2,
        };
      },
    });
    selectAction.markFeatureWithId(1);
    expect(selectAction.isMarked(feature1)).to.be.true;
    expect(selectAction.markInteraction.getFeatures().getLength()).to.equal(1);
    selectAction.markFeatureWithId(2);
    expect(selectAction.isMarked(feature2)).to.be.true;
    expect(selectAction.markInteraction.getFeatures().getLength()).to.equal(2);
    selectAction.demarkAllFeatures();
    expect(selectAction.markInteraction.getFeatures().getLength()).to.equal(0);
    expect(selectAction.isMarked(feature1)).to.be.false;
    expect(selectAction.isMarked(feature2)).to.be.false;
  });

  it('kan clusters markeren en demarkeren', () => {
    const feature1 = new Feature();
    feature1.setId(1);
    const feature2 = new Feature();
    feature2.setId(2);
    const feature3 = new Feature();
    feature3.setId(3);
    const cluster1 = new Feature();
    const cluster2 = new Feature();
    cluster1.set('features', [feature1, feature2]);
    cluster2.set('features', [feature3]);
    const layer = new Vector({
      source: new SourceVector({
        features: [cluster1, cluster2],
      }),
    });
    const selectAction = new SelectAction(layer);
    selectAction.markFeatureWithId(1);
    expect(selectAction.isMarked(cluster1)).to.be.true;
    expect(selectAction.isMarked(cluster2)).to.be.false;
    expect(selectAction.markInteraction.getFeatures().getLength()).to.equal(1);
    selectAction.markFeatureWithId(2);
    expect(selectAction.isMarked(cluster1)).to.be.true;
    expect(selectAction.isMarked(cluster2)).to.be.false;
    selectAction.demarkAllFeatures();
    expect(selectAction.isMarked(cluster1)).to.be.false;
    expect(selectAction.isMarked(cluster2)).to.be.false;
  });

  it('zal de onselect functie oproepen als een feature geselecteerd wordt', () => {
    const layer = {
      id: 'layer1',
      getSource: () => {
        return {
          getFeatures: () => {
            return [feature];
          },
        };
      },
    };
    const onSelect = sinon.spy();
    const feature = new Feature({id: 1});
    const selectAction = new SelectAction(layer, onSelect);
    selectAction.selectInteraction.getFeatures().push(feature);
    const event = {type: 'select'};
    selectAction.selectInteraction.dispatchEvent(event);
    expect(onSelect.callCount).to.equal(1);
    const argsForCall = onSelect.getCall(0).args;
    expect(argsForCall.length).to.equal(3);
    expect(argsForCall[0]).to.equal(feature);
    expect(argsForCall[1].type).to.equal('select');
    expect(argsForCall[2]).to.equal(layer);
  });

  it('als er meer dan 1 feature geselecteerd is, zal er bij elke klik afwisselend de volgende geselecteerd worden', () => {
    const onSelect = sinon.spy();
    const feature = new Feature({id: 1});
    const feature2 = new Feature({id: 2});
    const feature3 = new Feature({id: 3});
    const selectAction = new SelectAction([{
      id: 'layer1',
      getSource: () => {
        return {
          getFeatures: () => {
            return [feature, feature2, feature3];
          },
        };
      },
    }], onSelect);

    selectAction.selectInteraction.getFeatures().push(feature);
    selectAction.selectInteraction.getFeatures().push(feature2);
    selectAction.selectInteraction.getFeatures().push(feature3);

    selectAction.selectInteraction.dispatchEvent({type: 'select'});
    expect(onSelect.getCall(0).args[0]).to.equal(feature);
    selectAction.selectInteraction.dispatchEvent({type: 'select'});
    expect(onSelect.getCall(1).args[0]).to.equal(feature2);
    selectAction.selectInteraction.dispatchEvent({type: 'select'});
    expect(onSelect.getCall(2).args[0]).to.equal(feature3);
    selectAction.selectInteraction.dispatchEvent({type: 'select'});
    expect(onSelect.getCall(3).args[0]).to.equal(feature);
  });

  it('als er programmatorisch een feature geselecteerd wordt zal daarna bij een klik ook de volgende genomen worden', () => {
    const onSelect = sinon.spy();
    const feature = new Feature({id: 1});
    const feature2 = new Feature({id: 2});
    const feature3 = new Feature({id: 3});
    const selectAction = new SelectAction([{
      id: 'layer1',
      getSource: () => {
        return {
          getFeatures: () => {
            return [feature, feature2, feature3];
          },
          getFeatureById: (id) => {
            switch (id) {
              case 1:
                return feature;
              case 2:
                return feature2;
              case 3:
                return feature3;
            }
          },
        };
      },
    }], onSelect);

    selectAction.selectFeature(feature);
    selectAction.clearFeatures(feature);

    selectAction.selectInteraction.getFeatures().push(feature2);
    selectAction.selectInteraction.dispatchEvent({type: 'select'});
    selectAction.selectInteraction.getFeatures().push(feature3);
    selectAction.selectInteraction.dispatchEvent({type: 'select'});

    expect(onSelect.getCall(0).args[0].get('id')).to.equal(1);
    expect(onSelect.getCall(1).args[0].get('id')).to.equal(2);
    expect(onSelect.getCall(2).args[0].get('id')).to.equal(3);
  });

  it('als er gevraagd wordt om de laatst geselecteerde feature te vergeten wordt daarna bij een klik op meerdere terug de 1e genomen', () => {
    const onSelect = sinon.spy();
    const feature = new Feature();
    const feature2 = new Feature();
    const feature3 = new Feature();
    feature.setId(1);
    feature2.setId(2);
    feature3.setId(3);
    const selectAction = new SelectAction({
      id: 'layer1',
      getSource: () => {
        return {
          getFeatures: () => {
            return [feature, feature2, feature3];
          },
          getFeatureById: (id) => {
            switch (id) {
              case 1:
                return feature;
              case 2:
                return feature2;
              case 3:
                return feature3;
            }
          },
        };
      },
    }, onSelect);

    selectAction.selectInteraction.getFeatures().push(feature);
    selectAction.selectInteraction.getFeatures().push(feature2);
    selectAction.selectInteraction.getFeatures().push(feature3);

    selectAction.selectInteraction.dispatchEvent({type: 'select'});
    expect(onSelect.getCall(0).args[0]).to.equal(feature);
    selectAction.selectInteraction.dispatchEvent({type: 'select'});
    expect(onSelect.getCall(1).args[0]).to.equal(feature2);
    selectAction.vergeetLaatstGeselecteerdeFeature();
    selectAction.selectInteraction.dispatchEvent({type: 'select'});
    expect(onSelect.getCall(2).args[0]).to.equal(feature);
  });

  it('zal de onselect functie oproepen met lege argumenten als er een select wordt gedaan niet op een feature', () => {
    const onSelect = sinon.spy();
    const selectAction = new SelectAction([{}], onSelect);
    selectAction.map = {
      on: sinon.spy(),
      un: sinon.spy(),
    };
    selectAction.activate();
    selectAction.selectInteraction.dispatchEvent('select');
    expect(onSelect.calledWithExactly()).to.be.true;
  });

  it('zal bij een deactivate de selectie features clearen', () => {
    const selectAction = new SelectAction([{}]);
    selectAction.map = {
      on: sinon.spy(),
      un: sinon.spy(),
    };
    const feature = new Feature({id: 1});
    selectAction.selectInteraction.getFeatures().push(feature);
    selectAction.deactivate();
    expect(selectAction.selectInteraction.getFeatures().getLength()).to.equal(0);
  });

  it('zal bij het filteren van de selectie eerst de selectie clearen, zodat dezelfde feature opnieuw kan gekozen worden', () => {
    const feature = new Feature();
    feature.setId(1);
    const layer = new Vector({source: new SourceVector({features: [feature]})});
    const selectAction = new SelectAction(layer);
    selectAction.selectInteraction.getFeatures().push(feature);
    const filter = selectAction.selectInteractionFilter(feature);
    expect(filter).to.be.true;
    expect(selectAction.selectInteraction.getFeatures().getLength()).to.equal(0);
  });

  it('zal bij het filteren van de hover de huidige selectie niet in rekening brengen', () => {
    const feature = new Feature();
    feature.setId(1);
    const layer = new Vector({source: new SourceVector({features: [feature]})});
    const selectAction = new SelectAction(layer);
    selectAction.selectInteraction.getFeatures().push(feature);
    const filter = selectAction.hoverInteractionFilter(feature, layer);
    expect(filter).to.be.false;
  });

  it('kan gebruik maken van een feature filter', () => {
    const feature = new Feature();
    feature.setId(1);
    const featureWithId2 = new Feature();
    feature.setId(2);
    let filter = (feature) => feature.getId() == 1;
    const selectAction = new SelectAction([new Vector({source: new SourceVector({features: [feature, featureWithId2]})})], null, {
      filter: filter,
    });
    selectAction.selectInteraction.getFeatures().push(featureWithId2);
    filter = selectAction.selectInteractionFilter(feature);
    expect(filter).to.be.false;
  });

  it('zal bij activatie de functie activeren om na het zoomen de selectie bij clustering goed te zetten', () => {
    const selectAction = new SelectAction([{}], null, {
      cluster: true,
    });
    const on = sinon.spy();
    selectAction.map = {
      on: on,
    };
    selectAction.activate();
    expect(on.calledWithExactly('moveend', selectAction._fixClusterBehaviorListener)).to.be.true;
  });

  it('zal bij deactivate de functie deactiveren om na het zoomen de selectie bij clustering goed te zetten', () => {
    const selectAction = new SelectAction([{}], null, {
      cluster: true,
    });
    const un = sinon.spy();
    selectAction.map = {
      on: sinon.spy(),
      un: un,
    };
    selectAction.activate();
    selectAction.deactivate();
    expect(un.calledWithExactly('moveend', selectAction._fixClusterBehaviorListener)).to.be.true;
  });

  it('zal na het zoomen de geselecteerde feature verplaatsen naar de markeer selecteer interactie om visuele problemen met geselecteerde feature en cluster te voorkomen', () => {
    const feature = new Feature();
    feature.setId(1);
    const layer = {
      id: 'layer1',
      getSource: () => {
        return {
          getFeatures: () => {
            return [feature];
          },
          getFeatureById: (id) => {
            return (id == 1 ? feature : null);
          },
        };
      },
    };
    const selectAction = new SelectAction(layer, null, {
      cluster: true,
    });
    selectAction.map = {
      on: sinon.spy(),
      un: sinon.spy(),
    };
    selectAction.activate();
    selectAction.selectInteraction.getFeatures().push(feature);
    expect(selectAction.selectInteraction.getFeatures().getLength()).to.equal(1);
    expect(selectAction.markInteraction.getFeatures().getLength()).to.equal(0);
    expect(selectAction.hoverInteraction.getFeatures().getLength()).to.equal(0);
    const event = {type: 'select'};
    selectAction.selectInteraction.dispatchEvent(event);
    expect(selectAction.selectInteraction.getFeatures().getLength()).to.equal(0);
    expect(selectAction.markInteraction.getFeatures().getLength()).to.equal(1);
    expect(selectAction.hoverInteraction.getFeatures().getLength()).to.equal(0);
    selectAction._fixClusterBehavior();
    expect(selectAction.selectInteraction.getFeatures().getLength()).to.equal(0);
    expect(selectAction.markInteraction.getFeatures().getLength()).to.equal(1);
    expect(selectAction.hoverInteraction.getFeatures().getLength()).to.equal(0);
  });
});
