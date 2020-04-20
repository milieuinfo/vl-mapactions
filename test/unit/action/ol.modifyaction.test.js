import sinon from "sinon/pkg/sinon-esm";
import {expect} from 'chai';

describe('modify action', function() {
	const fakeInteraction = getFakeInteraction();
	const source = new SourceVector();
	const layer = createLayer(source);
	const callback = jasmine.createSpy('callback functie');
	const filter = function(feature) {};
	
	it('roept de callback functie op nadat er een modify werd uitgevoerd', function() {
		const callback = jasmine.createSpy('callback functie');
		const modifyAction = new ModifyAction({}, callback);
		const feature = new Feature({
			geometry: new Point([0, 0])
		});
		
		modifyAction.selectInteraction.getFeatures().push(feature);
		modifyAction.modifyInteraction.dispatchEvent({type: 'modifyend', features: [feature]});
		expect(callback).toHaveBeenCalledWith(feature, jasmine.any(Function));
	});
	
	it('na het deactiveren wordt de selectie verwijderd', function() {
		const modifyAction = new ModifyAction({});
		modifyAction.map = {
			on: sinon.spy(),
			un: sinon.spy()
		};
		const feature = new Feature({
			geometry: new Point([0, 0])
		});

		modifyAction.selectInteraction.getFeatures().push(feature);
		modifyAction.deactivate();
		expect(modifyAction.selectInteraction.getFeatures().getLength()).to.equal(0);
	});
	
	it('de feature filter zal doorgegeven worden aan de select action', function() {
		const spy = sinon.stub(window.SelectAction, 'call').and.callThrough();
		const layers = {};
		const options = {
			filter: filter
		};
		const modifyAction = new ModifyAction(layers, null, options);
		expect(spy).toHaveBeenCalledWith(jasmine.any(Object), layers, null, options);
	});
	
	it('kan snapping aanzetten via opties met als standaard snapping layer de modify action layer', function() {
		const options = {
			filter: filter
		};
		const fakeModifyInteraction = getFakeInteraction();
		const fakeSnapInteraction = getFakeInteraction();
		
		sinon.stub(ol.interaction, 'Modify').and.returnValue(fakeModifyInteraction);
		sinon.stub(acd.ol.interaction, 'SnapInteraction').and.returnValue(fakeSnapInteraction);
		
		const modifyAction = new ModifyAction(layer, callback, options);
		expect(SnapInteraction.called).to.be.false;
		
		SnapInteraction.resetHistory();
		options.snapping = false;
		const modifyAction = new ModifyAction(layer, callback, options);
		expect(SnapInteraction.called).to.be.false;

		SnapInteraction.resetHistory();
		sinon.stub(MapAction.prototype, 'addInteraction').and.callThrough();
		options.snapping = true;
		const modifyAction = new ModifyAction(layer, callback, options);
		expect(SnapInteraction).toHaveBeenCalledWith(layer);

		expect(MapAction.prototype.addInteraction.called).to.be.true;
		expect(MapAction.prototype.addInteraction.calls.argsFor(3)).toContain(fakeModifyInteraction);
		expect(MapAction.prototype.addInteraction.calls.argsFor(4)).toContain(fakeSnapInteraction);

		const otherLayer = createLayer();
		SnapInteraction.resetHistory();
		MapAction.prototype.addInteraction.resetHistory();
		options.snapping = {
			layer: otherLayer
		};
		const modifyAction = new ModifyAction(layer, callback, options);
		expect(MapAction.prototype.addInteraction.called).to.be.true;
		expect(MapAction.prototype.addInteraction.calls.argsFor(3)).toContain(fakeModifyInteraction);
		expect(MapAction.prototype.addInteraction.calls.argsFor(4)).toContain(fakeSnapInteraction);
	});
});