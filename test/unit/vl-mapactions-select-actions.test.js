import sinon from 'sinon/pkg/sinon-esm';
import {expect} from 'chai';
import {Vector as SourceVector} from 'ol/src/ol/source';
import {Vector} from 'ol/src/ol/layer';
import {SelectActions} from '../../../src/vl-mapactions-select-actions';
import {SelectAction} from '../../../src/vl-mapactions-select-action';
import Feature from 'ol/src/ol/Feature';
import Style from 'ol/src/ol/style/Style';

describe('select actions', function() {
  it('select actions is een select action', function() {
    const selectActions = new SelectActions([{}], null, {});
    expect(selectActions instanceof SelectAction).to.be.true;
  });

  it('select actions bevat de layers en configuraties', function() {
    const feature1 = new Feature();
    const feature2 = new Feature();

    const layer1 = new Vector({
      source: new SourceVector({
        features: [feature1],
      }),
    });

    const layer2 = new Vector({
      source: new SourceVector({
        features: [feature2],
      }),
    });

    const style1 = new Style();
    const style2 = new Style();
    const hoverStyle1 = new Style();
    const hoverStyle2 = new Style();

    const layerConfiguraties = [{
      layer: layer1,
      style: style1,
      hoverStyle: hoverStyle1,
    }, {
      layer: layer2,
      style: style2,
      hoverStyle: hoverStyle2,
    }];

    const onSelect = sinon.spy();

    const selectActions = new SelectActions(layerConfiguraties, onSelect);

    expect(selectActions.layerConfiguraties).to.equal(layerConfiguraties);
    expect(selectActions.layers).to.deep.equal([layer1, layer2]);
  });

  it('select actions kan een custom filter bevatten', function() {
    const layer1 = new Vector({
      source: new SourceVector({
        features: [new Feature()],
      }),
    });
    const layerConfiguraties = [{
      layer: layer1,
      style: new Style(),
      hoverStyle: new Style(),
    }];
    const onSelect = sinon.spy();
    const filter = sinon.spy();
    const options = {
      filter: filter,
    };
    const feature = sinon.spy();
    const selectActions = new SelectActions(layerConfiguraties, onSelect, options);

    selectActions.filter(feature, layer1);

    expect(filter.calledWith(feature)).to.be.true;
  });

  it('kan de selectie en hover stijl per kaartlaag definiëren', function() {
    const selectieStyle1 = function() {
      return new Style();
    };
    const selectieStyle2 = function() {
      new Style();
    };
    const hoverStyle1 = function() {
      return new Style();
    };
    const hoverStyle2 = function() {
      return new Style();
    };
    const feature1 = new Feature();
    const feature2 = new Feature();

    const layerConfiguraties = [{
      layer: new Vector({
        source: new SourceVector({
          features: [feature1],
        }),
      }),
      style: selectieStyle1,
      hoverStyle: hoverStyle1,
    }, {
      layer: new Vector({
        source: new SourceVector({
          features: [feature2],
        }),
      }),
      style: selectieStyle2,
      hoverStyle: hoverStyle2,
    }];

    const selectActions = new SelectActions(layerConfiguraties, null, {});
    expect(selectActions.style(feature1)).to.deep.equal(selectieStyle1(feature1));
    expect(selectActions.style(feature2)).to.deep.equal(selectieStyle2(feature2));
    expect(selectActions.hoverStyle(feature1)).to.deep.equal(hoverStyle1(feature1));
    expect(selectActions.hoverStyle(feature2)).to.deep.equal(hoverStyle2(feature2));
  });

  it('zal per kaartlaag terugvallen op de selectie stijl indien er geen hover stijl gedefinieerd is', function() {
    const selectieStyle1 = function() {
      return new Style();
    };
    const selectieStyle2 = function() {
      new Style();
    };
    const feature1 = new Feature();
    const feature2 = new Feature();

    const layerConfiguraties = [{
      layer: new Vector({
        source: new SourceVector({
          features: [feature1],
        }),
      }),
      style: selectieStyle1,
    }, {
      layer: new Vector({
        source: new SourceVector({
          features: [feature2],
        }),
      }),
      style: selectieStyle2,
    }];

    const selectActions = new SelectActions(layerConfiguraties, null, {});
    expect(selectActions.hoverStyle(feature1)).to.deep.equal(selectieStyle1(feature1));
    expect(selectActions.hoverStyle(feature2)).to.deep.equal(selectieStyle2(feature2));
  });

  it('kan de selectie en hover stijl niet bepalen als die niet gedefinieerd is', function() {
    const feature = new Feature();

    const layerConfiguraties = [{
      layer: new Vector({
        source: new SourceVector({
          features: [feature],
        }),
      }),
    }];

    const selectActions = new SelectActions(layerConfiguraties);
    expect(selectActions.style(feature)).to.be.undefined;
    expect(selectActions.hoverStyle(feature)).to.be.undefined;
  });

  it('kan de selectie en hover stijl niet bepalen als de layer niet gekend is', function() {
    const feature = new Feature();
    const selectActions = new SelectActions([]);
    expect(selectActions.style(feature)).to.be.null;
    expect(selectActions.hoverStyle(feature)).to.be.null;
  });

  it('kan features markeren en demarkeren', function() {
    const feature1 = new Feature();
    const feature2 = new Feature();
    const feature3 = new Feature();
    feature1.setId(1);
    feature2.setId(2);
    feature3.setId(3);

    const selectActions = new SelectActions([{
      layer: new Vector({
        source: new SourceVector({
          features: [feature1, feature2],
        }),
      }),
    }, {
      layer: new Vector({
        source: new SourceVector({
          features: [feature3],
        }),
      }),
    }]);

    selectActions.markFeatureWithId(1);
    expect(selectActions.isMarked(feature1)).to.be.true;
    expect(selectActions.markInteraction.getFeatures().getLength()).to.equal(1);
    selectActions.markFeatureWithId(2);
    expect(selectActions.isMarked(feature2)).to.be.true;
    expect(selectActions.markInteraction.getFeatures().getLength()).to.equal(2);
    selectActions.markFeatureWithId(3);
    expect(selectActions.isMarked(feature3)).to.be.true;
    expect(selectActions.markInteraction.getFeatures().getLength()).to.equal(3);
    selectActions.demarkAllFeatures();
    expect(selectActions.markInteraction.getFeatures().getLength()).to.equal(0);
    expect(selectActions.isMarked(feature1)).to.be.false;
    expect(selectActions.isMarked(feature2)).to.be.false;
  });

  it('kan clusters markeren en demarkeren', function() {
    const feature1 = new Feature();
    const feature2 = new Feature();
    const feature3 = new Feature();
    const feature4 = new Feature();
    feature1.setId(1);
    feature2.setId(2);
    feature3.setId(3);
    feature4.setId(4);
    const features = [feature1, feature2, feature3];
    const cluster1 = new Feature();
    const cluster2 = new Feature();
    const cluster3 = new Feature();
    cluster1.set('features', [feature1, feature2]);
    cluster2.set('features', [feature3]);
    cluster3.set('features', [feature4]);
    const layer1 = new Vector({
      source: new SourceVector({
        features: [cluster1, cluster2],
      }),
    });
    const layer2 = new Vector({
      source: new SourceVector({
        features: [cluster3],
      }),
    });
    const selectActions = new SelectActions([{
      layer: layer1,
    }, {
      layer: layer2,
    }]);

    selectActions.markFeatureWithId(1);
    expect(selectActions.isMarked(cluster1)).to.be.true;
    expect(selectActions.isMarked(cluster2)).to.be.false;
    expect(selectActions.isMarked(cluster3)).to.be.false;
    expect(selectActions.markInteraction.getFeatures().getLength()).to.equal(1);
    selectActions.markFeatureWithId(2);
    expect(selectActions.isMarked(cluster1)).to.be.true;
    expect(selectActions.isMarked(cluster2)).to.be.false;
    expect(selectActions.isMarked(cluster3)).to.be.false;
    selectActions.markFeatureWithId(4);
    expect(selectActions.isMarked(cluster1)).to.be.true;
    expect(selectActions.isMarked(cluster2)).to.be.false;
    expect(selectActions.isMarked(cluster3)).to.be.true;
    selectActions.demarkAllFeatures();
    expect(selectActions.isMarked(cluster1)).to.be.false;
    expect(selectActions.isMarked(cluster2)).to.be.false;
    expect(selectActions.isMarked(cluster3)).to.be.false;
  });
});
