import sinon from 'sinon/pkg/sinon-esm';
import {expect} from 'chai';
import {Vector as SourceVector} from 'ol/source';
import {DrawLijnstukAction} from '../../src/vl-mapactions-draw-lijnstuk-action';

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

    const action = new DrawLijnstukAction(layer, callback, options);
    expect(action.drawLijnstukOptions.maxPoints).to.equal(2);
    expect(action.drawLijnstukOptions.snapping).to.deep.equal(snappingOptions);
    expect(action.drawLijnstukOptions.measure).to.be.true;
  });

  it('geeft de juiste configuratie mee aan de draw interaction', () => {
    const action = new DrawLijnstukAction(layer, callback);
    expect(action.drawOptions).to.deep.equal(action.drawLijnstukOptions);
  });
});
