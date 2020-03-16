
// Data
var treeData =
  {
    "name": "Top Level",
    "children": [
      { 
		"name": "Level 2: A",
        "children": [
          { "name": "Level 3:  A" },
          { "name": "Level 3:  B" }
        ]
      }
    ]
  };


function update(){

}

function init(){
  // set the dimensions and margins of the diagram
  var margin = {top: 40, right: 90, bottom: 50, left: 90};
  var width = 720 - margin.left - margin.right;
  var height = 560 - margin.top - margin.bottom;

  // declares a tree layout and assigns the size
  var treemap = d3.tree()
                  .size([width, height]);
  //  assigns the data to a hierarchy using parent-child relationships
  var nodes = d3.hierarchy(treeData);

  // maps the node data to the tree layout
  nodes = treemap(nodes);
  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select("body")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform","translate(" + margin.left + "," + margin.top + ")");
  
              
  ///// Lines
  boxLine(svg, nodes);
  //curveLine(svg, nodes);
  //straightLine(svg, nodes);
  /////

  // adds each node as a group
  var node = svg.selectAll(".node")
              .data(nodes.descendants())
              .enter()
              .append("g")
              .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
              .attr("transform", function(d) {return "translate(" + d.x + "," + d.y + ")"; });

  //// Node type
  //normalNodes(node);
  //pieNodes(node);
  arcNodes(node, 5);
  /////

  timeSlider(svg);
  // Node Text
  placeText(node, width);
  
  

}

function normalNodes(node){
    node.append("circle")
        .attr("r", 10)
}

function placeText(node, width){
  node.append("text")
      .attr("dy", ".35em")
      .attr("y", function(d) { 
        return d.children ? 0 : 0})
      .attr("x", function(d) { 
        return d.children ? width-d.x: width-d.x
      })
      .text(function(d) { return d.data.name; });
}

function pieNodes(node){
  // Data
  //var data = {a: 9, b: 20, c:30, d:8, e:12}
  var data = [2, 4, 8, 10];
  // Arc
  const arc = d3.arc()
                .innerRadius(0)
                .outerRadius(10)

  // Color
  //var color = d3.scaleOrdinal().domain(["a", "b", "c", "d", "e", "f"]).range(d3.schemeDark2);
  var color = d3.scaleOrdinal(['#4daf4a','#377eb8','#ff7f00','#984ea3','#e41a1c']);

  // Pie
  var pie = d3.pie()

  //Generate groups
  var arcs =  node.selectAll("arc")
                .data(pie(data))
                .enter()
                .append("g")
                .attr("class", "arc")
                
  arcs.append("path")
      .attr("fill", function(d, i) {
          return color(i);
      })
      .attr("d", arc);
}

function arcNodes(node, radius){
  // Data
  //var data = {a: 9, b: 20, c:30, d:8, e:12}
  var data = [2, 4, 8, 10];
  // Arc
  const arc = d3.arc()
                .innerRadius(radius)
                .outerRadius(10)

  // Color
  //var color = d3.scaleOrdinal().domain(["a", "b", "c", "d", "e", "f"]).range(d3.schemeDark2);
  var color = d3.scaleOrdinal(['#4daf4a','#377eb8','#ff7f00','#984ea3','#e41a1c']);
  // Pie
  var pie = d3.pie()

  //Generate groups
  var arcs = node.selectAll("arc")
                 .data(pie(data))
                 .enter()
                 .append("g")
                 .attr("class", "arc")
                
  arcs.append("path")
      .attr("fill", function(d, i) {
          return color(i);
      })
      .attr("d", arc);


}

function boxLine(svg, nodes){
  console.log(nodes.descendants().slice(1))
  var link = svg.selectAll(".link")
              .data(nodes.descendants().slice(1))
              .enter()
              .append("path")
              .attr("class", "link")
              .attr("d", function(d) {
                return "M" + d.x + "," + d.y
                  + "L" + d.x + "," + (d.y + d.parent.y) / 2
                  + " " + d.parent.x + "," +  (d.y + d.parent.y) / 2
                  + " " + d.parent.x + "," + d.parent.y;
                });

}

function curveLine(svg, nodes){
  var link = svg.selectAll(".link")
              .data(nodes.descendants().slice(1))
              .enter()
              .append("path")
              .attr("class", "link")
              .attr("d", function(d) {
                return "M" + d.x + "," + d.y
                  + "C" + d.x + "," + (d.y + d.parent.y) / 2
                  + " " + d.parent.x + "," +  (d.y + d.parent.y) / 2
                  + " " + d.parent.x + "," + d.parent.y;
                });
}

function straightLine(svg, nodes){
  var link = svg.selectAll("link")
              .data(nodes.descendants().slice(1))
              .enter()
              .append("path")
              .attr("class", "link")
      
  var lines = svg.selectAll('line')
                .data(nodes.descendants().slice(1))
                .enter()
                .append('line')
                .attr('stroke','#000')
                .attr('x1',function(d){return d.x})
                .attr('y1',function(d){return d.y})
                .attr('x2',function(d){return d.parent.x})
                .attr('y2',function(d){return d.parent.y})
}

function timeSlider(svg){
   // Vertical
  var sliderVertical = d3.sliderLeft()
                        .min(d3.min(100))
                        .max(d3.max(0))
                        .height(300)
                        .tickFormat(d3.format('.2%'))
                        .ticks(5)
                        .default(0.015)
						/*
                        .on('onchange', val => {
                          d3.select('p#value-vertical').text(d3.format('.2%')(val));
                        });*/
  var gVertical = svg.append('g')
					 .attr('transform', 'translate(60,30)');
                      
  gVertical.call(sliderVertical);
  svg.append("text")
	  .attr("dy", ".35em")
	  .attr("y", 0)
	  .attr("x", 0)
	  .text("TIME");
  
 //d3.select('p#value-vertical').text(d3.format('.2%')(sliderVertical.value()));
} 







    