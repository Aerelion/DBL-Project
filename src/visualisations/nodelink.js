import * as d3 from "d3";

function generateNetwork(edges, nodes) {
  var side = document.getElementById("testSelect").value;
  var w = document.getElementById("viscontent").clientWidth;
  var h = document.getElementById("viscontent").clientHeight;
  
  var svg = d3
    .select("#" + side)
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .style("background", "black")
    .call(
      d3.zoom().on("zoom", (event) => {
        svg.attr("transform", event.transform).scaleExtent([1, 24]);
      })
    )
    .append("g");

  var simulation = d3
    .forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-50))
    .force(
      "link",
      d3
        .forceLink()
        .id(function (d) {
          return d.employeeID;
        })
        .links(edges)
    )
    .force("center", d3.forceCenter(w / 2, h / 2))
    .on("end", ticked);

  var edge = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(edges)
    .enter()
    .append("line")
    .style("stroke", "#aaa");

  var node = svg
    .append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", 5)
    .attr("fill", function () {
      return "blue";
    })
    .call(dragNodes(simulation));

  function ticked() {
    edge
      .attr("x1", function (d) {
        return d.source.x;
      })
      .attr("y1", function (d) {
        return d.source.y;
      })
      .attr("x2", function (d) {
        return d.target.x;
      })
      .attr("y2", function (d) {
        return d.target.y;
      });

    node
      .attr("cx", function (d) {
        return d.x;
      })
      .attr("cy", function (d) {
        return d.y;
      });
  }
  function dragNodes(simulation) { // This needs a lot more optimization, so it is being left out for the prototype.
      function dragStarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      
      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      
      function dragEnded(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      
      return d3.drag()
          .on("start", dragStarted)
          .on("drag", dragged)
          .on("end", dragEnded);
    }
  console.log(simulation);
  return svg.node();
}

export default generateNetwork