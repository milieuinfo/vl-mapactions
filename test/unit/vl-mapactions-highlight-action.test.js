import './setup.js';
import {expect} from 'chai';
import {HighlightAction} from '../../src/vl-mapactions-highlight-action';
import Feature from 'ol/src/Feature';
import Style from 'ol/src/style/Style';
import {Vector} from 'ol/src/layer';
import {Vector as SourceVector} from 'ol/src/source';

describe('highlight action', () => {
  it('kan de highlight stijl definiëren', () => {
    const style = new Style();
    const highlightAction = new HighlightAction({}, {
      style: style,
    });
    expect(highlightAction.highlightInteraction.getStyle()).to.equal(style);
  });

  it('kan features highlighten en dehighlighten', () => {
    const feature1 = new Feature();
    const feature2 = new Feature();
    feature1.setId(1);
    feature2.setId(2);
    const highlightAction = new HighlightAction({
      getSource: () => {
        return {
          getFeatureById: (id) => {
            return id == 1 ? feature1 : feature2;
          },
        };
      },
    });

    highlightAction.highlightFeatureWithId(1);
    expect(highlightAction.isHighlighted(feature1)).to.be.true;
    expect(highlightAction.highlightInteraction.getFeatures().getLength()).to.equal(1);
    highlightAction.highlightFeatureWithId(2);
    expect(highlightAction.isHighlighted(feature2)).to.be.true;
    expect(highlightAction.highlightInteraction.getFeatures().getLength()).to.equal(2);
    highlightAction.dehighlightAllFeatures();
    expect(highlightAction.highlightInteraction.getFeatures().getLength()).to.equal(0);
    expect(highlightAction.isHighlighted(feature1)).to.be.false;
    expect(highlightAction.isHighlighted(feature2)).to.be.false;
  });

  it('kan clusters highlighten en dehighlighten', () => {
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
    const highlightAction = new HighlightAction(layer);
    highlightAction.highlightFeatureWithId(1);
    expect(highlightAction.isHighlighted(cluster1)).to.be.true;
    expect(highlightAction.isHighlighted(cluster2)).to.be.false;
    expect(highlightAction.highlightInteraction.getFeatures().getLength()).to.equal(1);
    highlightAction.highlightFeatureWithId(2);
    expect(highlightAction.isHighlighted(cluster1)).to.be.true;
    expect(highlightAction.isHighlighted(cluster2)).to.be.false;
    highlightAction.dehighlightAllFeatures();
    expect(highlightAction.isHighlighted(cluster1)).to.be.false;
    expect(highlightAction.isHighlighted(cluster2)).to.be.false;
  });

  it('kan de highlight stijl niet bepalen als die niet gedefinieerd is', () => {
    const highlightAction = new HighlightAction({});
    expect(highlightAction.style).to.be.undefined;
  });

  it('zal bij een deactivate de highlight features clearen', () => {
    const highlightAction = new HighlightAction({});
    const feature = new Feature({id: 1});
    highlightAction.highlightInteraction.getFeatures().push(feature);
    highlightAction.deactivate();
    expect(highlightAction.highlightInteraction.getFeatures().getLength()).to.equal(0);
  });
});
