
//Dimensions and Color variables
var w = 750;
var h = 750;
var r = Math.min(w, h) / 2;
var colorScale = d3.scaleOrdinal(d3.schemeSet1);
let dataFile = "SushiGO.json"; //need to enter the file being entered (will edit to run a TSV file)


function createSunburst(data) {
    //Adds the svg element and also adjusts the element
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
            if (d.changes == undefined) {
                return 0;
            }
            return d3.sum(d.changes);
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


    split = g.selectAll('g').data(root.descendants(), function (d) { return d.data.author; });
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
            return colorScale((d.children ? d : d.parent).data.author);
        });


    split.selectAll('text')
        .remove();

    splitNodes.append("text")
        .attr("transform", function (d) {
            return "translate(" + arc.centroid(d) + ")rotate(" + rotateText(d) + ")";
        })
        .attr("dy", "5")
        .attr("dx", "-45")
        .text(function (d) {
            return d.children ? d.data.author : "";
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
    let userInfo = document.querySelector("#userInfo");
    let fileInfo = document.querySelector("#fileInfo");
    let changeInfo = document.querySelector("#changeInfo");
    var rootPath = hover.path(root).reverse();
    rootPath.shift();
    splitNodes.style("opacity", 0.3);
    splitNodes.filter(function (data) {

        if (data.hoveredOn && hover === data) {
            userInfo.innerHTML = "";
            fileInfo.innerHTML = "";
            changeInfo.innerHTML = "";

            userInfo.innerHTML = "<strong>History</strong><br>";
            fileInfo.innerHTML = "<strong>Files</strong><br>";
            changeInfo.innerHTML = "<strong>Changes Made</strong><br>";

            data.hoveredOn = false;
            splitNodes.style("opacity", 1);
            return true;

        } else if (hover === data) {
            //TEST
            // console.log(data.data);
            userInfo.innerHTML = "";
            fileInfo.innerHTML = "";
            changeInfo.innerHTML = "";
            userInfo.innerHTML = "<strong>History</strong><br>";
            if (userInfo) {
                userInfo.innerHTML += data.data.author + " ";
                if (data.data.time !== undefined) {
                    userInfo.innerHTML += data.data.time;
                }

                fileInfo.innerHTML = "<strong>Files</strong><br>";
                changeInfo.innerHTML = "<strong>Changes Made</strong><br>";
                if (data.data.files !== undefined) {
                    // let fileArray = [];
                    // for (let i = 0; data.data.files.length; i++) {
                    //     let dataMap = { files: data.data.files[i], changes: data.data.changes[i] }
                    //     fileArray.push(dataMap);
                    // }
                    // console.log(fileArray);

                    for (let i = 0; i < data.data.files.length; i++) {
                        if (i > 10) {
                            break;
                        }
                        fileInfo.innerHTML += data.data.files[i] + "<br>";
                        changeInfo.innerHTML += data.data.changes[i] + "<br>";
                    }
                }
            }
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
    d3.json(dataFile).then(function (data) {
        allNodes = data;
        createSunburst(allNodes);
    })
}