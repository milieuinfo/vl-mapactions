import {defaults} from '../node_modules/ol/src/ol/interaction';
import Map from '../node_modules/ol/src/ol/Map';

export class MapWithActions extends Map {

    static get CLICK_COUNT_TIMEOUT() {
        return 300;
    }

    constructor(options) {

        options = options || {};
        const enableRotation = !options.disableRotation;
        const enableMouseWheelZoom = !options.disableMouseWheelZoom;
        const interactions = defaults({
            altShiftDragRotate: enableRotation,
            pinchRotate: enableRotation,
            mouseWheelZoom: enableMouseWheelZoom
        });
        if (options && options.interactions) {
            options.interactions.forEach(function (interaction) {
                interactions.push(interaction);
            });
        }
        options.interactions = interactions;
        super(options);
        this.actions = [];

        options.actions.forEach((action) => {
            this.addAction(action);
        });

        setTimeout(() => {
            this.activateDefaultAction();
        });

        if (!options.disableEscapeKey) {
            const activateFirstActionOnEscapeKey = function activateFirstActionOnEscapeKey(e) {
                if (e && e.keyCode && e.keyCode == 27) {
                    self.activateDefaultAction();
                }
            };

            document.body.removeEventListener('keydown',
                activateFirstActionOnEscapeKey);
            document.body.addEventListener('keydown', activateFirstActionOnEscapeKey);
        }
    }

    activateAction(action) {
        if (this.currentAction) {
            if (this.currentAction == action) {
                return false;
            }

            this.currentAction.deactivate();
            clearTimeout(this.timeout);
        }

        this.currentAction = action;

        // delay the activation of the action with 300ms because ol has a timeout of 251ms to detect a double click event
        // when we don't use a delay some click and select events of the previous action will be triggered on the new action
        this.timeout = setTimeout(function () {
            action.activate();
        }, MapWithActions.CLICK_COUNT_TIMEOUT);
    }

    addAction(action) {
        this.actions.push(action);
        action.map = this;
        action.interactions.forEach((interaction) => {
            this.addInteraction(interaction);
        });
    }

    removeAction(action) {
        if (this.currentAction == action) {
            this.activateDefaultAction();
        }
        action.interactions.forEach((interaction) => {
            this.removeInteraction(interaction);
        });
        this.actions.splice(this.actions.indexOf(action), 1);
    }

    activateDefaultAction() {
        if (this.actions.length > 0 && this.actions[0]) {
            if (this.currentAction == this.actions[0]) {
                this.currentAction.deactivate();
                this.currentAction = undefined;
            }
            this.activateAction(this.actions[0]);
        }
    }
}