import sinon from "sinon/pkg/sinon-esm";
import {expect} from 'chai';

describe('map action', function() {
	function createFakeInteraction() {
		const active = true;
		return {
			getActive: function() {
				return active;
			},
			setActive: function(_active) {
				active = _active;
			}
		}
	}
	
	it('kan een interactie toevoegen die niet actief staat', function() {
		const mapAction = new MapAction([createFakeInteraction(), createFakeInteraction()]);
		const extraInteractie = createFakeInteraction();
		
		mapAction.addInteraction(extraInteractie);
		
		expect(mapAction.interactions.length).to.equal(3);
		expect(extraInteractie.getActive()).to.be.false;
	});
	
	it('zet alle interacties default op inactief', function() {
		const mapAction = new MapAction([createFakeInteraction(), createFakeInteraction()]);
		
		mapAction.interactions.forEach(function(interaction) {
			expect(interaction.getActive()).to.be.false;
		});
	});
	
	it('kan de interacties actief zetten', function() {
		const mapAction = new MapAction([createFakeInteraction(), createFakeInteraction()]);
		
		mapAction.activate();
		
		mapAction.interactions.forEach(function(interaction) {
			expect(interaction.getActive()).to.be.true;
		});
	});
	
	it('kan de interacties terug deactief zetten', function() {
		const mapAction = new MapAction([createFakeInteraction(), createFakeInteraction()]);
		
		mapAction.activate();
		mapAction.deactivate();
		
		mapAction.interactions.forEach(function(interaction) {
			expect(interaction.getActive()).to.be.false;
		});
	});
});