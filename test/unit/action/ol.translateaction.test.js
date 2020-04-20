import sinon from "sinon/pkg/sinon-esm";
import {expect} from 'chai';

describe('translate action', function() {
	it('roept de callback functie op nadat er een translate werd uitgevoerd en cleart ook de selectie interactie', function() {
		const callback = jasmine.createSpy('callback functie');
		const translateAction = new TranslateAction({}, callback);
		const feature = new Feature();
		translateAction.selectInteraction.getFeatures().push(feature);
		
		translateAction.translateInteraction.dispatchEvent({type: 'translateend', features: [feature]});
		
		expect(callback).toHaveBeenCalledWith(feature, jasmine.any(Function));
		expect(translateAction.selectInteraction.getFeatures().getLength()).to.equal(0);
	});
	
	it('na het deactiveren wordt de selectie verwijderd', function() {
		const translateAction = new TranslateAction({});
		const feature = new Feature();
		translateAction.selectInteraction.getFeatures().push(feature);
		
		translateAction.deactivate();
		
		expect(translateAction.selectInteraction.getFeatures().getLength()).to.equal(0);
	});
	
	it('bij de Translate interaction constructor moet ook de laag meegegeven worden zodat na het selecteren steeds de feature op de laag verplaatst zal worden en geen features op een andere laag', function() {
		const layer = {id: 'layer1'};
		
		const constructor = jasmine.createSpy('constructor');
		constructor.setActive = function() {};
		constructor.on = function() {};
		
		const spy = sinon.stub(window.ol.interaction, 'Translate').and.returnValue(constructor);
		new TranslateAction(layer, {});
		
		expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({
			features: jasmine.any(Object),
			layers: [layer]
		}));
	});
});