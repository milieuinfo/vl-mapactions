import {Vector, Tile, Group} from 'ol/src/ol/layer';
import {Vector as SourceVector} from 'ol/src/ol/source';
import Projection from 'ol/src/ol/proj/Projection';
import {CustomMap} from '../../src/vl-mapactions-custom-map';
import sinon from 'sinon/pkg/sinon-esm';
import {expect} from 'chai';

describe('custom map', function() {
  let map;

  const layers = [new Tile({
    type: 'base',
    visible: true,
  }), new Tile({
    type: 'base',
    visible: false,
  })];

  const overviewMapLayers = [new Tile({
    type: 'base',
    visible: false,
  }), new Tile({
    type: 'base',
    visible: true,
  })];

  const overlayLayer = new Vector({source: new SourceVector()});

  function merge(a, b) {
    for (const element in b) {
      a[element] = b[element];
    }
  }

  function createMap(options) {
    const defaultOptions = {
      actions: [],
      customLayers: {
        baseLayerGroup: new Group({
          layers: layers,
        }),
        overviewMapLayers: overviewMapLayers,
        overlayGroup: new Group({
          layers: [overlayLayer],
        }),
      },
      projection: new Projection({
        code: 'EPSG:31370',
        extent: [9928.000000, 66928.000000, 272072.000000, 329072.000000],
      }),
    };

    if (options) {
      merge(defaultOptions, options);
    }

    const map = new CustomMap(defaultOptions);
    map.addControl = sinon.spy();
    map.getSize = function() {
      return [1200, 800];
    };
    return map;
  }

  function createMapZonderLayers() {
    const defaultOptions = {
      actions: [],
      customLayers: {
        baseLayerGroup: new Group({
          layers: [],
        }),
        overviewMapLayers: [],
        overlayGroup: new Group({
          layers: [],
        }),
      },
      projection: new Projection({
        code: 'EPSG:31370',
        extent: [9928.000000, 66928.000000, 272072.000000, 329072.000000],
      }),
    };

    const map = new CustomMap(defaultOptions);
    map.addControl = sinon.spy();
    return map;
  }

  function createBaseLayer(title, visibility) {
    return new Tile({
      title: title,
      type: 'base',
      visible: visibility,
    });
  }

  function createVisibleBaseLayer(title) {
    return createBaseLayer(title, true);

  }

  function createInvisibleBaseLayer(title) {
    return createBaseLayer(title, false);
  }

  beforeEach(function() {
    map = createMap();
  });

  it('kan de base layers teruggeven', function() {
    expect(map.getBaseLayers().length).to.equal(2);
    expect(map.getBaseLayers()).to.deep.equal(layers);
  });

  it('kan de overlay layers teruggeven', function() {
    expect(map.getOverlayLayers().length).to.equal(1);
  });

  it('kan zoomen naar een puntgeometrie, zodat er sterk is ingezoomd (hoge zoom waarde)', function() {
    map.initializeView();
    expect(map.getView().getZoom()).to.equal(2);

    map.zoomToGeometry({
      type: 'Point',
      coordinates: [100000, 100000],
    });

    expect(map.getView().getZoom()).to.equal(16);
  });

  it('kan zoomen naar een geometrie tot maximaal aan het gedefinieerde zoom niveau via de map declaratie optie of de methode argumenten', function() {
    const max = 10;

    map.zoomToGeometry({type: 'Point', coordinates: [100000, 100000]});
    expect(map.getView().getZoom()).to.equal(16);

    map.zoomToGeometry({type: 'Point', coordinates: [100000, 100000]}, 10);
    expect(map.getView().getZoom()).to.equal(10);

    map = createMap({maxZoomViewToExtent: 5});
    map.zoomToGeometry({type: 'Point', coordinates: [100000, 100000]}, 10);
    expect(map.getView().getZoom()).to.equal(10);

    map = createMap({maxZoomViewToExtent: 5});
    map.zoomToGeometry({type: 'Point', coordinates: [100000, 100000]});
    expect(map.getView().getZoom()).to.equal(5);
  });

  it('kan met de show info functie een popover tonen op de kaart', function() {
    map.showInfo('Test', [0, 0]);
    const overlays = map.getOverlays();
    const array = overlays.getArray();

    expect(overlays.getLength()).to.equal(1);
    expect(array.length).to.equal(1);

    const overlay = array[0];
    const element = '<div class="info-tooltip"><span class="content">Test</span><div class="arrow"></div><div class="close"></div></div>';
    expect(overlay.getElement().outerHTML).to.equal(element);
  });

  it('als de overview map control gekend is zal die toegevoegd worden aan de map bij het initializeren', function() {
    map = createMap();

    map.initializeView();

    expect(map.addControl.called).to.be.true;
  });

  it('als de overview map control niet gekend is zal die ook niet toegevoegd worden aan de map bij het initializeren', function() {
    map = createMap();
    map.overviewMapControl = undefined;

    map.initializeView();

    expect(map.addControl.called).to.be.false;
  });


  it('Als er geen overviewMapLayers zijn, zal er geen overviewMapControl aangemaakt worden.', function() {
    const map = createMapZonderLayers();
    map.initializeView();
    expect(map.overviewMapControl).to.be.undefined;
  });


  it('Wanneer de eerse overviewMapLayer wordt toegevoegd, wordt een overviewMapControl aangemaakt.', function() {
    const map = createMapZonderLayers();
    map.initializeView();
    const baseLayer = createVisibleBaseLayer('layer');
    const overviewMapLayer = createInvisibleBaseLayer('overview map layer');

    expect(map.overviewMapControl).to.be.undefined;
    map.addBaseLayerAndOverlayMapLayer(baseLayer, overviewMapLayer);
    expect(map.overviewMapControl).to.not.be.undefined;
    expect(map.getBaseLayers().length).to.equal(1);
    expect(map.getBaseLayers()[0]).to.equal(baseLayer);
    expect(map.overviewMapControl.getOverviewMap().getLayers().getArray().length).to.equal(1);
    expect(map.overviewMapControl.getOverviewMap().getLayers().getArray()[0]).to.equal(overviewMapLayer);
  });


  it('Er kunnen meerdere base layers en overlayMapLayers toegevoegd worden aan de map ', function() {
    map = createMapZonderLayers();
    map.initializeView();

    const baseLayer = createVisibleBaseLayer('layer');
    const overviewMapLayer = createInvisibleBaseLayer('overview map layer');

    expect(map.overviewMapControl).to.be.undefined;
    map.addBaseLayerAndOverlayMapLayer(baseLayer, overviewMapLayer);
    map.addBaseLayerAndOverlayMapLayer(baseLayer, overviewMapLayer);

    expect(map.getBaseLayers().length).to.equal(2);
    expect(map.getBaseLayers()[0]).to.equal(baseLayer);
    expect(map.getBaseLayers()[1]).to.equal(baseLayer);
    expect(map.overviewMapControl.getOverviewMap().getLayers().getArray().length).to.equal(2);
    expect(map.overviewMapControl.getOverviewMap().getLayers().getArray()[0]).to.equal(overviewMapLayer);
    expect(map.overviewMapControl.getOverviewMap().getLayers().getArray()[1]).to.equal(overviewMapLayer);
  });


  it('Enkel de eerste toegevoegde baselayer is visible en enkel de 2e toegevoegde overlaymaplayer is visible', function() {
    map = createMapZonderLayers();
    map.initializeView();

    for (let layerNr = 0; layerNr < 3; layerNr++) {
      map.addBaseLayerAndOverlayMapLayer(createInvisibleBaseLayer('layer ' + layerNr),
        createInvisibleBaseLayer('overview map layer ' + layerNr));
    }

    expect(map.getBaseLayers()[0].getVisible()).to.be.true;
    expect(map.getBaseLayers()[1].getVisible()).to.be.false;
    expect(map.getBaseLayers()[2].getVisible()).to.be.false;

    expect(map.overviewMapControl.getOverviewMap().getLayers().getArray()[0].getVisible()).to.be.false;
    expect(map.overviewMapControl.getOverviewMap().getLayers().getArray()[1].getVisible()).to.be.true;
    expect(map.overviewMapControl.getOverviewMap().getLayers().getArray()[2].getVisible()).to.be.false;
  });

  it('Na een klik is de volgende toegevoegde baselayer visible', function() {
    map = createMapZonderLayers();
    map.initializeView();

    for (let layerNr = 0; layerNr < 3; layerNr++) {
      map.addBaseLayerAndOverlayMapLayer(createInvisibleBaseLayer('layer ' + layerNr),
        createInvisibleBaseLayer('overview map layer ' + layerNr));
    }

    const overlayElement = map.overviewMapControl.element;
    const overviewMap = map.overviewMapControl.getOverviewMap();

    sinon.stub(map, 'render');
    sinon.stub(overviewMap, 'render');

    overlayElement.click();
    expect(map.getBaseLayers()[0].getVisible()).to.be.false;
    expect(map.getBaseLayers()[1].getVisible()).to.be.true;
    expect(map.getBaseLayers()[2].getVisible()).to.be.false;
    expect(map.overviewMapControl.getOverviewMap().getLayers().getArray()[0].getVisible()).to.be.false;
    expect(map.overviewMapControl.getOverviewMap().getLayers().getArray()[1].getVisible()).to.be.false;
    expect(map.overviewMapControl.getOverviewMap().getLayers().getArray()[2].getVisible()).to.be.true;
    expect(map.render.called).to.be.true;
    expect(overviewMap.render.called).to.be.true;

    map.render.resetHistory();
    overviewMap.render.resetHistory();
    overlayElement.click();
    expect(map.getBaseLayers()[0].getVisible()).to.be.false;
    expect(map.getBaseLayers()[1].getVisible()).to.be.false;
    expect(map.getBaseLayers()[2].getVisible()).to.be.true;
    expect(map.overviewMapControl.getOverviewMap().getLayers().getArray()[0].getVisible()).to.be.true;
    expect(map.overviewMapControl.getOverviewMap().getLayers().getArray()[1].getVisible()).to.be.false;
    expect(map.overviewMapControl.getOverviewMap().getLayers().getArray()[2].getVisible()).to.be.false;
    expect(map.render.called).to.be.true;
    expect(overviewMap.render.called).to.be.true;

    map.render.resetHistory();
    overviewMap.render.resetHistory();
    overlayElement.click();
    expect(map.getBaseLayers()[0].getVisible()).to.be.true;
    expect(map.getBaseLayers()[1].getVisible()).to.be.false;
    expect(map.getBaseLayers()[2].getVisible()).to.be.false;
    expect(map.overviewMapControl.getOverviewMap().getLayers().getArray()[0].getVisible()).to.be.false;
    expect(map.overviewMapControl.getOverviewMap().getLayers().getArray()[1].getVisible()).to.be.true;
    expect(map.overviewMapControl.getOverviewMap().getLayers().getArray()[2].getVisible()).to.be.false;
    expect(map.render.called).to.be.true;
    expect(overviewMap.render.called).to.be.true;
  });

});
