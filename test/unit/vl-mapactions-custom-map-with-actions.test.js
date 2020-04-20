import {Vector, Tile, Group} from "ol/src/ol/layer";
import {CustomMap} from "../../src/vl-mapactions-custom-map";
import Projection from "ol/src/ol/proj/Projection";
import sinon from "sinon/pkg/sinon-esm";
import {expect} from 'chai';

describe('custom map with actions', function () {
    function createCustomMapWithActions() {
        const layers = [new Tile({
            type: 'base',
            visible: true
        }), new Tile({
            type: 'base',
            visible: false
        })];
        const overviewMapLayers = [new Tile({
            type: 'base',
            visible: false
        }), new Tile({
            type: 'base',
            visible: true
        })];
        const map = new CustomMap({
            actions: [],
            customLayers: {
                baseLayerGroup: new Group({
                    layers: layers
                }),
                overviewMapLayers: overviewMapLayers,
                overlayGroup: new Group({
                    layers: [new Vector({source: new Vector()})]
                })
            },
            projection: new Projection({
                code: 'EPSG:31370',
                extent: [9928.000000, 66928.000000, 272072.000000, 329072.000000]
            })
        });
        map.addControl = sinon.spy();
        map.getSize = function () {
            return [1200, 800];
        };
        return map;
    }

    it('bij het initialiseren van de view, wordt ook de over view map control toegevoegd', function () {
        const map = createCustomMapWithActions();
        expect(map.getView().getZoom()).to.be.undefined;

        map.initializeView();

        expect(map.addControl.calledWith(map.overviewMapControl)).to.be.true;
    });

    it('kan met een view geïnitialiseerd worden met als default zoom niveau 2', function () {
        const map = createCustomMapWithActions();
        expect(map.getView().getZoom()).to.be.undefined;

        map.initializeView();

        expect(map.getView().getZoom()).to.equal(2);
    });

    it('kan met een view geïnitialiseerd worden op een specifieke bounding box, zodat er sterk is ingezoomd (hoge zoom waarde)', function () {
        const map = createCustomMapWithActions();

        map.initializeView([9929.000000, 66929.000000, 9930.000000, 66930.000000]);

        expect(map.getView().getZoom()).to.equal(16);
    });

    it('kan met een view geïnitialiseerd worden op een kleine bounding box en een max zoom niveau, zodat het max niveau bereikt is', function () {
        const map = createCustomMapWithActions();

        map.initializeView([9928.000000, 66928.000000, 9930.000000, 66930.000000], 4);

        expect(map.getView().getZoom()).to.equal(4);
    });

    it('als de baselayer getoggled wordt van een map, zal dit ook gebeuren bij de overview map', function () {
        const map = createCustomMapWithActions();
        map.initializeView();
        expect(map.overviewMapLayers[0].getVisible()).to.be.false;
        expect(map.overviewMapLayers[1].getVisible()).to.be.true;
        expect(map.baseLayers[0].getVisible()).to.be.true;
        expect(map.baseLayers[1].getVisible()).to.be.false;

        map.custom.toggleBaseLayer();

        expect(map.overviewMapLayers[0].getVisible()).to.be.true;
        expect(map.overviewMapLayers[1].getVisible()).to.be.false;
        expect(map.baseLayers[0].getVisible()).to.be.false;
        expect(map.baseLayers[1].getVisible()).to.be.true;

        map.custom.toggleBaseLayer();

        expect(map.overviewMapLayers[0].getVisible()).to.be.false;
        expect(map.overviewMapLayers[1].getVisible()).to.be.true;
        expect(map.baseLayers[0].getVisible()).to.be.true;
        expect(map.baseLayers[1].getVisible()).to.be.false;
    });

});