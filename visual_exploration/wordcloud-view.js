(function() {
    var cloud_draw = function (container, vis_width, vis_height, words, bounds) {
        var scale = bounds ? Math.min(
            vis_width / Math.abs(bounds[1].x - vis_width / 2),
            vis_width / Math.abs(bounds[0].x - vis_width / 2),
            vis_height / Math.abs(bounds[1].y - vis_height / 2),
            vis_height / Math.abs(bounds[0].y - vis_height / 2)) / 2 : 1;

        var text = container.selectAll("text")
            .data(words, function (d) {
                return d.key;
            });

        var pxr = window.devicePixelRatio;

        var font_opacity = d3.scale.pow().exponent(0.5)
            .domain(d3.extent(words, function (d) {
                return d.value;
            }))
            .range([0.1, 1.0]);

        text.transition()
            .duration(1000)
            .attr("transform", function (d) {
                return "translate(" + [d.x * pxr, d.y * pxr] + ")rotate(" + d.rotate + ")";
            })
            .style("font-size", function (d) {
                return d.size * pxr + "px";
            });

        text.enter().append("text")
            .attr("text-anchor", "middle")
            .attr("transform", function (d) {
                return "translate(" + [d.x * pxr, d.y * pxr] + ")rotate(" + d.rotate + ")";
            })
            .style("font-size", function (d) {
                return d.size * pxr + "px";
            })
            .style("opacity", 1e-6)
            .style("cursor", "pointer")
            .transition()
            .duration(1000);

        text.style("font-family", function (d) {
            return d.font;
        })
            .style("font-weight", 'bold')
            .style("fill", function (d) {
                return 'purple';
                return _font_color(d);
            })
            .style("opacity", function (d) {
                return font_opacity(d.value);
            })
            .text(function (d) {
                return d.key;
            });

        text.on('click', function (d, i) {
            console.log('click!', d);
            var input = jQuery('input');
            console.log('input', input);
            input.prop('value', d.key.replace('_', ' '));
            input.trigger('keyup');
        });

        text.exit().remove();
    };

    var wordcloud = {};
    wordcloud.render_items = function (items) {
        var self = this;
        var width = 1024;
        var height = 768;
        var font_range = [4, 64];
        // Words excluded from the wordcloud.
        var excluded_words = [
            'copyright'
        ];

        require(['d3', 'cloud'], function (d3, cloud) {
            var wordcounts = {};

            items.forEach(function (item) {
                if (!item.hasOwnProperty('abstract') || typeof item.abstract != 'string') {
                    return;
                }

                d3.entries(item.wordcount).forEach(function (d, i) {
                    if (d && jQuery.inArray(d.key, excluded_words) >= 0) { return; }
                    wordcounts.hasOwnProperty(d.key) ?
                        wordcounts[d.key] += d.value :
                        wordcounts[d.key] = d.value;
                });
            });

            wordcounts = d3.entries(wordcounts);

            var container = d3.select(self._dom.plotContainer)
                .selectAll('svg.wordcloud')
                .data([1]);

            container.enter().append('svg')
                .classed('wordcloud', 1)
                .append("g");

            container.attr({'width': width, 'height': height})
                .select('g')
                .attr("transform", "translate(" + [width >> 1, height >> 1] + ")");

            var font_scale = d3.scale.pow().exponent(1.0)
                .domain(d3.extent(wordcounts, function (d) {
                    return d.value;
                }))
                .range(font_range);

            var layout = cloud()
                .size([width * 0.5, height * 0.5])
                .font('Roboto')
                .fontWeight('bold')
                .fontSize(function (d) {
                    return font_scale(d.value);
                })
                .text(function (d) {
                    return d.key;
                })
                .rotate(-10)
                .on("end", function (words, bounds) {
                    cloud_draw(container.select('svg.wordcloud g'),
                        width, height, words, bounds);
                });

            layout.stop().words(wordcounts).start();
        });
    };

    Exhibit.VisExtension.build_view('Wordcloud', wordcloud);
}());