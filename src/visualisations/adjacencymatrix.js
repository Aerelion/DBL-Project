import * as d3 from "d3";

function generateMatrix(edges, nodes, edgeWeights) {

  var side = document.getElementById("testSelectAM").value;
  var w = document.getElementById("viscontent").clientWidth;
  var h = document.getElementById("viscontent").clientHeight;

  console.log(nodes);

  const minOpacity = 0.3; // opacity of an edge with weight 1
  const logCoefficient = (1 - minOpacity) / Math.log2(edgeWeights.maxWeight); // coeficient that is used to calculate opacity
  const squareSize = Math.floor(h / nodes.length) - 1;
  const textSpace = squareSize * 5; //NOTE: still have to improve this, so that text doesn't go out of the screen when rendering

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
    .call(
      d3.zoom().on("zoom", (event) => {
        svg.attr("transform", event.transform).scaleExtent([1, 24]);
      })
    )
    .append("g");

  var grid = svg.append("g").attr("id", "grid");
    grid.selectAll("rect")
    .data(edges)
    .enter()
    .append("rect")
    .attr("x", (d) => {
      return (nodePositions[(d.target).toString()] * squareSize) + textSpace;
    })
    .attr("y", (d) => {
      return (nodePositions[(d.source).toString()] * squareSize) + textSpace;
    })
    .attr("height", squareSize)
    .attr("width", squareSize)
    .attr("fill", "white")
    .style("opacity", ((d) => { return (Math.log2(d.weight) * logCoefficient) + minOpacity }));  // this makes it so that overlayed rectangles can be seen (kind of adds weights to the edges)

  var textLeft = svg.append("g").attr("id", "textLeft");
  var textUp = svg.append("g").attr("id", "textUp");

  textLeft.selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", textSpace)
    .attr("y", (d) => {
      return (nodePositions[(d.employeeID).toString()]*squareSize) + textSpace + (squareSize*0.75);
    })
    .text((d) => {
      return d.email;
    })
    .style("fill", "white")
    .style("font-size", squareSize);

    textUp.selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(90)")
    .attr("x", textSpace)
    .attr("y", (d) => {
      return -((nodePositions[(d.employeeID).toString()]*squareSize) + textSpace + (squareSize*0.25));
    })
    .text((d) => {
      return d.email;
    })
    .style("fill", "white")
    .style("font-size", squareSize);

  console.log(textLeft, textUp);
  console.log(grid.nodes());
}

export default generateMatrix