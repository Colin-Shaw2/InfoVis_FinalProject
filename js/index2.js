// set the dimensions and margins of the diagram

// var margin = { top: 0, right: 0, bottom: 0, left: 0 };
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
      
    nodes.each(d => {
      d.x = 0;
      if (d.data.branch == "master") {
        // svg.append("text")
        //    .attr("x", d.x+20)
        //    .attr("y", d.y)
        //    .attr("dy", ".35em")
        //    .text(d.data.message)
      }
      console.log(d.data.branch)
      if (!seen_branches.includes(d.data.branch)) {
        seen_branches.push(d.data.branch);
        svg.append("text")
          .attr("x", d.x + seen_branches.indexOf(d.data.branch) * 100)
          .attr("y", d.y - 20)
          .attr("dy", ".35em")
          .text(d.data.branch)
          .on("mouseover", handleMouseOver)
          .on("mouseout", handleMouseOut);


        d.x += seen_branches.indexOf(d.data.branch) * 100;
      } else {
        d.x += seen_branches.indexOf(d.data.branch) * 100;

      }
      // svg.append("text")
      //    .attr("x", d.x+20)
      //    .attr("y", d.y)
      //    .attr("font-size", "8")
      //    .text(d.data.time)

      /*
      if(i % 3 == 0){
        d.x = 0
        d.y = 0
        svg.enter()
           .append("g")
           .attr("class", "node" + (d.children ? " node--internal" : " node--leaf"))
           .attr("transform", function(d) {return "translate(" + d.x + "," + d.y + ")"; });
      }*/
      i++;
      // console.log(d.data.branch);

    });

    // Create SVG



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

function handleMouseOver(d, i) {
  d3.select(this).attr({
    fill: "orange",
    r: radius * 2
  });

  // Specify where to put label of text
  svg.append("text").attr({
    id: "t" + d.x + "-" + d.y + "-" + i,  // Create an id for text so we can select it later for removing on mouseout
    x: function () { return xScale(d.x) - 30; },
    y: function () { return yScale(d.y) - 15; }
  })
    .text(function () {
      return [d.x, d.y];  // Value of the text
    });


}

function handleMouseOut(d, i) {
  // Use D3 to select element, change color back to normal
  d3.select(this).attr({
    fill: "black",
    r: radius
  });

  // Select text by id and then remove
  d3.select("#t" + d.x + "-" + d.y + "-" + i).remove();  // Remove text location
}


function updateNode(input) {
  nodeType = input;
  update();
}

function updateLine(input) {
  lineType = input;
  update();
}


function update() {
  console.log("Changing lines")
  // Remove all 
  d3.select("svg")
    .selectAll("g")
    .html("");

  var treemap = d3.tree()
    .separation(function (a, b) { return a.parent === b.parent ? 1 : 2; })
    .size([width, height]);
  // assigns the data to a hierarchy using parent-child relationships
  nodes = d3.hierarchy(results)
  // maps the node data to the tree layout
  nodes = treemap(nodes);

  // Nodes
  if (nodeType == 0) {
    normalNodes(node);
  } else if (nodeType == 1) {
    arcNodes(svg, 5, nodes.descendants());
  } else if (nodeType == 2) {
    arcNodes(svg, 0, nodes.descendants());
  }

  // Links
  if (lineType == 0) {
    straightLine(svg, nodes);
  } else if (lineType == 1) {
    curveLine(svg, nodes);
  } else if (lineType == 2) {
    boxLine(svg, nodes);
  }



}

function curveLine(svg, nodes) {
  var link = svg.selectAll(".link")
    .data(nodes.descendants().slice(1))
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", function (d) {
      return "M" + d.x + "," + d.y
        + "C" + d.x + "," + (d.y + d.parent.y) / 2
        + " " + d.parent.x + "," + (d.y + d.parent.y) / 2
        + " " + d.parent.x + "," + d.parent.y;
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

function boxLine(svg, nodes) {
  svg.selectAll(".link")
    .data(nodes.descendants().slice(1))
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", function (d) { return box(d); });

}

function box(d) {
  return "M" + d.x + "," + d.y
    + "L" + d.x + "," + (d.y + d.parent.y) / 2
    + " " + d.parent.x + "," + (d.y + d.parent.y) / 2
    + " " + d.parent.x + "," + d.parent.y;
}

function normalNodes(node) {
  node.append("circle")
    .attr("r", 10)
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
var h = screen.height;
var w = screen.width*.45;
var r = Math.min(w, h) / 2;
var colorScale = d3.scaleOrdinal(d3.schemeSet1);
let dataFile = "SushiGO.json"; //need to enter the file being entered (will edit to run a TSV file)


function createSunburst(data) {
  //Adds the svg element and also adjusts the element
  //There is also a transformation to keep it in the centre of the element region
  var g = d3.select('.svgSun')
    // .attr('height', screen.height)
    // .attr('width', screen.width)
    .attr('height', h)
    .attr('width', w)
    .append('g')
    // .attr('transform', 'translate(' + h / 2  + ',' + w / 2 + ')');
    .attr('transform', 'translate(' + h/2.5+ ',' + w / 2 + ')');

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









