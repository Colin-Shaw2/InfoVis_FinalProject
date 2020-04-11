// set the dimensions and margins of the diagram

var margin = { top: 40, right: 90, bottom: 50, left: 90 };
var width = 1280 - margin.left - margin.right;
var height = 720 - margin.top - margin.bottom;

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg;
var results;
var node;
var nodes;
var nodeType = 2;
var lineType = 0;
var distanceBetweenNodes= 25;

function init() {
  d3.json("/data/SushiGotest.json").then(function (data) {
    // declares a tree layout and assigns the size
    results = data;
    var treeViewSize =0;
    var treemap = d3.tree()
    .separation(function (a, b) { return a.parent === b.parent ? 1 : 2; })
    .size([width, screen.height*1.5]);
    //  assigns the data to a hierarchy using parent-child relationships
    nodes = d3.hierarchy(data)

    var largestDepth = 0;
    nodes.each(d => {
      (d.depth > largestDepth)?largestDepth = d.depth:largestDepth +=0;
    })
    
    treeViewSize = distanceBetweenNodes*largestDepth;
    treemap = treemap.size([width, treeViewSize]);
    // maps the node data to the tree layout
    nodes = treemap(nodes);

    // 
    var columnScale = d3.scaleOrdinal(d3.schemeCategory10);


    svg = d3.select(".part1")
      .append("svg")
      // .attr("style", "overflow-y:scroll;height: 1000px;")
      .attr("width", width + margin.left + margin.right)
      .attr("height", treeViewSize + margin.top + margin.bottom)
      // .attr("width", 500)
      // .attr("height", screen.height*1.5 + margin.bottom*2)
      // .attr("style", "overflow-y:scroll;")
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
      var center_x = nodes.x;
      var i = 0;
      var seen_branches = []
      var textPosition = 0;
    nodes.each(d => {
      d.x = 0;
      if (d.data.branch == "master") {
      }
      //console.log(d.data.branch)
      if (!seen_branches.includes(d.data.branch)) {
        seen_branches.push(d.data.branch);
        textPosition = 100*seen_branches.indexOf(d.data.branch);
        svg.append("g")
           .attr("transform", "translate(" + textPosition + "," + -10 + ")")
           .append("text")
           .attr("transform", "rotate(90)")
           .attr("dy", ".35em")
           .attr("text-anchor", "start")
           .text(d.data.branch)
          
        
        d.x += seen_branches.indexOf(d.data.branch) * 100 + 40;
        // Branch Color Column
        var columnwidth = distanceBetweenNodes*4;
        svg.append("rect")
          .attr("x", seen_branches.indexOf(d.data.branch) * 100 - 10)
          .attr("y", -10)
          .attr("width", columnwidth)
          .attr("height", treeViewSize + 10)
          .attr("fill-opacity", .25)
          .attr('fill', columnScale(seen_branches.indexOf(d.data.branch)))
        console.log("Adding rect")

      } else {
        d.x += seen_branches.indexOf(d.data.branch) * 100 + 40;

      }
      i++;

    });
    ///// Lines
    straightLine(svg, nodes);


    // adds each node as a group
    node = svg.selectAll(".node")
      .data(nodes.descendants())
      .enter()
      .append("g")
      .attr("class", function (d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
      .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

    // Creates nodes
    arcNodes(svg, 5, nodes.descendants());
  });
}

function straightLine(svg, nodes) {
  var link = svg.selectAll("link")
    .data(nodes.descendants().slice(1))
    .enter()
    .append("path")
    .attr("class", "link")

  var lines = svg.selectAll('line')
    .data(nodes.descendants().slice(1))
    .enter()
    .append('line')
    .attr('stroke', '#000')
    .attr('x1', function (d) { return d.x })
    .attr('y1', function (d) { return d.y })
    .attr('x2', function (d) { return d.parent.x })
    .attr('y2', function (d) { return d.parent.y })
}


function placeText(node, width) {
  node.append("text")
    .attr("dy", ".35em")
    .attr("y", function (d) {
      return d.children ? 0 : 0
    })
    .attr("x", function (d) {
      return d.children ? width - d.x : width - d.x
    })
    .text(function (d) { return d.data.Author; });
}

function arcNodes(svg, radius, data) {
  // Arc Basis Function
  var arc = d3.arc()
    .innerRadius(radius)
    .outerRadius(10)
  // Pie Basis Function
  var pie = d3.pie();
  // Red: Deletion 
  var red = d3.schemeCategory10[3];
  // Green: Addition
  var green = d3.schemeCategory10[2];
  // Color Scale
  var color = d3.scaleOrdinal([green, red, "#808080"]);

  // Value Mapping 
  var values = data.map(function (d) {
    let additions = d.data.additions[0];
    let deletions = d.data.deletions[0];
    let changes = d.data.changes[0];
    if (additions == undefined) {
      additions = 0;
    }
    if (deletions == undefined) {
      deletions = 0;
    }
    if (changes == 0) {
      return [0, 0, 1]
    }
    return [additions, deletions]
  })

  // Add Arcs to Each Node
  data.forEach(function (d, i) {
    d_new = pie(values[i])
    var arcs = svg.selectAll("arc")
      .data(d_new)
      .enter()
      .append("g")
      .attr("class", "arc")

    arcs.append("path")
      .attr("fill", function (d, i) {
        return color(i);
      })
      .attr("d", arc)
      .attr("transform", function () { return "translate(" + d.x + "," + d.y + ")"; });
  });
}

//////FOR SUNBURST/////////////////

//Dimensions and Color variables
var w = 700;
var h = 700;
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


  // split.selectAll('text')
  //   .remove();

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
// Credit to Mike Bostock for this rotation text function
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
        userInfo.innerHTML += "<strong>Contributer</strong>: " + data.data.author + "<br>";
        if (data.data.time !== undefined) {
          userInfo.innerHTML += "<strong>Time:</strong> " + data.data.time;
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
            if (i > 9) {
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
  var scale = 'scale(0.9)';
  document.body.style.transform = scale;
  d3.json(dataFile).then(function (data) {
    allNodes = data;
    createSunburst(allNodes);
  });

  init();
}









