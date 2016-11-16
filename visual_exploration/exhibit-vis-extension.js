
Exhibit.onjQueryLoaded(function() {
    var loader = function() {
        var javascriptFiles, cssFiles, delayID;

        Exhibit.VisExtension = {
            "initialized": false, // used in the view
            "_CORSWarned": false, // used in the view
            'datasets': {},
            'views': {}
        };

        javascriptFiles = [
            'bootstrap-3.3.2-dist/js/bootstrap.min.js',
            'wordcloud-view.js',
            'stream-view.js',
            'world-view.js'
        ];

        Exhibit.VisExtension['build_view'] = function(name, functions) {
            var class_name = name + 'View';
            console.log('building view', name, Exhibit.VisExtension);
            Exhibit.VisExtension[class_name] = {'initialized': false};

            Exhibit[class_name] = function (containerElmt, uiContext) {
                console.log(class_name)
                Exhibit[class_name]._initialize();

                var view = this;

                Exhibit.jQuery.extend(this, new Exhibit.View(
                    name,
                    containerElmt,
                    uiContext
                ));

                this._overlays = [];
                this._accessors = {};

                this._selectListener = null;
                this._shown = false;

                this._onItemsChanged = function () {
                    view._reconstruct();
                };

                Exhibit.jQuery(uiContext.getCollection().getElement()).bind(
                    "onItemsChanged.exhibit",
                    view._onItemsChanged
                );

                this.register();
            };

            Exhibit[class_name]._initialize = function () {
                if (!Exhibit.VisExtension[class_name]) {
                    Exhibit.VisExtension[class_name].initialized = true;
                }
            };

            Exhibit[class_name].prototype._reconstruct = function () {
                var currentSize, unplottableItems;

                currentSize = this.getUIContext().getCollection().countRestrictedItems();
                unplottableItems = [];

                if (currentSize > 0) {
                    this._rePlotItems(unplottableItems);
                }

                this._dom.setUnplottableMessage(currentSize, unplottableItems);
            };

            Exhibit[class_name].prototype._rePlotItems = function (unplottableItems) {
                var self, collection, database, settings, accessors, currentSet, locationToData, hasColorKey, hasSizeKey, hasIconKey, hasIcon, hasPoints, hasPolygons, hasPolylines, makeLatLng, bounds, maxAutoZoom, colorCodingFlags, sizeCodingFlags, iconCodingFlags, addMarkerAtLocation, latlngKey, legendWidget, colorCoder, keys, legendGradientWidget, k, key, color, sizeCoder, points, space, i, size, iconCoder, icon;

                self = this;
                collection = this.getUIContext().getCollection();
                database = this.getUIContext().getDatabase();
                settings = this._settings;
                accessors = this._accessors;

                currentSet = collection.getRestrictedItems();

                var items = [];
                currentSet.visit(function (itemID) {
                    items.push(database._spo[itemID]);
                });

                functions.render_items.apply(this, [items]);

                this._shown = true;
            };

            Exhibit[class_name].createFromDOM = function (configElmt, containerElmt, uiContext) {
                var configuration, view;
                configuration = Exhibit.getConfigurationFromDOM(configElmt);
                console.log('configuration', configuration);

                view = new Exhibit[class_name](
                    containerElmt !== null ? containerElmt : configElmt,
                    Exhibit.UIContext.createFromDOM(configElmt, uiContext)
                );

                //Exhibit.SettingsUtilities.createAccessorsFromDOM(configElmt, Exhibit.MapView._accessorSpecs, view._accessors);
                //Exhibit.SettingsUtilities.collectSettingsFromDOM(configElmt, view.getSettingSpecs(), view._settings);
                Exhibit[class_name]._configure(view, configuration);

                view._initializeUI();
                return view;
            };

            Exhibit[class_name]._configure = function (view, configuration) {
            };

            Exhibit[class_name].prototype._initializeUI = function () {
                var self, legendWidgetSettings, mapDiv;

                self = this;

                Exhibit.jQuery(this.getContainer()).empty();

                this._dom = Exhibit.ViewUtilities.constructPlottingViewDom(
                    this.getContainer(),
                    this.getUIContext(),
                    this._settings.showSummary && this._settings.showHeader,
                    {
                        "onResize": function () {}
                    },
                    {}
                );

                mapDiv = this._dom.plotContainer;
                Exhibit.jQuery(mapDiv)
                    .addClass("exhibit-" + name + "View-div");

                self._reconstruct();
            };

            Exhibit[class_name].prototype.dispose = function () {
                var view = this;
                Exhibit.jQuery(this.getUIContext().getCollection().getElement()).unbind(
                    "onItemsChanged.exhibit",
                    view._onItemsChanged
                );

                this._dom.dispose();
                this._dom = null;

                this._dispose();
            };
        };

        Exhibit.includeJavascriptFiles(null, javascriptFiles);

        Exhibit.VisExtension['highlight_entities'] = function(element) {
            require(['d3'], function(d3) {
                var spans = d3.select(element).select('span.entity-list')
                    .selectAll('span')
                    .classed('label label-info', true);

                var industry_spans = d3.select(element).select('span.industry-list')
                    .selectAll('span')
                    .classed('label label-success', true);
            });
        };

        require.config({
            paths: {
                  "sankey": "libs/d3-sankey/sankey",
                  "cartogram": "libs/d3-cartogram/cartogram",
                  "d3": "libs/d3/d3.min",
                  "leaflet": "libs/leaflet/leaflet",
                  "topojson": "libs/topojson/topojson.min",
                  "parsets": "libs/d3-parsets-1.2.4/d3.parsets",
                  "datagramas": "libs/datagramas",
                  "force_edge_bundling": "libs/d3-force-bundling/d3.ForceEdgeBundling",
                  "legend": "libs/d3-legend/d3-legend.min",
                  "cloud": "libs/d3-cloud/d3.layout.cloud",
                  "cola": "libs/cola/cola.min",
                  "d3-geo-projection": "libs/d3-geo-projection/d3.geo.projection.min",
                  "d3-tip": "libs/d3-tip/index",
                  "d3-queue": "js/d3-queue.v2.min"
                },
            shim: {
              "sankey": {
                "exports": "d3.sankey",
                "deps": ["d3"]
              },
              "cartogram": {
                "exports": "d3.cartogram",
                "deps": ["d3"]
              },
              "cola": {
                "exports": "cola",
                "deps": ["d3"]
              },
              "parsets": {
                "exports": "d3.parsets",
                "deps": ["d3"]
              },
              "legend": {
                "exports": "d3.legend",
                "deps": ["d3"]
              },
              "d3-geo-projection": {
                "exports": "d3.geo.projection",
                "deps": ["d3"]
              },
              "d3-tip": {
                "exports": "d3.tip",
                "deps": ["d3"]
              }
            },
        });
    };

    Exhibit.jQuery(document).one("loadExtensions.exhibit", loader);
    Exhibit.jQuery(document).on('exhibitConfigured.exhibit', function() {
        Exhibit.jQuery('input').addClass('form-control').attr('placeholder', 'Search...');

        require(['d3'], function(d3) {
            var current_popover = null;

            d3.json('./datasets/entities_description.json', function(error, json) {
                console.log('entities_description download', error, json);
                Exhibit.VisExtension.datasets['entity_descriptions'] = json;

                d3.selectAll('span.entity-list')
                    .selectAll('span')
                    .on('click', function(d) {
                        var node = d3.select(this);
                        var title = node.text();

                        Exhibit.jQuery(node.node()).popover({
                            'trigger': 'click',
                            'placement': 'top',
                            'content': json[title]
                        });
                        
                        console.log(node, title);
                    });
            });
        });
    });
});
