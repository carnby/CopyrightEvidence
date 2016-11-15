(function() {
    // Global variables.
    var width = 1024;
    var height = width / 2;
    // The d3 function used to render a country to an SVG path.
    var path;
    // Color range used to render the features of the countries.
    var featureColor;
    // Features for each country:
    //   - articles: number of articles referencing to the country.
    var countryFeatures;

    // Question text.
    var featureNames = [
        { 
            id: 'articles', 
            label: 'Number of articles',
        },
        { 
            id: 'problems_uploading_images',
            label: 'When uploading your images of works, such as works of architecture or sculpture, made to be located permanently in public places on the internet, have you faced problems related to the fact that such works were protected by copyright?',
        },
        { 
            id: 'impact_neighbouring_right', 
            label: 'What would be the impact on publishers of the creation of a new neighbouring right in EU law (in particular on their ability to license and protect their content from infringements and to receive compensation for uses made under an exception)?',
        },
        { 
            id: 'impact_exception', 
            label: 'What would be the impact on you/your activity of introducing an exception at the EU level covering non-commercial uses of works, such as works of architecture or sculpture, made to be located permanently in public places?',
        },
    ];

    // Feature used in the visualization.
    var currentFeature = featureNames[0]['id'];

    // Updates the countries with the map. Call this method whenever you want to update the map.
    var update_countries = function (g) {
        var countries = g.selectAll('.country');

        // Check if we need to load the countries.
        if (countries[0].length == 0) {
            console.info('Rendering countries.');
            d3.json('datasets/countries.geojson', function(error, world) {
                var enterCountries = countries.data(world.features).enter().append('path');
                enterCountries
                    .attr('class', 'country')
                    .attr('d', path)
                    .attr('id', function(d,i) { return d.id; })
                    .attr('title', function(d) { return d.properties.name; })
                    .style('cursor', 'pointer')
                    .on('click', function (d, i) {
                        var name = d['properties']['ADMIN'];
                        // Click on the exhibit link to select the country.
                        var link = jQuery('div.exhibit-facet-value[title="' + name + '"]').find('a');
                        link.trigger('click');
                    });
                update_countries(g);
            });
            return;
        }
        console.info('Skipped rendering countries.');
        
        countries
            .style('fill', function(d, i) {
                var name = d['properties']['ADMIN'];
                if (name in countryFeatures) {
                    var value = countryFeatures[name][currentFeature];
                    if (value) {
                        return color[currentFeature](value);
                    }
                }
                return '#eee';
            })
            .style('stroke', 'white');
    };

    var worldmap = {};
    worldmap.render_items = function (items) {
        var self = this;

        require(['d3', 'd3-geo-projection'], function (d3, geo) {
            d3.json('datasets/opinions.json', function(error, opinions) {
                countryFeatures = {};
                // For each country, count the number of articles.
                // Maximum number of articles in a country.
                var maxArticles = 0;
                items.forEach(function (item) {
                    var countries = item.country;
                    if (!countries) {
                        return;
                    }
                    // Exhibit converts singletons to strings: we want to convert it back to a set.
                    if (typeof(countries) == 'string') {
                        countries = {};
                        countries[item.country] = true;
                    }
                    for (var country in countries) {
                        if (!(country in countryFeatures)) {
                            countryFeatures[country] = {
                                'articles': 0
                            };
                        }
                        countryFeatures[country]['articles'] += 1;
                        maxArticles = Math.max(maxArticles, countryFeatures[country]['articles']);
                    }
                });
                for (var country in opinions) {
                    if (!(country in countryFeatures)) {
                        countryFeatures[country] = {
                            'articles': 0
                        };
                    }
                    for (var question in opinions[country]) {
                        countryFeatures[country][question] = opinions[country][question];
                    }
                }

                // The projection used to draw the countries.
                var projection = d3.geo.equirectangular()
                    .scale(5 * (width + 1) / 2 / Math.PI)
                    .translate([width * 0.5 - 100, height * 0.5 + 700])
                    .precision(.1);

                /* global */ path = d3.geo.path()
                    .projection(projection);

                /* global */ color = {
                    'articles':  d3.scale.linear()
                        .domain([0, maxArticles])
                        .interpolate(d3.interpolateHcl)
                        .range([d3.rgb('#deebf7'), d3.rgb('#3182bd')]),
                    'problems_uploading_images':  d3.scale.linear()
                        .domain([0, 100])
                        .interpolate(d3.interpolateHcl)
                        .range([d3.rgb('#fc8d59'), d3.rgb('#91cf60')]),
                    'impact_neighbouring_right':  d3.scale.linear()
                        .domain([0, 100])
                        .interpolate(d3.interpolateHcl)
                        .range([d3.rgb('#fc8d59'), d3.rgb('#91cf60')]),
                    'impact_exception':  d3.scale.linear()
                        .domain([0, 100])
                        .interpolate(d3.interpolateHcl)
                        .range([d3.rgb('#fc8d59'), d3.rgb('#91cf60')]),
                };

                // Populate the buttons at the top of the page.
                var dropdownDiv = d3.select(self._dom.plotContainer)
                    .selectAll('div.questionDiv')
                    .data([1]).enter().append('div')
                    .classed('dropdown questionDiv', 1);

                dropdownDiv.append('button')
                    .classed('btn btn-default dropdown-toggle', 1)
                    .attr('type', 'button')
                    .attr('data-toggle', 'dropdown')
                    .html('Select a question <span class="caret"></span>');
                dropdownDiv.append('ul')
                    .classed('dropdown-menu', 1)
                    .selectAll('li.button').data(featureNames).enter()
                    .append('li').append('a')
                        .attr('href', '#')
                        .text(function(d,i) { return d['label']; })
                        .on('click', function(d,i) {
                            currentFeature = d['id'];
                            update_countries(g);
                        });
                // The SVG group to which the countries are added as children.
                var svg = d3.select(self._dom.plotContainer)
                    .selectAll('svg.worldmap')
                    .data([1]);

                svg.enter().append('svg')
                    .classed('worldmap', 1)
                    .attr('width', width)
                    .attr('height', height)
                    .append('g');

                var g = svg.select('g');

                update_countries(g);
            });  // d3.json
        });
    };

    Exhibit.VisExtension.build_view('WorldMap', worldmap);
}());