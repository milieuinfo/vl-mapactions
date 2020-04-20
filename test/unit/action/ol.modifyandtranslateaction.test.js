import sinon from "sinon/pkg/sinon-esm";
import {expect} from 'chai';

describe('modify and translate action', function() {
	const fakeInteraction = getFakeInteraction();
	const source = new SourceVector({});
	const layer = createLayer(source);
	const callback = jasmine.createSpy('callback functie');
	const filter = function(feature) {};
	
	it('roept de callback functie op nadat er een translate werd uitgevoerd en cleart ook de selectie interactie', function() {
		const callback = jasmine.createSpy('callback functie');
		const modifyAndTranslateAction = new ModifyAndTranslateAction({}, callback);
		const feature = new Feature({geometry: new Point([0, 0])});
		modifyAndTranslateAction.selectInteraction.getFeatures().push(feature);
		
		modifyAndTranslateAction.translateInteraction.dispatchEvent({type: 'translateend', features: [feature]});
		
		expect(callback).toHaveBeenCalledWith(feature, jasmine.any(Function));
		expect(modifyAndTranslateAction.selectInteraction.getFeatures().getLength()).to.equal(0);
	});
	
	it('kan snapping aanzetten via opties door de modify action correct aan te roepen', function() {
		sinon.stub(acd.ol.action, 'ModifyAction').and.callThrough();
		
		const options = {
			snapping: true
		};
		
		const drawAction = new ModifyAndTranslateAction(layer, callback, options);
		expect(ModifyAction.called).to.be.true;
		expect(ModifyAction.calls.argsFor(0)).toContain(options);
	});
});