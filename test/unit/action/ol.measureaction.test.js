import sinon from "sinon/pkg/sinon-esm";
import {expect} from 'chai';

'use strict';

describe('measure action', function() {
	const measureAction, layer,  addOverlay, removeOverlay, unByKey, handler, moveMouse, source;
	
	beforeEach(function setUp() {
		source = new SourceVector({features: []});
		layer = new Vector({source: source});
		
		measureAction = new MeasureAction(layer);
		addOverlay = jasmine.createSpy('addOverlay');
		removeOverlay = jasmine.createSpy('removeOverlay');
		unByKey = jasmine.createSpy('unByKey');
		ol.Observable.unByKey = unByKey;
		handler = 'handler';
		measureAction.map = {
			addOverlay: addOverlay,
			removeOverlay: removeOverlay,
			on: function(type, callback) {
				moveMouse = callback;
				return handler;
			}
		};
	});
	
	it('geeft de snapping configuratie door aan de draw action', function() {
		sinon.stub(acd.ol.action, 'DrawAction').and.callThrough();
		
		const snapping = {
			layer: {}
		};
		
		const drawAction = new MeasureAction(layer, snapping);
		expect(DrawAction.called).to.be.true;
		expect(DrawAction.calls.argsFor(0)).toContain(snapping);
	});
	
	it('Als het tekenen gestart en er met de muis verschoven wordt zal er een tooltip verschijnen', function() {
		const sketchFeature = new Feature({geometry: new LineString([[0, 0], [1, 1]])});
		
		measureAction.drawInteraction.dispatchEvent({type: 'drawstart', feature: sketchFeature});
		
		expect(addOverlay.called).to.be.true;
	});
	
	it('bij het deactiveren worden de tooltips niet verwijderd, maar de listeners wel verwijderd', function() {
		const sketchFeature = new Feature({geometry: new LineString([[0, 0], [1, 1]])});
		measureAction.drawInteraction.dispatchEvent({type: 'drawstart', feature: sketchFeature});
		measureAction.drawInteraction.dispatchEvent({type: 'drawend', feature: sketchFeature});
		source.addFeature(sketchFeature);
		measureAction.deactivate();
		
		expect(unByKey).toHaveBeenCalledWith(handler);
		expect(removeOverlay.called).to.be.false;
	});

	it('bij het deactiveren worden de tooltips van features die nog niet volledig getekend waren wel van de kaart verwijderd', function() {
		const sketchFeature = new Feature({geometry: new LineString([[0, 0], [1, 1]])});
		measureAction.drawInteraction.dispatchEvent({type: 'drawstart', feature: sketchFeature});
		measureAction.drawInteraction.dispatchEvent({type: 'drawend', feature: sketchFeature});
		const tooltip = measureAction.getTooltipFor(sketchFeature.getId());
		
		measureAction.deactivate();
		
		expect(removeOverlay).toHaveBeenCalledWith(tooltip);
	});
	
	it('wanneer een feature wordt verwijderd van de layer zal de bijhorende tooltip ook verwijderd worden', function() {
		const sketchFeature = new Feature({id: 1, geometry: new LineString([[0, 0], [1, 1]])});
		
		measureAction.drawInteraction.dispatchEvent({type: 'drawstart', feature: sketchFeature});
		
		measureAction.drawInteraction.dispatchEvent({type: 'drawend', feature: sketchFeature});
		expect(addOverlay.called).to.be.true;
		
		const tooltip = measureAction.getTooltipFor(sketchFeature.getId());
		expect(tooltip).to.not.be.undefined;
		
		source.dispatchEvent({type: "removefeature", feature: sketchFeature});
		expect(removeOverlay).toHaveBeenCalledWith(tooltip);
	});
	
});