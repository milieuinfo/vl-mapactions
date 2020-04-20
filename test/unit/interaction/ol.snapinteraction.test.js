describe('snapinteraction interaction', function() {

	const source = new ol.source.Vector({});
	const layer = createLayer(source);

	it('bij het aanmaken van een acd snap interactie zal de openlayers snap interactie constructor correct opgeroepen worden', function() {
		sinon.stub(ol.interaction, 'Snap').and.callThrough();
		const snapInteraction = new acd.ol.interaction.SnapInteraction(layer);
		expect(ol.interaction.Snap).toHaveBeenCalledWith(jasmine.objectContaining({
			source: source,
			pixelTolerance: jasmine.any(Number)
		}));
	});
	
});