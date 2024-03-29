import sinon from 'sinon/pkg/sinon-esm';
import {expect} from 'chai';
import {Vector as SourceVector} from 'ol/source';
import {VlDrawLineAction} from '../../src/vl-mapactions-draw-line-action';

describe('draw line action', () => {
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
    expect(action.options.maxPoints).to.be.undefined;
    expect(action.options.snapping).to.deep.equal(options.snapping);
    expect(action.options.measure).to.be.true;
  });

  it('geeft de juiste configuratie mee aan de draw interaction', () => {
    const action = new VlDrawLineAction(layer, callback);
    expect(action.options).to.deep.equal(action.options);
  });
});
