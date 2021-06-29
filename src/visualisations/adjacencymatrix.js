import * as d3 from "d3";

function generateMatrix(edges, nodes, edgeWeights, globalSelection) {

  var side = document.getElementById("testSelectAM").value;
  var w = document.getElementById("viscontent").clientWidth;
  var h = document.getElementById("viscontent").clientHeight;

  const textLength = 12;                                                        // change this to the approx max node text length
  const squareSize = Math.floor(h / (nodes.length + textLength)) - 1;           // the edge side length
  const strokeSize = squareSize / 4;                                            // the width of the highlight rectangle border
  const textSpace = squareSize * textLength;                                    // approx space allocated for text (important only to center the visualisation when rendering)
  const minOpacity = 0.3;                                                       // opacity of an edge with weight 1
  const logCoefficient = (1 - minOpacity) / Math.log2(edgeWeights.maxWeight);   // coeficient that is used to calculate opacity

  // nodePositions is an object that stores the positions where the nodes should be displayed in the adj matrix
  var nodePositions = {};
  for (var i = 0; i < nodes.length; i++) {
    let position = (nodes[i].employeeID).toString()
    nodePositions[position] = i;
  }

  var localSelection = [];

  // array of selected nodes

  // every svg component goes in here
  var svg = d3
    .select('#' + side)
    .append("svg")
    .attr("height", h)
    .attr("width", w)
    .call(
      d3.zoom().on("zoom", (event) => {
        svg.attr("transform", event.transform);
      })
    )
    .append("g");

  // the grid of edges
  var grid = svg.append("g").attr("id", "grid");
  grid.selectAll("rect")
    .data(edges)
    .enter()
    .append("rect")
    .attr("class", (d) => {
      return "id" + d.target + " " + "id" + d.source;
    })
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

  var text = svg.append("g").attr("id", "matrixText");     // all text nodes
  var textLeft = text.append("g").attr("id", "textLeft");  // the text nodes on the left side of the grid
  var textUp = text.append("g").attr("id", "textUp");      // the text nodes on top of the grid

  textLeft.selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("text-anchor", "end")
    .attr("class", (d) => {
      return "id" + d.employeeID;
    })
    .attr("x", textSpace-strokeSize)
    .attr("y", (d) => {
      return (nodePositions[(d.employeeID).toString()] * squareSize) + textSpace + (squareSize * 0.75);
    })
    .text((d) => {
      return d.name;
    })
    .style("fill", "white")
    .style("font-size", squareSize)

  textUp.selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(90)")
    .attr("class", (d) => {
      return "id" + d.employeeID;
    })
    .attr("x", textSpace-strokeSize)
    .attr("y", (d) => {
      return -((nodePositions[(d.employeeID).toString()] * squareSize) + textSpace + (squareSize * 0.25));
    })
    .text((d) => {
      return d.name;
    })
    .style("fill", "white")
    .style("font-size", squareSize);

    var highlightGrid = svg.append("g").attr("id", "highlightGrid");
    var highlightLeft = highlightGrid.append("g").attr("id", "highlightLeft");  // the text nodes on the left side of the grid
    var highlightUp = highlightGrid.append("g").attr("id", "highlightUp");      // the text nodes on top of the grid
  
    highlightLeft.selectAll("rect")
      .data(nodes)
      .enter()
      .append("rect")
      .attr("class", (d) => {
        return "highlightID" + d.employeeID;
      })
      .attr("height", squareSize)
      .attr("width", nodes.length*squareSize)
      .attr("x", textSpace)
      .attr("y", (d) =>{
        return ((nodePositions[(d.employeeID).toString()] * squareSize) + textSpace);
      })
      .attr("fill", "none")
      .attr("stroke", "orange")
      .attr("stroke-width", strokeSize)
      .style("visibility", "hidden");

      highlightUp.selectAll("rect")
      .data(nodes)
      .enter()
      .append("rect")
      .attr("class", (d) => {
        return "highlightID" + d.employeeID;
      })
      .attr("height", nodes.length*squareSize)
      .attr("width", squareSize)
      .attr("x", (d) =>{
        return ((nodePositions[(d.employeeID).toString()] * squareSize) + textSpace);
      })
      .attr("y", textSpace)
      .attr("fill", "none")
      .attr("stroke", "orange")
      .attr("stroke-width", strokeSize)
      .style("visibility", "hidden");

  // event handler for clicking on nodes
  text.selectAll("text")
    .on("click", function (e, d) {
      let nodesID = [];
      nodesID.push(d.employeeID);
      highlightMatrix(nodesID);
    });

  // event handler for clicking on edges
  grid.selectAll("rect")
    .on("click", function (e, d) {
      let nodesID = [];
      nodesID.push(parseInt(d.source));
      if (d.source != d.target) {
        nodesID.push(parseInt(d.target));
      }

      highlightMatrix(nodesID);
    });

  // function that toggles highlights for the nodes in the matrix
  // nodesID must be an array of integers
  function highlightMatrix(nodesID) {
    nodesID.forEach((node) => {
      var index = globalSelection.indexOf(node);
      if (index === -1) {
        svg.selectAll("text.id" + node).style("fill", "red");
        svg.selectAll("rect.highlightID" + node).style("visibility", "visible");
        globalSelection.push(node);
      } else {
        svg.selectAll("text.id" + node).style("fill", "white");
        svg.selectAll("rect.highlightID" + node).style("visibility", "hidden");
        globalSelection.splice(index, 1);
      }
    });
  }

  function updateHighlight() {

    // highlight nodes that were highlighted in the NL diagram
    globalSelection.forEach((node) => {
      var index = localSelection.indexOf(node);
      if (index === -1) {
        svg.selectAll("text.id" + node).style("fill", "red");
        svg.selectAll("rect.highlightID" + node).style("visibility", "visible");
        localSelection.push(node);
      }
    });

    // un-highlight nodes that are no longer highlighted in the NL diagram
    localSelection.forEach((node) => {
      var index = globalSelection.indexOf(node);
      if (index === -1) {
        svg.selectAll("text.id" + node).style("fill", "white");
        svg.selectAll("rect.highlightID" + node).style("visibility", "hidden");
        localSelection.splice(localSelection.indexOf(node), 1);
      }
    });
  }

  setInterval(function () { updateHighlight(); }, 50);
}

export default generateMatrix