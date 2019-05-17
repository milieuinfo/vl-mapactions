var acd=acd||{};acd.ol=acd.ol||{},acd.ol.MapWithActions=function(t){var e=this;if(this.actions=[],ol.Map.call(this,t),t.actions.forEach(function(t){e.addAction(t)}),e.activateDefaultAction(),!t.disableEscapeKey){function o(t){t&&t.keyCode&&27==t.keyCode&&e.activateDefaultAction()}document.body.removeEventListener("keydown",o),document.body.addEventListener("keydown",o)}},acd.ol.MapWithActions.prototype=Object.create(ol.Map.prototype),acd.ol.MapWithActions.prototype.activateAction=function(t){if(this.currentAction){if(this.currentAction==t)return!1;this.currentAction.deactivate(),clearTimeout(this.timeout)}this.currentAction=t,this.timeout=setTimeout(function(){t.activate()},acd.ol.MapWithActions.prototype.CLICK_COUNT_TIMEOUT)},acd.ol.MapWithActions.prototype.addAction=function(t){var e=this;this.actions.push(t),t.map=this,t.interactions.forEach(function(t){e.addInteraction(t)})},acd.ol.MapWithActions.prototype.removeAction=function(t){var e=this;this.currentAction==t&&e.activateDefaultAction(),t.interactions.forEach(function(t){e.removeInteraction(t)}),this.actions.splice(this.actions.indexOf(t),1)},acd.ol.MapWithActions.prototype.activateDefaultAction=function(){0<this.actions.length&&this.actions[0]&&(this.currentAction==this.actions[0]&&(this.currentAction.deactivate(),this.currentAction=void 0),this.activateAction(this.actions[0]))},acd.ol.MapWithActions.prototype.CLICK_COUNT_TIMEOUT=300,acd.ol.CustomMap=function(t){var e=this;function o(){return"string"==typeof e.getTarget()||e.getTarget()instanceof String?document.querySelector$("#"+e.getTarget()):e.getTarget()}this.projection=t.projection,this.geoJSONFormat=new ol.format.GeoJSON({defaultDataProjection:t.projection}),t.layers=[t.customLayers.baseLayerGroup,t.customLayers.overlayGroup],this.custom=t.custom||{},t.customLayers.overviewMapLayers&&0<t.customLayers.overviewMapLayers.length&&this.createOverviewMapControl(t),t.controls=t.controls||[new ol.control.Zoom,new ol.control.Rotate,new ol.control.ZoomSlider,new ol.control.ScaleLine({minWidth:128})],this.baseLayers=t.customLayers.baseLayerGroup.getLayers().getArray(),acd.ol.MapWithActions.call(this,t),this.getTargetElement()&&(o().parentNode.appendChild(this.getTargetElement().querySelector(".ol-overlaycontainer")),o().parentNode.appendChild(this.getTargetElement().querySelector(".ol-overlaycontainer-stopevent"))),this.maxZoomViewToExtent=t.maxZoomViewToExtent||16},acd.ol.CustomMap.prototype=Object.create(acd.ol.MapWithActions.prototype),acd.ol.CustomMap.prototype.createOverviewMapControl=function(t){var n=this;this.overviewMapLayers=t.customLayers.overviewMapLayers,this.overviewMapControl=new ol.control.OverviewMap({layers:this.overviewMapLayers,collapsed:!1,view:new ol.View({projection:this.projection})}),this.overviewMapControl.element.addEventListener("click",function(){o()},!1);var e=this.overviewMapControl.element.getElementsByClassName("ol-overlay-container")[0];function o(e){function t(t){var o=0;return n.baseLayers.forEach(function(t,e){t.getVisible()&&(o=e)}),t[o+1>=t.length?0:o+1]}e||(e=t(n.baseLayers)),n.baseLayers.forEach(function(t){t.setVisible(t==e)});var o=n.overviewMapControl.getOverviewMap().getLayers().getArray(),i=t(o);o.forEach(function(t){t.setVisible(t==i)}),n.render(),n.overviewMapControl.getOverviewMap().render()}e&&e.addEventListener("click",function(){o()},!1),t.view&&t.controls.push(this.overviewMapControl),this.custom.toggleBaseLayer=o},acd.ol.CustomMap.prototype.addBaseLayerAndOverlayMapLayer=function(t,e){t.setVisible(0==this.baseLayers.length),this.baseLayers.push(t),this.overviewMapControl?this.overviewMapControl.getOverviewMap().getLayers().getArray().push(e):(this.createOverviewMapControl({customLayers:{overviewMapLayers:[e]}}),this.addControl(this.overviewMapControl)),e.setVisible(2==this.overviewMapControl.getOverviewMap().getLayers().getArray().length)},acd.ol.CustomMap.prototype.getBaseLayers=function(){return this.getLayerGroup().getLayers().getArray()[0].getLayers().getArray()},acd.ol.CustomMap.prototype.getOverlayLayers=function(){return this.getLayerGroup().getLayers().getArray()[1].getLayers().getArray()},acd.ol.CustomMap.prototype.initializeView=function(t,e){if(!this.getView().getZoom()){var o=new ol.View({extent:this.projection.getExtent(),projection:this.projection,maxZoom:16,minZoom:2,center:[140860.69299028325,190532.7165957574],zoom:2});this.zoomViewToExtent(o,t,e),this.setView(o),this.overviewMapControl&&this.addControl(this.overviewMapControl)}},acd.ol.CustomMap.prototype.zoomToExtent=function(t,e){this.zoomViewToExtent(this.getView(),t,e)},acd.ol.CustomMap.prototype.zoomViewToExtent=function(t,e,o){e&&t.fit(e,this.getSize()),(o||this.maxZoomViewToExtent)&&t.getZoom()>(o||this.maxZoomViewToExtent)&&t.setZoom(o||this.maxZoomViewToExtent)},acd.ol.CustomMap.prototype.zoomToGeometry=function(t,e){var o={type:"FeatureCollection",features:[{type:"Feature",geometry:t}]};this.zoomToExtent(this.geoJSONFormat.readFeatures(o)[0].getGeometry().getExtent(),e)},acd.ol.CustomMap.prototype.showInfo=function(t,e){var o=document.createElement("div");o.setAttribute("class","close"),o.onclick=function(){event.currentTarget.parentNode.remove()};var i=document.createElement("div");i.innerHTML="<span class='content'>"+t+"</span><div class='arrow'></div>",i.setAttribute("class","info-tooltip"),i.appendChild(o);var n=new ol.Overlay({offset:[0,-5],positioning:"bottom-center",element:i});this.addOverlay(n),n.setPosition(e),i.parentNode.style.position="fixed"},acd.ol.action=acd.ol.action||{},acd.ol.action.MapAction=function(t){var e=this;Array.isArray(t)||(t=[t]),this.interactions=[],t.forEach(function(t){e.addInteraction(t)})},acd.ol.action.MapAction.prototype.addInteraction=function(t){t.setActive(!1),this.interactions.push(t)},acd.ol.action.MapAction.prototype.activate=function(){this.interactions.forEach(function(t){t.setActive(!0)})},acd.ol.action.MapAction.prototype.deactivate=function(){this.interactions.forEach(function(t){t.setActive(!1)})},acd.ol.action.SelectAction=function(t,o,e){var i=this;function n(t,e){for(var o=0;o<t.length;o++)if(t[o].getId()===e)return t[o]}this.filter=e&&e.filter?e.filter:function(){return!0},this.layer=t,this.style=e?e.style:null,this.hoverStyle=e&&e.hoverStyle||this.style,this.selectInteractionFilter=function(t,e){return i.selectInteraction.getFeatures().clear(),i.filter(t,e)},this.hoverInteractionFilter=function(t,e){return i.filter(t,e)&&(o=t,!(-1!==i.selectInteraction.getFeatures().getArray().indexOf(o)));var o},this.getClusterWithFeatureId=function(t,e){for(var o=0;o<t.length;o++){var i=t[o].get("features");if(i&&n(i,e))return t[o]}},this.hoverInteraction=new ol.interaction.Select({filter:this.hoverInteractionFilter,condition:ol.events.condition.pointerMove,style:this.hoverStyle}),this.markInteraction=new ol.interaction.Select({style:this.style}),this.selectInteraction=new ol.interaction.Select({filter:this.selectInteractionFilter,multi:!0}),acd.ol.action.MapAction.call(this,[this.markInteraction,this.selectInteraction,this.hoverInteraction]),this.hoverInteraction.on("select",function(){var t=i.map.getTargetElement();0<i.hoverInteraction.getFeatures().getLength()?t.style.cursor="pointer":t.style.cursor=""}),this.selectedFeature=null,this.getLayer=function(){return t},this.selectInteraction.on("select",function(t){if(i.markInteraction.getFeatures().clear(),0<i.selectInteraction.getFeatures().getLength()){var e=null;e=1==i.selectInteraction.getFeatures().getLength()?i.selectInteraction.getFeatures().getArray()[0]:function(t){var e=t.getArray().indexOf(i.selectedFeature)+1;e>t.getLength()-1&&(e=0);return t.getArray()[e]}(i.selectInteraction.getFeatures()),i.selectedFeature=e,o&&o(i.selectedFeature,t,i.getLayer(e))}else this.selectedFeature=null,o&&o()}),this.fixClusterBehavior=function(){if(this.selectedFeature){var t=this.selectedFeature.get("features")||[this.selectedFeature];this.selectInteraction.getFeatures().clear(),this.markInteraction.getFeatures().clear(),t.forEach(function(t){this.markFeatureWithId(t.getId())},this)}}},acd.ol.action.SelectAction.prototype=Object.create(acd.ol.action.MapAction.prototype),acd.ol.action.SelectAction.prototype.clearFeatures=function(){this.selectInteraction.getFeatures().clear(),this.markInteraction.getFeatures().clear(),this.hoverInteraction.getFeatures().clear()},acd.ol.action.SelectAction.prototype.activate=function(){this.map&&this.map.on("moveend",this.fixClusterBehavior),acd.ol.action.MapAction.prototype.activate.call(this)},acd.ol.action.SelectAction.prototype.deactivate=function(){this.map&&this.map.un("moveend",this.fixClusterBehavior),this.clearFeatures(),acd.ol.action.MapAction.prototype.deactivate.call(this)},acd.ol.action.SelectAction.prototype.selectFeature=function(t){this.selectInteraction.getFeatures().push(t),this.selectInteraction.dispatchEvent({type:"select",feature:t})},acd.ol.action.SelectAction.prototype.getSelectedFeatures=function(){return this.selectInteraction.getFeatures()},acd.ol.action.SelectAction.prototype.vergeetLaatstGeselecteerdeFeature=function(){this.selectedFeature=null},acd.ol.action.SelectAction.prototype.markFeatureWithId=function(t,e){var o=(e=e||this.layer).getSource().getFeatureById(t)||this.getClusterWithFeatureId(e.getSource().getFeatures(),t);o&&-1==this.markInteraction.getFeatures().getArray().indexOf(o)&&this.markInteraction.getFeatures().push(o)},acd.ol.action.SelectAction.prototype.isMarked=function(e){var o=!1;return this.markInteraction.getFeatures().forEach(function(t){t===e&&(o=!0)}),o},acd.ol.action.SelectAction.prototype.demarkAllFeatures=function(){this.markInteraction.getFeatures().clear()},acd.ol.action.BoxSelectAction=function(e,o,t){var i=this;acd.ol.action.SelectAction.call(this,e,function(t){t&&o([t])},t),this.dragBoxInteraction=new ol.interaction.DragBox({style:new ol.style.Style({stroke:new ol.style.Stroke({color:[0,0,255,1]})})}),this.addInteraction(this.dragBoxInteraction),this.dragBoxInteraction.on("boxdrag",function(){var t=i.dragBoxInteraction.getGeometry().getExtent();i.hoverInteraction.getFeatures().clear(),e.getSource().forEachFeatureIntersectingExtent(t,function(t){i.hoverInteraction.getFeatures().push(t)})}),this.dragBoxInteraction.on("boxend",function(){0<i.hoverInteraction.getFeatures().getLength()&&o(i.hoverInteraction.getFeatures().getArray().slice(0))})},acd.ol.action.BoxSelectAction.prototype=Object.create(acd.ol.action.SelectAction.prototype),acd.ol.action.DeleteAction=function(e,o,t){var i=this,n=new ol.style.Style({fill:new ol.style.Fill({color:"rgba(217, 83, 79, 0.6)"}),stroke:new ol.style.Stroke({color:"#d9534f",width:5}),image:new ol.style.Circle({radius:4,stroke:new ol.style.Stroke({color:"#d9534f",width:5}),fill:new ol.style.Fill({color:"rgba(217, 83, 79, 0.6)"})})}),a=t&&t.style||n;function c(t){t&&e.getSource().getFeatureById(t.getId())===t&&e.getSource().removeFeature(t)}acd.ol.action.BoxSelectAction.call(this,e,function(t){o&&null!=o?o(t,function(t){c(t),i.clearFeatures()},function(){i.clearFeatures()}):(t.forEach(function(t){c(t)}),i.clearFeatures())},{style:a})},acd.ol.action.DeleteAction.prototype=Object.create(acd.ol.action.BoxSelectAction.prototype),acd.ol.action.DrawAction=function(i,t,e,o){var n=this,a=[],c=o||{};c.source=i.getSource(),c.type=t;var r=this.measurePointermoveHandler=void 0;function s(t,e,o){var i=function(t){{if(t&&t instanceof ol.geom.LineString)return new ol.geom.LineString(l(t)).getLength().toFixed(2);if(t&&t instanceof ol.geom.Polygon)return new ol.geom.LineString(l(t.getLinearRing(0))).getLength().toFixed(2)}return 0}(t.getGeometry());0!=i&&(o.textContent=i+" m",e.setElement(o),e.setPosition(t.getGeometry().getLastCoordinate()))}function l(t){var e=t.getCoordinates().length;return t.getCoordinates().slice(e-2)}function u(){c.measure&&(n.map.unByKey(n.measurePointermoveHandler),r&&(n.map.removeOverlay(r),r=void 0))}this.drawInteraction=new ol.interaction.Draw(c),a.push(this.drawInteraction),c.snapping&&a.push(new acd.ol.interaction.SnapInteraction(c.snapping.layer||i)),this.drawInteraction.on("drawstart",function(t){if(c.measure){var e=t.feature;c.measure="object"==typeof c.measure?c.measure:{},c.measure.tooltip=c.measure.tooltip||{};var o=document.createElement("div");o.setAttribute("class","measure-tooltip"),r=new ol.Overlay({offset:c.measure.tooltip.offset||[-15,10],positioning:"bottom-center"}),n.map.addOverlay(r),n.measurePointermoveHandler=n.map.on("pointermove",function(){s(e,r,o)})}}),this.cleanUp=function(){u()},acd.ol.action.MapAction.call(this,a),this.drawInteraction.on("drawend",function(t){var o=t.feature;e(o,function(){try{i.getSource().removeFeature(o)}catch(t){var e=i.getSource().on("addfeature",function(t){i.getSource().removeFeature(t.feature),i.getSource().unByKey(e)})}}),u()})},acd.ol.action.DrawAction.prototype=Object.create(acd.ol.action.MapAction.prototype),acd.ol.action.DrawAction.prototype.deactivate=function(){this.cleanUp(),acd.ol.action.MapAction.prototype.deactivate.call(this)},acd.ol.action.DrawLijnstukAction=function(t,e,o){(o=o||{}).maxPoints=2,acd.ol.action.DrawAction.call(this,t,"LineString",e,o)},acd.ol.action.DrawLijnstukAction.prototype=Object.create(acd.ol.action.DrawAction.prototype),acd.ol.action.DrawRectangleAction=function(t,e,o){(o=o||{}).maxPoints=2,o.geometryFunction=function(t,e){e||(e=new ol.geom.Polygon(null));var o=t[0],i=t[1];return e.setCoordinates([[o,[o[0],i[1]],i,[i[0],o[1]],o]]),e},acd.ol.action.DrawAction.call(this,t,"LineString",e,o)},acd.ol.action.DrawRectangleAction.prototype=Object.create(acd.ol.action.DrawAction.prototype),acd.ol.action.HighlightAction=function(t,e){this.layer=t,this.style=e?e.style:null,this.getFeatureById=function(t,e){for(var o=0;o<t.length;o++)if(t[o].getId()===e)return t[o]},this.getClusterByFeatureId=function(t,e){for(var o=0;o<t.length;o++){var i=t[o].get("features");if(i&&this.getFeatureById(i,e))return t[o]}},this.highlightInteraction=new ol.interaction.Select({layers:[t],condition:ol.events.condition.pointerMove,style:this.style}),acd.ol.action.MapAction.call(this,[this.highlightInteraction])},acd.ol.action.HighlightAction.prototype=Object.create(acd.ol.action.MapAction.prototype),acd.ol.action.HighlightAction.prototype.deactivate=function(){this.dehighlightAllFeatures(),acd.ol.action.MapAction.prototype.deactivate.call(this)},acd.ol.action.HighlightAction.prototype.highlightFeatureWithId=function(t){if(t){var e=this.layer.getSource().getFeatureById(t)||this.getClusterByFeatureId(this.layer.getSource().getFeatures(),t);e&&-1==this.highlightInteraction.getFeatures().getArray().indexOf(e)&&this.highlightInteraction.getFeatures().push(e)}},acd.ol.action.HighlightAction.prototype.isHighlighted=function(e){var o=!1;return this.highlightInteraction.getFeatures().forEach(function(t){t===e&&(o=!0)}),o},acd.ol.action.HighlightAction.prototype.dehighlightAllFeatures=function(){this.highlightInteraction.getFeatures().clear()},acd.ol.action.MeasureAction=function(t,e){var i=this,o=0;function n(t){i.map.removeOverlay(i.measureTooltips[t]),i.measureTooltips[t]=null}this.layer=t,this.measureTooltips=[],this.measurePointermoveHandler=void 0,acd.ol.action.DrawAction.call(this,t,"LineString",function(){i.map.unByKey(i.measurePointermoveHandler)},e),this.drawInteraction.on("drawstart",function(t){var e=o++,n=t.feature;n.setId(e);var a=document.createElement("div");a.setAttribute("class","measure-tooltip");var c=new ol.Overlay({offset:[-15,10],positioning:"bottom-center"});i.map.addOverlay(c),i.measureTooltips[e]=c,i.measurePointermoveHandler=i.map.on("pointermove",function(){var t,e,o,i;e=c,o=a,i=(t=n).getGeometry().getLength().toFixed(2),o.textContent=i+" m",e.setElement(o),e.setPosition(t.getGeometry().getLastCoordinate())})}),this.layer.getSource().on("removefeature",function(t){n(t.feature.getId())}),this.cleanUp=function(){this.map.unByKey(this.measurePointermoveHandler);var o=[];i.measureTooltips.forEach(function(t,e){null==i.layer.getSource().getFeatureById(e)&&o.push(e)}),o.forEach(function(t){n(t)})},this.getTooltipFor=function(t){return this.measureTooltips[t]}},acd.ol.action.MeasureAction.prototype=Object.create(acd.ol.action.DrawAction.prototype),acd.ol.action.MeasureAction.prototype.deactivate=function(){this.cleanUp(),acd.ol.action.MapAction.prototype.deactivate.call(this)},acd.ol.action.ModifyAction=function(t,e,o){var i=this,n=o?o.filter:null;acd.ol.action.SelectAction.call(this,t,null,{filter:n}),this.modifyInteraction=new ol.interaction.Modify({features:this.selectInteraction.getFeatures()}),this.addInteraction(this.modifyInteraction),o&&o.snapping&&this.addInteraction(new acd.ol.interaction.SnapInteraction(o.snapping.layer||t)),this.modifyInteraction.on("modifystart",function(t){i.currentGeometryBeingModified=t.features.getArray()[0].getGeometry().clone()}),this.modifyInteraction.on("modifyend",function(t){t.features.forEach(function(t){e(t,function(t){t.setGeometry(i.currentGeometryBeingModified)})})})},acd.ol.action.ModifyAction.prototype=Object.create(acd.ol.action.SelectAction.prototype),acd.ol.action.ModifyAndTranslateAction=function(t,e,o){var i=this;acd.ol.action.ModifyAction.call(this,t,e,o),this.translateInteraction=new ol.interaction.Translate({features:this.selectInteraction.getFeatures()}),this.addInteraction(this.translateInteraction),this.translateInteraction.on("translateend",function(t){t.features.forEach(function(t){e(t,function(t){t.getGeometry().setCoordinates(t.get("entity").geometry.coordinates)}),i.selectInteraction.getFeatures().clear()})})},acd.ol.action.ModifyAndTranslateAction.prototype=Object.create(acd.ol.action.ModifyAction.prototype),acd.ol.action.SelectActions=function(i,t,n){var a=this;function c(e,t){var o=i.filter(function(t){return t.layer===e})[0];return o?o[t||"style"]:null}this.layers=i.map(function(t){return t.layer}),this.style=function(t){var e=c(a.getLayer(t));return e&&"function"==typeof e?e(t):e},this.hoverStyle=function(t){var e,o=c(e=a.getLayer(t),"hoverStyle")||c(e);return o&&"function"==typeof o?o(t):o},this.filter=function(t,e){var o=!1;return a.layers.forEach(function(t){t==e&&(o=!0)}),n&&n.filter?o&&n.filter(t):o},acd.ol.action.SelectAction.call(this,this.layers,t,{filter:this.filter,style:this.style,hoverStyle:this.hoverStyle}),this.getLayer=function(e){var o=void 0;return a.layers.forEach(function(t){-1!==t.getSource().getFeatures().indexOf(e)&&(o=t)}),o}},acd.ol.action.SelectActions.prototype=Object.create(acd.ol.action.SelectAction.prototype),acd.ol.action.SelectActions.prototype.markFeatureWithId=function(e,t){if(t)acd.ol.action.SelectAction.prototype.markFeatureWithId.call(this,e,t);else{var o=this;this.layers.forEach(function(t){acd.ol.action.SelectAction.prototype.markFeatureWithId.call(o,e,t)})}},acd.ol.action.ShowInfoAction=function(t,e,o,i){var n=this;n.layer=t,n.tooltips=new acd.ol.action.Tooltips(t,e,o),acd.ol.action.DrawAction.call(this,t,"Point",function(t){n.tooltips.showTooltip(n.map,t,t.getGeometry().getCoordinates(),i)})},acd.ol.action.ShowInfoAction.prototype=Object.create(acd.ol.action.DrawAction.prototype),acd.ol.action.ShowInfoAction.prototype.clear=function(){this.tooltips.clear(this.map),this.layer.getSource().clear()},acd.ol.action.ShowInfoAction.prototype.deactivate=function(){this.clear(),acd.ol.action.MapAction.prototype.deactivate.call(this)},acd.ol.action.ShowInfoSelectAction=function(t,e,o,i,n){var a=this;this.tooltips=new acd.ol.action.Tooltips(t,e,o,i),this.layer=t,acd.ol.action.SelectAction.call(this,t,function(t,e){if(t){var o=t.getGeometry().getClosestPoint(e.mapBrowserEvent.coordinate);a.tooltips.showTooltip(a.map,t,o,n)}})},acd.ol.action.ShowInfoSelectAction.prototype=Object.create(acd.ol.action.SelectAction.prototype),acd.ol.action.ShowInfoSelectAction.prototype.clear=function(){this.tooltips.clear(this.map)},acd.ol.action.ShowInfoSelectAction.prototype.deactivate=function(){this.clear(),this.layer.setVisible(this.visible),acd.ol.action.SelectAction.prototype.deactivate.call(this)},acd.ol.action.ShowInfoSelectAction.prototype.activate=function(){this.visible=this.layer.getVisible(),this.layer.setVisible(!0),acd.ol.action.SelectAction.prototype.activate.call(this)},acd.ol.action.SplitAction=function(t,l,e){var u=this,h=new jsts.io.OL3Parser;this.interactions=[],this.selectAction=new acd.ol.action.SelectAction(t,function(t){t&&(u.selectAction.deactivate(),acd.ol.action.MapAction.prototype.activate.call(u.drawAction))},e),this.drawAction=new acd.ol.action.DrawAction(t,"LineString",function(t){var e=u.selectAction.selectedFeature,o=h.read(e.getGeometry().getPolygons()[0]),i=h.read(t.getGeometry()),n=o.getExteriorRing().union(i),a=new jsts.operation.polygonize.Polygonizer;a.add(n);for(var c=[],r=a.getPolygons().iterator();r.hasNext();){var s=new ol.geom.MultiPolygon;s.appendPolygon(h.write(r.next())),c.push(new ol.Feature({geometry:s}))}l&&l(e,c),u.selectAction.clearFeatures(),setTimeout(function(){acd.ol.action.MapAction.prototype.deactivate.call(u.drawAction),acd.ol.action.MapAction.prototype.activate.call(u.selectAction)})},e)},acd.ol.action.SplitAction.prototype=Object.create(acd.ol.action.SelectAction.prototype),acd.ol.action.SplitAction.prototype.activate=function(){this.map.addAction(this.selectAction),this.map.addAction(this.drawAction),this.selectAction.activate()},acd.ol.action.SplitAction.prototype.deactivate=function(){this.selectAction.deactivate(),this.drawAction.deactivate()},acd.ol.action.Tooltips=function(l,u,h,p){var t=this;(t.layer=l).tooltips=[],this.showTooltip=function(e,o,i,t){t=t||{};var n=document.createElement("div");n.innerHTML="<span class='content'></span><div class='arrow'></div>",n.setAttribute("class","info-tooltip");var a=new ol.Overlay({offset:t.offset||[0,-10],positioning:"bottom-center",insertFirst:!1});function c(t){n.childNodes[0].innerHTML=t,a.setPosition(i),a.setElement(n),n.parentNode.style.position="fixed"}a.setElement(n),e.addOverlay(a),l.tooltips.push(a);var r=0,s=setTimeout(function(){r=500,c("<span class='icon'></span> "+(h||"Info berekenen  ..."))},100);u(o,i).then(function(t){setTimeout(function(){clearTimeout(s),c(t),e.render(),p&&p(o,i)},r)})},this.clear=function(e){t.layer.tooltips.forEach(function(t){e.removeOverlay(t)})}},acd.ol.action.TranslateAction=function(t,e){var o=this;this.selectInteraction=new ol.interaction.Select({layers:[t],style:t.selectionStyle}),this.translateInteraction=new ol.interaction.Translate({features:this.selectInteraction.getFeatures(),layers:[t]}),acd.ol.action.MapAction.call(this,[this.selectInteraction,this.translateInteraction]),this.translateInteraction.on("translateend",function(t){t.features.forEach(function(t){e(t,function(t){t.getGeometry().setCoordinates(t.get("entity").geometry.coordinates)}),o.selectInteraction.getFeatures().clear()})})},acd.ol.action.TranslateAction.prototype=Object.create(acd.ol.action.MapAction.prototype),acd.ol.action.TranslateAction.prototype.deactivate=function(){this.selectInteraction.getFeatures().clear(),acd.ol.action.MapAction.prototype.deactivate.call(this)},acd.ol.interaction={},acd.ol.interaction.SnapInteraction=function(t){var e=t?t.getSource():null;ol.interaction.Snap.call(this,{source:e,pixelTolerance:7})},acd.ol.interaction.SnapInteraction.prototype=Object.create(ol.interaction.Snap.prototype);