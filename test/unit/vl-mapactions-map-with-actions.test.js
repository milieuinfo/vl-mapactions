import {MapWithActions} from '../../src/vl-mapactions-map-with-actions';
import {MapAction} from '../../src/action/vl-mapactions-mapaction';
import sinon from 'sinon/pkg/sinon-esm';
import {expect} from 'chai';
import DragRotate from 'ol/src/ol/interaction/DragRotate';
import DoubleClickZoom from 'ol/src/ol/interaction/DoubleClickZoom';
import KeyboardPan from 'ol/src/ol/interaction/KeyboardPan';
import KeyboardZoom from 'ol/src/ol/interaction/KeyboardZoom';
import MouseWheelZoom from 'ol/src/ol/interaction/MouseWheelZoom';
import PinchZoom from 'ol/src/ol/interaction/PinchZoom';
import PinchRotate from 'ol/src/ol/interaction/PinchRotate';
import DragPan from 'ol/src/ol/interaction/DragPan';
import DragZoom from 'ol/src/ol/interaction/DragZoom';
import Collection from 'ol/src/ol/Collection';
import Interaction from 'ol/src/ol/interaction/Interaction';

describe('map with actions', function() {
  let action1, action2;

  function createMapWithActions() {
    return new MapWithActions({
      actions: [
        action1 = new MapAction([new Interaction({}), new Interaction({})]),
        action2 = new MapAction([new Interaction({}), new Interaction({}), new Interaction({})]),
      ],
    });
  }

  function afterActivation(callback, done) {
    setTimeout(function() {
      callback();
      done();
    }, MapWithActions.CLICK_COUNT_TIMEOUT);
  }

  it('voegt de interacties van alle actie toe aan de kaart', function() {
    const map = createMapWithActions();

    expect(map.getInteractions().getLength()).to.equal(14); // 9 standaard + 5
  });

  it('kan maar één actie tegelijkertijd activeren, waarbij enkel deze actie zijn interacties op actief staan', function(done) {
    const map = createMapWithActions();
    map.activateAction(action1);
    afterActivation(function() {
      expect(map.currentAction).to.equal(action1);
    }, () => {
      map.activateAction(action2);
      expect(map.currentAction).to.equal(action2);
      action1.interactions.forEach(function(interaction) {
        expect(interaction.getActive()).to.be.false;
      });
      afterActivation(function() {
        action2.interactions.forEach(function(interaction) {
          expect(interaction.getActive()).to.be.true;
        });
      }, done);
    });

  });

  it('heeft als default actie de eerste actie', function(done) {
    const map = createMapWithActions();

    setTimeout(() => {
      expect(map.currentAction).to.equal(action1);
      done();
    });
  });

  it('kan een nieuwe actie toevoegen aan de map', function(done) {
    const map = createMapWithActions();
    expect(map.actions.length).to.equal(2);
    expect(map.getInteractions().getLength()).to.equal(14);
    setTimeout(() => {
      expect(map.currentAction).to.equal(action1);

      const nieuweAction = new MapAction([new Interaction({}), new Interaction({})]);
      map.addAction(nieuweAction);

      expect(map.actions.length).to.equal(3);
      expect(map.actions[2]).to.equal(nieuweAction);
      expect(map.getInteractions().getLength()).to.equal(16);
      expect(map.currentAction).to.equal(action1);
      done();
    });
  });

  it('kan een actie verwijderen van de map', function(done) {
    const map = createMapWithActions();
    setTimeout(() => {
      const nieuweAction = new MapAction([new Interaction({}), new Interaction({})]);
      map.addAction(nieuweAction);

      map.removeAction(nieuweAction);
      expect(map.actions.length).to.equal(2);
      expect(map.actions.indexOf(nieuweAction)).to.equal(-1);
      expect(map.getInteractions().getLength()).to.equal(14);
      expect(map.currentAction).to.equal(action1);
      done();
    });
  });

  it('als de te verwijderen actie de current actie wordt de default geactiveerd', function(done) {
    const map = createMapWithActions();
    setTimeout(() => {
      const nieuweAction = new MapAction([new Interaction({}), new Interaction({})]);
      map.addAction(nieuweAction);

      map.activateAction(nieuweAction);
      expect(map.currentAction).to.equal(nieuweAction);
      map.removeAction(nieuweAction);
      expect(map.currentAction).to.equal(map.actions[0]);
      done();
    });
  });

  it('bij het activeren van een actie, zullen we eerst controleren of deze actie al niet actief stond vooraleer we de vorige actie gaan deactiveren en de nieuwe actie gaan activeren', function(done) {
    const map = createMapWithActions();
    setTimeout(() => {
      sinon.spy(action1, 'activate');
      sinon.spy(action1, 'deactivate');
      sinon.spy(action2, 'activate');
      sinon.spy(action2, 'deactivate');

      map.activateAction(action1);

      map.activateAction(action1);
      map.activateAction(action2);
      afterActivation(function() {
        expect(action1.activate.called).to.be.false;
        expect(action2.activate.called).to.be.true;
        expect(action1.deactivate.called).to.be.true;
      }, done);
    });
  });

  it('Wanneer de default actie wordt geactiveerd, zal de huidige actie gedeactiveerd worden en is de nieuwe default actie de eerst gedefinieerde actie', function(done) {
    const map = createMapWithActions();

    map.activateAction(action2);
    expect(map.currentAction).to.equal(action2);

    sinon.stub(action1, 'activate');
    sinon.stub(action2, 'activate');
    sinon.stub(action2, 'deactivate');


    map.activateDefaultAction();

    afterActivation(function() {
      expect(action2.deactivate.called).to.be.true;
      expect(action1.activate.called).to.be.true;
    }, done);
  });

  it('Wanneer de default actie wordt geactiveerd, zal de huidige actie gedeactiveerd worden en is de nieuwe default actie de eerst gedefinieerde actie, ook als de huidige actie de eerst gedefinieerde is', function(done) {
    const map = createMapWithActions();

    map.activateAction(action1);
    expect(map.currentAction).to.equal(action1);

    sinon.stub(action1, 'activate');
    sinon.stub(action1, 'deactivate');

    map.activateDefaultAction();

    afterActivation(function() {
      expect(action1.deactivate.called).to.be.true;
      expect(action1.activate.called).to.be.true;
    }, done);
  });

  it('bij het aanmaken van een kaart met acties wordt standaard functionaliteit toegevoegd aan de kaart dat bij escape de eerste kaart actie geactiveerd wordt', function(done) {
    const map = new MapWithActions({
      actions: [],
    });
    sinon.spy(map, 'activateDefaultAction');
    expect(map.activateDefaultAction.called).to.be.false;
    const event = new Event('keydown');
    event.keyCode = 27;
    document.body.dispatchEvent(event);
    setTimeout(() => {
      expect(map.activateDefaultAction.called).to.be.true;
      done();
    });
  });

  it('indien gewenst kan de standaard escape functionaliteit uitgeschakeld worden bij het aanmaken van een kaart met acties', function() {
    const map = new MapWithActions({
      actions: [],
      disableEscapeKey: true,
    });
    sinon.stub(map, 'activateDefaultAction');
    expect(map.activateDefaultAction.called).to.be.false;
    const event = new Event('keydown');
    event.keyCode = 27;
    document.body.dispatchEvent(event);
    expect(map.activateDefaultAction.called).to.be.false;
  });

  it('er zijn 9 predefined interactions', function() {
    const map = new MapWithActions({
      actions: [],
    });

    expect(map.getInteractions().getLength()).to.equal(9);//Standaard zijn er 9 interactions
    expect(map.getInteractions().getArray().filter(function(interaction) {
      return interaction instanceof DragRotate;
    }).length).to.equal(1);
    expect(map.getInteractions().getArray().filter(function(interaction) {
      return interaction instanceof DoubleClickZoom;
    }).length).to.equal(1);
    expect(map.getInteractions().getArray().filter(function(interaction) {
      return interaction instanceof KeyboardPan;
    }).length).to.equal(1);
    expect(map.getInteractions().getArray().filter(function(interaction) {
      return interaction instanceof KeyboardZoom;
    }).length).to.equal(1);
    expect(map.getInteractions().getArray().filter(function(interaction) {
      return interaction instanceof MouseWheelZoom;
    }).length).to.equal(1);
    expect(map.getInteractions().getArray().filter(function(interaction) {
      return interaction instanceof PinchZoom;
    }).length).to.equal(1);
    expect(map.getInteractions().getArray().filter(function(interaction) {
      return interaction instanceof PinchRotate;
    }).length).to.equal(1);
    expect(map.getInteractions().getArray().filter(function(interaction) {
      return interaction instanceof DragPan;
    }).length).to.equal(1);
    expect(map.getInteractions().getArray().filter(function(interaction) {
      return interaction instanceof DragZoom;
    }).length).to.equal(1);
  });

  it('indien gewenst kan de standaard rotation functionaliteit uitgeschaked worden bij het aanmaken van een kaart met acties', function() {
    const map = new MapWithActions({
      actions: [],
      disableRotation: true,
    });

    expect(map.getInteractions().getLength()).to.equal(7);//9-2=7
    expect(map.getInteractions().getArray().filter(function(interaction) {
      return interaction instanceof DoubleClickZoom;
    }).length).to.equal(1);
    expect(map.getInteractions().getArray().filter(function(interaction) {
      return interaction instanceof KeyboardPan;
    }).length).to.equal(1);
    expect(map.getInteractions().getArray().filter(function(interaction) {
      return interaction instanceof KeyboardZoom;
    }).length).to.equal(1);
    expect(map.getInteractions().getArray().filter(function(interaction) {
      return interaction instanceof MouseWheelZoom;
    }).length).to.equal(1);
    expect(map.getInteractions().getArray().filter(function(interaction) {
      return interaction instanceof PinchZoom;
    }).length).to.equal(1);
    expect(map.getInteractions().getArray().filter(function(interaction) {
      return interaction instanceof DragPan;
    }).length).to.equal(1);
    expect(map.getInteractions().getArray().filter(function(interaction) {
      return interaction instanceof DragZoom;
    }).length).to.equal(1);
    expect(map.getInteractions().getArray().filter(function(interaction) {
      return interaction instanceof DragRotate;
    }).length).to.equal(0);
    expect(map.getInteractions().getArray().filter(function(interaction) {
      return interaction instanceof PinchRotate;
    }).length).to.equal(0);
  });

  it('indien gewenst kan de extra interactions toegevoegd worden bij het aanmaken van een kaart met acties', function() {
    const map = new MapWithActions({
      actions: [],
      interactions: new Collection([new PinchZoom(), new PinchRotate()]),
      disableRotation: true,
    });

    expect(map.getInteractions().getLength()).to.equal(9);//9-2+2=9
  });

  it('indien gewenst kan het zoomen met de mouse wheel afgezet worden', function() {
    const map = new MapWithActions({
      actions: [],
      disableMouseWheelZoom: true,
    });
    expect(map.getInteractions().getLength()).to.equal(8);
    expect(map.getInteractions().getArray().filter(function(interaction) {
      return interaction instanceof DragRotate;
    }).length).to.equal(1);
    expect(map.getInteractions().getArray().filter(function(interaction) {
      return interaction instanceof DoubleClickZoom;
    }).length).to.equal(1);
    expect(map.getInteractions().getArray().filter(function(interaction) {
      return interaction instanceof KeyboardPan;
    }).length).to.equal(1);
    expect(map.getInteractions().getArray().filter(function(interaction) {
      return interaction instanceof KeyboardZoom;
    }).length).to.equal(1);
    expect(map.getInteractions().getArray().filter(function(interaction) {
      return interaction instanceof MouseWheelZoom;
    }).length).to.equal(0);
    expect(map.getInteractions().getArray().filter(function(interaction) {
      return interaction instanceof PinchZoom;
    }).length).to.equal(1);
    expect(map.getInteractions().getArray().filter(function(interaction) {
      return interaction instanceof PinchRotate;
    }).length).to.equal(1);
    expect(map.getInteractions().getArray().filter(function(interaction) {
      return interaction instanceof DragPan;
    }).length).to.equal(1);
    expect(map.getInteractions().getArray().filter(function(interaction) {
      return interaction instanceof DragZoom;
    }).length).to.equal(1);
  });
});
