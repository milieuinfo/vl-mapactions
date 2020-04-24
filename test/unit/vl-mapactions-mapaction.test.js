import sinon from 'sinon/pkg/sinon-esm';
import {expect} from 'chai';
import Interaction from 'ol/src/ol/interaction/Interaction';
import {MapAction} from '../../src/vl-mapactions-mapaction';

describe('map action', function() {
  it('kan een interactie toevoegen die niet actief staat', function() {
    const mapAction = new MapAction([new Interaction({}), new Interaction({})]);
    const extraInteractie = new Interaction({});

    mapAction.addInteraction(extraInteractie);

    expect(mapAction.interactions.length).to.equal(3);
    expect(extraInteractie.getActive()).to.be.false;
  });

  it('zet alle interacties default op inactief', function() {
    const mapAction = new MapAction([new Interaction({}), new Interaction({})]);

    mapAction.interactions.forEach(function(interaction) {
      expect(interaction.getActive()).to.be.false;
    });
  });

  it('kan de interacties actief zetten', function() {
    const mapAction = new MapAction([new Interaction({}), new Interaction({})]);

    mapAction.activate();

    mapAction.interactions.forEach(function(interaction) {
      expect(interaction.getActive()).to.be.true;
    });
  });

  it('kan de interacties terug deactief zetten', function() {
    const mapAction = new MapAction([new Interaction({}), new Interaction({})]);

    mapAction.activate();
    mapAction.deactivate();

    mapAction.interactions.forEach(function(interaction) {
      expect(interaction.getActive()).to.be.false;
    });
  });
});
