acd.ol.action.SelectAction = function(layer, onSelect, options) {
	var self = this;
	
	this.filter = options && options.filter ? options.filter : function() { return true; };
	this.layer = layer;
	this.style = options ? options.style : null;
	this.hoverStyle = options ? options.hoverStyle || this.style : this.style;
	
	this.selectInteractionFilter = function(feature, layer) {
		self.selectInteraction.getFeatures().clear();
		return self.filter(feature, layer);
	};
	
	this.hoverInteractionFilter = function(feature, layer) {
		return self.filter(feature, layer) && !isSelected(feature);
	};
	
	this.getClusterWithFeatureId = function(clusters, id) {
		for (var i = 0; i < clusters.length; i++) {
			var features = clusters[i].get('features');
			if (features && getFeatureById(features, id)) {
				return clusters[i];
			}
		}
	};
	
	this.hoverInteraction = new ol.interaction.Select({
		filter: this.hoverInteractionFilter,
		condition: ol.events.condition.pointerMove,
		style: this.hoverStyle
	});
	
	this.selectInteraction = new ol.interaction.Select({
		filter: this.selectInteractionFilter,
		style: this.style,
		multi: true
	});
	
	acd.ol.action.MapAction.call(this, [this.selectInteraction, this.hoverInteraction]);
	
	this.hoverInteraction.on('select', function() {
		var element = self.map.getTargetElement();
		if (self.hoverInteraction.getFeatures().getLength() > 0) {
			element.style.cursor = 'pointer';
		} else {
			element.style.cursor = '';
		}
	});
	
	this.selectedFeature = null;
	
	this.getLayer = function(feature) {
		return layer;
	};
	
	this.selectInteraction.on('select', function(event) {
		self.hoverInteraction.getFeatures().clear();
		if (onSelect) {
			if (self.selectInteraction.getFeatures().getLength() > 0) {
				var selectedFeature = null;
				if (self.selectInteraction.getFeatures().getLength() == 1) {
					selectedFeature = self.selectInteraction.getFeatures().getArray()[0];
				} else {
					selectedFeature = nextFeature(self.selectInteraction.getFeatures());
				}
				self.selectedFeature = selectedFeature;
				onSelect(self.selectedFeature, event, self.getLayer(selectedFeature));
			} else {
				this.selectedFeature = null;
				onSelect();
			}
		}
	});
	
	function isSelected(feature) {
		return self.selectInteraction.getFeatures().getArray().indexOf(feature) !== -1;
	}
	
	function nextFeature(features) {
		var index = features.getArray().indexOf(self.selectedFeature);
		var next = index + 1;
		if (next > features.getLength() - 1) {
			next = 0;
		}
		return features.getArray()[next];
	};
	
	function getFeatureById(features, id) {
		for (var i = 0; i < features.length; i++) {
			if (features[i].getId() === id) {
				return features[i];
			}
		}
	}
};

acd.ol.action.SelectAction.prototype = Object.create(acd.ol.action.MapAction.prototype);

acd.ol.action.SelectAction.prototype.clearFeatures = function() {
	this.selectInteraction.getFeatures().clear();
	this.hoverInteraction.getFeatures().clear();
};

acd.ol.action.SelectAction.prototype.deactivate = function() {
	this.clearFeatures();
	acd.ol.action.MapAction.prototype.deactivate.call(this);
};

acd.ol.action.SelectAction.prototype.selectFeature = function(feature) {
	this.selectInteraction.getFeatures().push(feature);
	this.selectInteraction.dispatchEvent({
		type: 'select',
		feature: feature
	});
};

acd.ol.action.SelectAction.prototype.getSelectedFeatures = function() {
	return this.selectInteraction.getFeatures();
};

acd.ol.action.SelectAction.prototype.vergeetLaatstGeselecteerdeFeature = function() {
	this.selectedFeature = null;
};

acd.ol.action.SelectAction.prototype.hoverFeatureWithId = function(id, layer) {
	layer = layer || this.layer;
	var feature = layer.getSource().getFeatureById(id) || this.getClusterWithFeatureId(layer.getSource().getFeatures(), id);
	if (feature) {
		if (this.hoverInteraction.getFeatures().getArray().indexOf(feature) == -1) {
			this.hoverInteraction.getFeatures().push(feature);
		}
	}
};

acd.ol.action.SelectAction.prototype.isHovered = function(feature) {
	var hovered = false;
	this.hoverInteraction.getFeatures().forEach(function(selectedFeature) {
		if (selectedFeature === feature) {
			hovered = true;
		}
	});
	return hovered;
};

acd.ol.action.SelectAction.prototype.dehoverAllFeatures = function() {
	this.hoverInteraction.getFeatures().clear();
};