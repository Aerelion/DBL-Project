import * as d3 from "d3";

function generateMatrix(edges, nodes) {

  var side = document.getElementById("testSelect").value;
  var w = document.getElementById("viscontent").clientWidth;
  var h = document.getElementById("viscontent").clientHeight;

  const squareSize = Math.floor(h / nodes.length) - 1;

  // nodePositions is an object that stores the positions where the nodes should be displayed in the adj matrix
  var nodePositions = {};
  for (var i = 0; i < nodes.length; i++) {
    let position = (nodes[i].employeeID).toString()
    nodePositions[position] = i;
  }


  var svg = d3
    .select('#' + side)
    .append("svg")
    .attr("height", h)
    .attr("width", w)
    .style("background", "black");

  // svg.append("rect")
  // .attr("height", 30)
  // .attr("width", 30)
  // .attr("fill", "white");

  svg.selectAll("rect")
    .data(edges)
    .enter()
    .append("rect")
    .attr("x", (d) => {
      return nodePositions[(d.target).toString()] * squareSize;
    })
    .attr("y", (d) => {
      return nodePositions[(d.source).toString()] * squareSize;
    })
    .attr("height", squareSize)
    .attr("width", squareSize)
    .attr("fill", "white")
    .style("opacity", 0.15);  // this makes it so that overlayed rectangles can be seen (kind of adds weights to the edges)

  console.log(nodes, edges, nodePositions);
}

export default generateMatrix