import {DrawAction} from './vl-mapactions-draw-action';
import {Tooltips} from './vl-mapactions-tooltips';

export class ShowInfoAction extends DrawAction {
  constructor(layer, infoPromise, loadingMessage, tooltipOptions) {

    const tooltips = new Tooltips(layer, infoPromise, loadingMessage);

    super(layer, 'Point', (feature) => {
      this.tooltips.showTooltip(this.map, feature, feature.getGeometry().getCoordinates(), tooltipOptions);
    });

    this.layer = layer;
    this.tooltips = tooltips;
  }

  clear() {
    this.tooltips.clear(this.map);
    this.layer.getSource().clear();
  }

  deactivate() {
    this.clear();
    super.deactivate();
  }
}
