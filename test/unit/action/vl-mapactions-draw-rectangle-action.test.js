import sinon from "sinon/pkg/sinon-esm";
import {expect} from 'chai';
import {Vector as SourceVector} from "ol/src/ol/source";
import {DrawRectangleAction} from "../../../src/action/vl-mapactions-draw-rectangle-action";

describe('draw rectangle action', function () {

    const source = new SourceVector({});

    const layer = {
        getSource: function () {
            return source;
        }
    };

    const callback = sinon.spy();

    it('geeft de snapping configuratie door aan de draw action', function () {
        const snapping = {
            layer: {}
        };

        const action = new DrawRectangleAction(layer, callback, snapping);
        expect(action.drawRectangleOptions).to.deep.equal(snapping);
    });

    it('geeft de juiste configuratie mee aan de draw interaction', function () {
        // sinon.stub(ol.interaction, 'Draw').callsFake(function () {
        //     return {
        //         setActive: function () {
        //         },
        //         on: function () {
        //         }
        //     };
        // });

        const drawAction = new DrawRectangleAction(layer, callback);
        expect(Draw.called).to.be.true;
        expect(Draw.calls.argsFor(0)[0].maxPoints).to.equal(2);
        expect(Draw.calls.argsFor(0)[0].type).to.equal('LineString');
        expect(Draw.calls.argsFor(0)[0].source).to.equal(source);

        const geometryFunction = Draw.calls.argsFor(0)[0].geometryFunction;

        const geometry = geometryFunction([[0, 0], [1, 2]], null);
        expect(geometry.getCoordinates()[0][0]).to.equal([0, 0]);
        expect(geometry.getCoordinates()[0][1]).to.equal([0, 2]);
        expect(geometry.getCoordinates()[0][2]).to.equal([1, 2]);
        expect(geometry.getCoordinates()[0][3]).to.equal([1, 0]);
        expect(geometry.getCoordinates()[0][4]).to.equal([0, 0]);
    });


});