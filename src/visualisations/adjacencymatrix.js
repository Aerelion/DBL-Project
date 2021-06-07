import * as d3 from "d3";

function generateMatrix(edges, nodes) {

  var side = document.getElementById("testSelect").options[1].value;
  var w = document.getElementById("viscontent").clientWidth;
  var h = document.getElementById("viscontent").clientHeight;

  var svg = d3
    .select('#' + side)
    .append("svg")
    .attr("height", h)
    .attr("width", w);

    svg.append("rect")
    .data(edges)
    .attr("width", (d, i, n) => {
      console.log(d, i, n);
      return d.id;
    })

  console.log(nodes);
}

export default generateMatrix