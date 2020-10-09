import {expect} from 'chai';
import Interaction from 'ol/interaction/Interaction';
import {MapAction} from '../../src/vl-mapactions-mapaction';

describe('map action', () => {
  it('kan een interactie toevoegen die niet actief staat', () => {
    const mapAction = new MapAction([new Interaction({}), new Interaction({})]);
    const extraInteractie = new Interaction({});
    mapAction.addInteraction(extraInteractie);
    expect(mapAction.interactions.length).to.equal(3);
    expect(extraInteractie.getActive()).to.be.false;
  });

  it('zet alle interacties default op inactief', () => {
    const mapAction = new MapAction([new Interaction({}), new Interaction({})]);
    mapAction.interactions.forEach((interaction) => expect(interaction.getActive()).to.be.false);
  });

  it('kan de interacties actief zetten', () => {
    const mapAction = new MapAction([new Interaction({}), new Interaction({})]);
    mapAction.activate();
    mapAction.interactions.forEach((interaction) => expect(interaction.getActive()).to.be.true);
  });

  it('kan de interacties terug deactief zetten', () => {
    const mapAction = new MapAction([new Interaction({}), new Interaction({})]);
    mapAction.deactivate();
    mapAction.interactions.forEach((interaction) => expect(interaction.getActive()).to.be.false);
  });
});
