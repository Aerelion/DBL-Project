import * as d3 from "d3";

function generateMatrix(edges, nodes) {

  var side = document.getElementById("testSelect").options[1].value;
  var w = document.getElementById("viscontent").clientWidth;
  var h = document.getElementById("viscontent").clientHeight;

  const squareSize = Math.floor(h / nodes.length) - 1;

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
      return (d.source - 1) * squareSize;
    })
    .attr("y", (d) => {
      return (d.target - 1) * squareSize;
    })
    .attr("height", squareSize)
    .attr("width", squareSize)
    .attr("fill", "white");

  console.log(nodes.length);
}

export default generateMatrix