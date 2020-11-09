import sinon from 'sinon/pkg/sinon-esm';
import {expect} from 'chai';
import {Vector as SourceVector} from 'ol/source';
import {VlDrawPolygonAction} from '../../src/vl-mapactions-draw-polygon-action';

describe('draw polygon action', () => {
  const source = new SourceVector({});

  const layer = {
    getSource: () => {
      return source;
    },
  };

  const callback = sinon.spy();

  it('geeft de snapping configuratie door aan de draw action', () => {
    const snappingLayer = sinon.spy();
    const snapping = {
      layer: snappingLayer,
    };
    const action = new VlDrawPolygonAction(layer, callback, snapping);
    expect(action.drawPolygonOptions.layer).to.deep.equal(snappingLayer);
  });

  it('geeft de juiste configuratie mee aan de draw interaction', () => {
    const action = new VlDrawPolygonAction(layer, callback);
    expect(action.drawPolygonOptions.maxPoints).to.equal(2);
    const geometryFunction = action.drawPolygonOptions.geometryFunction;
    const geometry = geometryFunction([[0, 0], [1, 2]], null);
    expect(geometry.getCoordinates()[0][0]).to.deep.equal([0, 0]);
    expect(geometry.getCoordinates()[0][1]).to.deep.equal([0, 2]);
    expect(geometry.getCoordinates()[0][2]).to.deep.equal([1, 2]);
    expect(geometry.getCoordinates()[0][3]).to.deep.equal([1, 0]);
    expect(geometry.getCoordinates()[0][4]).to.deep.equal([0, 0]);
  });
});
