import * as d3 from "d3";

function generateMatrix(edges, nodes) {

  var side = document.getElementById("testSelect").options[1].value;
  var w = document.getElementById("viscontent").clientWidth;
  var h = document.getElementById("viscontent").clientHeight;

  const squareSize = Math.floor(h / nodes.length) - 1;

  // nodePositions is an array that stores the positions where the nodes should be displayed in the adj matrix
  // this array has undefined gaps, but its size will never be larger than the largest node id number
  // a better approach is by using hash tables, but this should work for the enron dataset
  // this method is very fast, but doesn't work if this is a large ID number
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
    .attr("fill", "white");

  console.log(nodes, edges, nodePositions);
}

export default generateMatrix