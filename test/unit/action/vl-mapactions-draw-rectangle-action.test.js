import sinon from 'sinon/pkg/sinon-esm';
import {expect} from 'chai';
import {Vector as SourceVector} from 'ol/src/ol/source';
import {DrawRectangleAction} from '../../../src/action/vl-mapactions-draw-rectangle-action';

describe('draw rectangle action', function() {

  const source = new SourceVector({});

  const layer = {
    getSource: function() {
      return source;
    },
  };

  const callback = sinon.spy();

  it('geeft de snapping configuratie door aan de draw action', function() {
    const snappingLayer = sinon.spy();
    const snapping = {
      layer: snappingLayer,
    };

    const action = new DrawRectangleAction(layer, callback, snapping);
    expect(action.drawRectangleOptions.layer).to.deep.equal(snappingLayer);
  });

  it('geeft de juiste configuratie mee aan de draw interaction', function() {
    const action = new DrawRectangleAction(layer, callback);
    expect(action.drawRectangleOptions.maxPoints).to.equal(2);
    const geometryFunction = action.drawRectangleOptions.geometryFunction;

    const geometry = geometryFunction([[0, 0], [1, 2]], null);
    expect(geometry.getCoordinates()[0][0]).to.deep.equal([0, 0]);
    expect(geometry.getCoordinates()[0][1]).to.deep.equal([0, 2]);
    expect(geometry.getCoordinates()[0][2]).to.deep.equal([1, 2]);
    expect(geometry.getCoordinates()[0][3]).to.deep.equal([1, 0]);
    expect(geometry.getCoordinates()[0][4]).to.deep.equal([0, 0]);
  });
});
