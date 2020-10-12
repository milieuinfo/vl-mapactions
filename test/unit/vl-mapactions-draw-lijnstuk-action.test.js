import sinon from 'sinon/pkg/sinon-esm';
import {expect} from 'chai';
import {Vector as SourceVector} from 'ol/source';
import {VlDrawLineAction} from '../../src/vl-mapactions-draw-line-action';

describe('draw action', () => {
  const source = new SourceVector({});

  const layer = {
    getSource: () => {
      return source;
    },
  };

  const callback = sinon.spy();

  it('geeft de options door aan de draw action', () => {
    const snappingOptions = {
      layer: {
        getSource: () => {},
      },
    };
    const options = {
      snapping: snappingOptions,
      measure: true,
    };

    const action = new VlDrawLineAction(layer, callback, options);
    expect(action.drawLineOptions.maxPoints).to.equal(2);
    expect(action.drawLineOptions.snapping).to.deep.equal(snappingOptions);
    expect(action.drawLineOptions.measure).to.be.true;
  });

  it('geeft de juiste configuratie mee aan de draw interaction', () => {
    const action = new VlDrawLineAction(layer, callback);
    expect(action.drawOptions).to.deep.equal(action.drawLineOptions);
  });
});
