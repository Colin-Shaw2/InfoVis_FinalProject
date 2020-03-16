
//Dimensions and Color variables
var w = 1000;
var h = 1000;
var r = Math.min(w, h) / 2;
var colorScale = d3.scaleOrdinal(d3.schemeCategory20);
let dataFile = " "; //need to enter the file being entered (will edit to run a TSV file)

function createSunburst(data) {
    // Adds the svg element and also adjusts the element
    //There is also a transformation to keep it in the centre of the element region
    var g = d3.select('svg')
        .attr('height', h)
        .attr('width', w)
        .append('g')
        .attr('transform', 'translate(' + h / 2 + ',' + w / 2 + ')');

    var partition = d3.partition()
        .size([Math.PI * 2, r]);

    root = d3.hierarchy(data)
        .sum(function (d) {
            return d.size;
        })
        .sort(function (a, b) {
            return b.value - a.value;
        });

    //Calculates the angles for each of the arcs and adjusts them
    partition(root);
    arc = d3.arc()
        .startAngle(function (d) {
            d.x0s = d.x0;
            return d.x0;
        })
        .endAngle(function (d) {
            d.x1s = d.x1;
            return d.x1;
        })
        .innerRadius(function (d) {
            return d.y0;
        })
        .outerRadius(function (d) {
            return d.y1;
        });


    split = g.selectAll('g').data(root.descendants(), function (d) { return d.data.name; });
    splitNodes = split.enter()
        .append('g')
        .attr("class", "node")
        .merge(split);

    split.exit()
        .remove();

    //Draws a line for each of the arcs for each node of the sunburst
    split.selectAll('path').remove();
    splitNodes.append('path').attr("display", function (d) { return d.depth ? null : "none"; })
        .attr("d", arc)
        .style('stroke', '#fff')
        .style("fill", function (d) {
            return colorScale((d.children ? d : d.parent).data.name);
        });


    split.selectAll('text')
        .remove();

    splitNodes.append("text")
        .attr("transform", function (d) {
            return "translate(" + arc.centroid(d) + ")rotate(" + rotateText(d) + ")";
        })
        .attr("dy", "5")
        .attr("dx", "-20")
        .text(function (d) {
            return d.parent ? d.data.name : "";
        });

    splitNodes.on("mouseover", hoverNodes);
};

//Adds the text labels and keeps them rotates according to their position on the sunburst
function rotateText(d) {
    var angle = (d.x0 + d.x1) / Math.PI * 90;
    return (angle < 180) ? angle - 90 : angle + 90;
}

// Redraw the Sunburst Based on User Input
function hoverNodes(hover) {
    var rootPath = hover.path(root).reverse();
    rootPath.shift();
    splitNodes.style("opacity", 0.3);
    splitNodes.filter(function (data) {
        if (data.hoveredOn && hover === data) {
            data.hoveredOn = false;
            splitNodes.style("opacity", 1);
            return true;

        } else if (hover === data) {
            data.hoveredOn = true;
            return true;
        } else {
            data.hoveredOn = false;
            return (rootPath.indexOf(data) >= 0);
        }
    })
        .style("opacity", 1);
};

window.onload = () => {
    d3.json(dataFile, function (error, nodeData) {
        if (error) {
            throw error;
        }
        allNodes = nodeData;
        createSunburst(allNodes);
    });
}