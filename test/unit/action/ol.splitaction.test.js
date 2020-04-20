import sinon from "sinon/pkg/sinon-esm";
import {expect} from 'chai';

describe('split action', function() {
	const mapAddActionSpy = sinon.spy();
	const callbackSpy = sinon.spy();
	const optionsSpy = {
		filter: sinon.spy()
	};
	const feature = new Feature({id: 1});
	
	const layer = {
		getSource: function() {
			return {
				getFeatures: function() {
					return [];
				},
				getFeatureById: function(id) {
					return (id == 1) ? feature : null;
				}
			};
		}
	};
	
	function createSplitAction() {
		const splitAction = new SplitAction(layer, callbackSpy, optionsSpy);
		splitAction.map = {
			addAction: mapAddActionSpy,
			on: sinon.spy(),
			un: sinon.spy()
		};
		return splitAction;
	}
	
	beforeEach(function() {
		jasmine.clock().install();
	});
	
	afterEach(function() {
		jasmine.clock().uninstall();
	});
	
	it('zal bij het activeren een select en draw actie toevoegen aan de map en de select interacties activeren', function() {
		const splitAction = createSplitAction();
		expect(splitAction.interactions).to.equal([]);
		expect(splitAction.selectAction.interactions).not.toEqual([]);
		splitAction.selectAction.interactions.forEach(function(interaction) {
			expect(interaction.getActive()).to.be.false;
		});
		expect(splitAction.drawAction.interactions).not.toEqual([]);
		splitAction.drawAction.interactions.forEach(function(interaction) {
			expect(interaction.getActive()).to.be.false;
		});
		
		expect(mapAddActionSpy.called).to.be.false;
		splitAction.activate();
		expect(mapAddActionSpy.called).to.be.true;
		expect(mapAddActionSpy.calls.count()).to.equal(2);
		expect(mapAddActionSpy.calls.argsFor(0)).to.equal([splitAction.selectAction]);
		expect(mapAddActionSpy.calls.argsFor(1)).to.equal([splitAction.drawAction]);
		expect(splitAction.interactions).to.equal([]);
		splitAction.selectAction.interactions.forEach(function(interaction) {
			expect(interaction.getActive()).to.be.true;
		});
		splitAction.drawAction.interactions.forEach(function(interaction) {
			expect(interaction.getActive()).to.be.false;
		});
	});
	
	it('zal bij het deactiveren zowel de select als draw actie deactiveren', function() {
		const splitAction = createSplitAction();
		const deactivateSpy = sinon.stub(MapAction.prototype.deactivate, 'call');
		splitAction.deactivate();
		expect(deactivateSpy.called).to.be.true;
		expect(deactivateSpy.calls.count()).to.equal(2);
		expect(deactivateSpy.calls.argsFor(0)).to.equal([splitAction.selectAction]);
		expect(deactivateSpy.calls.argsFor(1)).to.equal([splitAction.drawAction]);
	});
	
	it('zal een select action aanmaken met de correcte argumenten', function() {
		const selectActionSpy = sinon.stub(acd.ol.action, 'SelectAction');
		const drawActionSpy = sinon.stub(acd.ol.action, 'DrawAction');
		const splitAction = createSplitAction();
		expect(selectActionSpy).toHaveBeenCalledWith(layer, jasmine.any(Function), optionsSpy);
		expect(drawActionSpy).toHaveBeenCalledWith(layer, 'LineString', jasmine.any(Function), optionsSpy);
	});
	
	it('zal na het selecteren de select action deactiveren en de draw action activeren', function() {
		const splitAction = createSplitAction();
		
		sinon.stub(splitAction.selectAction, 'deactivate');
		sinon.stub(MapAction.prototype.activate, 'call');
		sinon.stub(acd.ol.action, 'SelectAction').and.callThrough();
		splitAction.selectAction.selectInteraction.getFeatures().push(feature);
		splitAction.selectAction.selectInteraction.dispatchEvent({type: 'select'});
		expect(splitAction.selectAction.deactivate.called).to.be.true;
		expect(MapAction.prototype.activate.call).toHaveBeenCalledWith(splitAction.drawAction);
	});
	

	it('zal na het selecteren en tekenen zal de split callback uitgevoerd worden met de geselecteerde feature en de opgsplitste features', function() {
		const splitAction = createSplitAction();
		
		const selectedFeature = {
			getGeometry: function() {
				const multiPolygon = new MultiPolygon([]);
				multiPolygon.appendPolygon(new Polygon([[[0, 0], [0, 10], [10, 10], [0, 0]]]));
				return multiPolygon;
			}
		}
		
		const drawnFeature = {
			getGeometry: function() {
				return new LineString([[0, 5], [10, 5]]);
			}
		};
		
		sinon.stub(acd.ol.action, 'DrawAction').callsFake(function(layer, type, callback) {
			callback();
		});
		
		splitAction.selectAction.selectedFeature = selectedFeature;
		splitAction.drawAction.drawInteraction.dispatchEvent({type: 'drawend', feature: drawnFeature});
		expect(callbackSpy).toHaveBeenCalledWith(selectedFeature, jasmine.any(Object));
		const features = callbackSpy.calls.argsFor(0)[1];
		expect(features.length).to.equal(2);
		expect(features[0].getGeometry().getCoordinates()).to.equal([[[[0, 0], [0, 5], [5, 5], [0, 0]]]]);
		expect(features[1].getGeometry().getCoordinates()).to.equal([[[[0, 5], [0, 10], [10, 10], [5, 5], [0, 5]]]]);
	});

	it('zal na het selecteren en tekenen de laatst geselecteerde feature deselecteren, de map action deactiveren en de select action activeren', function() {
		const splitAction = createSplitAction();
		
		sinon.stub(splitAction.selectAction, 'clearFeatures');
		sinon.stub(splitAction.selectAction, 'activate');
		sinon.stub(splitAction.drawAction, 'deactivate');
		
		const selectedFeature = {
			getGeometry: function() {
				const multiPolygon = new MultiPolygon([]);
				multiPolygon.appendPolygon(new Polygon([[[0, 0], [0, 10], [10, 10], [0, 0]]]));
				return multiPolygon;
			}
		};
		
		const drawnFeature = {
			getGeometry: function() {
				return new LineString([[0, 5], [10, 5]]);
			}
		};
		
		sinon.stub(acd.ol.action, 'DrawAction').callsFake(function(layer, type, callback) {
			callback();
			expect(splitAction.selectAction.clearFeatures.called).to.be.true;
			
			jasmine.clock().tick();
			
			splitAction.selectAction.selectedFeature = selectedFeature;
			splitAction.drawAction.drawInteraction.dispatchEvent({type: 'drawend', feature: drawnFeature});
			expect(splitAction.drawAction.deactivate.called).to.be.true;
			expect(splitAction.selectAction.activate.called).to.be.true;
		});
	});
});