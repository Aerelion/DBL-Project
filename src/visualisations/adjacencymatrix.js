import * as d3 from "d3";

function generateMatrix(edges, nodes, edgeWeights, globalSelection) {

  var side = document.getElementById("testSelectAM").value;
  var w = document.getElementById("viscontent").clientWidth;
  var h = document.getElementById("viscontent").clientHeight;

  const textLength = 12;                                                        // change this to the approx max node text length
  const lineHighlightOpacity = 0.4;                                             // opacity of highlight line (the orange part inside the highlight broders)
  const squareSize = Math.floor(h / (nodes.length + textLength)) - 1;           // the edge side length
  const strokeSize = squareSize / 4;                                            // the width of the highlight rectangle border
  const textSpace = squareSize * textLength;                                    // approx space allocated for text (important only to center the visualisation when rendering)
  const minOpacity = 0.1;                                                       // opacity of an edge with weight 1
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

  var highlightGridLine = svg.append("g").attr("id", "highlightGridLine");                            // all highlight grid lines
  var highlightHorizontalLine = highlightGridLine.append("g").attr("id", "highlightHorizontalLine");  // horizontal highlight lines
  var highlightVerticalLine = highlightGridLine.append("g").attr("id", "highlightVerticalLine");      // vertical highlight line

  highlightHorizontalLine.selectAll("rect")
    .data(nodes)
    .enter()
    .append("rect")
    .attr("class", (d) => {
      return "hLineHighlightID" + d.employeeID;
    })
    .attr("height", squareSize / 4)
    .attr("width", nodes.length * squareSize)
    .attr("x", textSpace)
    .attr("y", (d) => {
      return ((nodePositions[(d.employeeID).toString()] * squareSize) + textSpace + (squareSize * 3 / 8));
    })
    .attr("fill", "orange")
    .style("opacity", lineHighlightOpacity)
    .style("visibility", "hidden");

  highlightVerticalLine.selectAll("rect")
    .data(nodes)
    .enter()
    .append("rect")
    .attr("class", (d) => {
      return "vLineHighlightID" + d.employeeID;
    })
    .attr("height", nodes.length * squareSize)
    .attr("width", squareSize / 4)
    .attr("x", (d) => {
      return ((nodePositions[(d.employeeID).toString()] * squareSize) + textSpace + (squareSize * 3 / 8));
    })
    .attr("y", textSpace)
    .attr("fill", "orange")
    .style("opacity", lineHighlightOpacity)
    .style("visibility", "hidden");

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
    .style("fill", (d) => {
      var sentiment = d.sentiment * (1 / 0.025);
      var hue = Math.min(Math.max(-1, sentiment),1)*0.599*100 + 60;
      var saturation = Math.min(1, Math.max(0.2, Math.abs(sentiment*1.5)));
      var lightness = Math.max(0.5, Math.min(0.8, 1 - Math.abs(sentiment*1.2)));
      //console.log(sentiment + ": " + hue + ", " + saturation + ", " + lightness);
      var c = (1 - Math.abs(2*lightness - 1)) * saturation;
      var x = c * (1 - Math.abs((hue / 60) % 2 - 1))
      var m = lightness - c/2;
      var r,g,b;
      if (hue < 60) {
          r = (c + m) * 255;
          g = (x + m) * 255;
          b = m * 255;
      } else if (hue < 120) {
          r = (x + m) * 255;
          g = (c + m) * 255;
          b = m * 255;
      }
      return "#" + ((1 << 24) + (Math.floor(r) << 16) + (Math.floor(g) << 8) + Math.floor(b)).toString(16).slice(1);
    })
    .style("opacity", ((d) => { return (Math.log2(d.weight) * logCoefficient) + minOpacity }));  // this makes it so that overlayed rectangles can be seen (kind of adds weights to the edges)

  var text = svg.append("g").attr("id", "matrixText");                 // all text nodes
  var textHorizontal = text.append("g").attr("id", "textHorizontal");  // the horizontal text nodes
  var textVertical = text.append("g").attr("id", "textVertical");      // the vertical text nodes

  textHorizontal.selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("text-anchor", "end")
    .attr("class", (d) => {
      return "hTextID" + d.employeeID;
    })
    .attr("x", textSpace - strokeSize)
    .attr("y", (d) => {
      return (nodePositions[(d.employeeID).toString()] * squareSize) + textSpace + (squareSize * 0.75);
    })
    .text((d) => {
      return d.name;
    })
    .style("fill", "white")
    .style("font-size", squareSize)

  textVertical.selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(90)")
    .attr("class", (d) => {
      return "vTextID" + d.employeeID;
    })
    .attr("x", textSpace - strokeSize)
    .attr("y", (d) => {
      return -((nodePositions[(d.employeeID).toString()] * squareSize) + textSpace + (squareSize * 0.25));
    })
    .text((d) => {
      return d.name;
    })
    .style("fill", "white")
    .style("font-size", squareSize);

  var highlightGridBorder = svg.append("g").attr("id", "highlightGridBorder");                  // all highlight grid borders
  var highlightLeftBorder = highlightGridBorder.append("g").attr("id", "highlightLeftBorder");  // horizontal highlight borders
  var highlightUpBorder = highlightGridBorder.append("g").attr("id", "highlightUpBorder");      // vertical highlight borders

  highlightLeftBorder.selectAll("rect")
    .data(nodes)
    .enter()
    .append("rect")
    .attr("class", (d) => {
      return "hBorderHighlightID" + d.employeeID;
    })
    .attr("height", squareSize)
    .attr("width", nodes.length * squareSize)
    .attr("x", textSpace)
    .attr("y", (d) => {
      return ((nodePositions[(d.employeeID).toString()] * squareSize) + textSpace);
    })
    .attr("fill", "none")
    .attr("stroke", "orange")
    .attr("stroke-width", strokeSize)
    .attr("pointer-events", "none")       // this removes event handling from the highlight border
    .style("visibility", "hidden");

  highlightUpBorder.selectAll("rect")
    .data(nodes)
    .enter()
    .append("rect")
    .attr("class", (d) => {
      return "vBorderHighlightID" + d.employeeID;
    })
    .attr("height", nodes.length * squareSize)
    .attr("width", squareSize)
    .attr("x", (d) => {
      return ((nodePositions[(d.employeeID).toString()] * squareSize) + textSpace);
    })
    .attr("y", textSpace)
    .attr("fill", "none")
    .attr("stroke", "orange")
    .attr("stroke-width", strokeSize)
    .attr("pointer-events", "none")       // this removes event handling from the highlight border
    .style("visibility", "hidden");

  // event handler for clicking on nodes
  text.selectAll("text")
    .on("click", function (e, d) {
      nodeEventHandler(e, d);
    })
    .on("mouseover", function (e, d) {
      if (e.shiftKey) {
        nodeEventHandler(e, d);
      }
    })

  // event handler for clicking on edges
  grid.selectAll("rect")
    .on("click", function (e, d) {
      edgeEventHandler(e, d);
    })
    .on("mouseover", function (e, d) {
      if (e.shiftKey) {
        edgeEventHandler(e, d);
      }

      var horizontal = d.source;
      var vertical = d.target;
      showLines(horizontal, vertical)
    })
    .on("mouseleave", function (e, d) {
      var horizontal = d.source;
      var vertical = d.target;

      hideLines(horizontal, vertical)
    });

  function updateHighlight() {

    // un-highlight nodes that are no longer highlighted in the NL diagram
    // slice creates a copy of localSelection, so that localSelection.splice doesn't interfere
    localSelection.slice().forEach((node) => {
      var index = globalSelection.indexOf(node);
      if (index === -1) {
        unHighlightNode(node)
        localSelection.splice(localSelection.indexOf(node), 1);

        // if a node is removed from the selection, but exactly one node remains, then highlight the neighbours of that node
        if (localSelection.length == 1) {
          highlightNeighbours(localSelection[0]);
        }

        // if no nodes are selected, then also remove neighbours
        if (localSelection.length == 0) {
          unHighlightText();
        }
      }
    });

    // highlight nodes that were highlighted in the NL diagram
    globalSelection.forEach((node) => {
      var index = localSelection.indexOf(node);
      if (index === -1) {
        localSelection.push(node);

        // if a new node is added to selection, and is the only node, then highlight its neighbours
        if (localSelection.length == 1) {
          highlightNeighbours(localSelection[0]);
        }

        // if a new node is added to selection, and now there are two nodes, then unhighlight the neighbours of the first node
        if (localSelection.length == 2) {
          unHighlightNeighbours(localSelection[0], localSelection[1]);
        }

        highlightNode(node);
      }
    });
  }

  // (visually) highlight a node
  function highlightNode(node) {
    let classSelect = ".hTextID" + node + ",.vTextID" + node;
    text.selectAll(classSelect).style("fill", "red");
    classSelect = ".hBorderHighlightID" + node + ",.vBorderHighlightID" + node + ",.hLineHighlightID" + node + ",.vLineHighlightID" + node;
    svg.selectAll(classSelect).style("visibility", "visible");
  }

  // (visually) unhighlight a node
  function unHighlightNode(node) {
    let classSelect = ".hTextID" + node + ",.vTextID" + node;
    text.selectAll(classSelect).style("fill", "white");
    classSelect = ".hBorderHighlightID" + node + ",.vBorderHighlightID" + node + ",.hLineHighlightID" + node + ",.vLineHighlightID" + node;
    svg.selectAll(classSelect).style("visibility", "hidden");
  }

  // show lines when mouse is inside edge
  function showLines(h, v) {
    svg.selectAll("rect.hLineHighlightID" + h).style("visibility", "visible");
    svg.selectAll("rect.vLineHighlightID" + v).style("visibility", "visible");
  }

  // hide lines when mouse leaves edge
  // local selection is used so that lines don't glich and remain on screen after the mouse leaves
  function hideLines(h, v) {
    if (localSelection.indexOf(h) === -1) {
      svg.selectAll("rect.hLineHighlightID" + h).style("visibility", "hidden");
    }

    if (localSelection.indexOf(v) === -1) {
      svg.selectAll("rect.vLineHighlightID" + v).style("visibility", "hidden");
    }
  }

  // (visually) highlight the neighbours of a node
  function highlightNeighbours(node) {
    edges.forEach((edge) => {

      // highlight vertical neighbour
      if (edge.source == node) {
        if (edge.target != node) {
          text.select(".vTextID" + edge.target).style("fill", "#90ee90");
        }
      }

      // highlight horizontal neighbour
      if (edge.target == node) {
        if (edge.source != node) {
          text.select(".hTextID" + edge.source).style("fill", "#90ee90");
        }
      }
    })
  }

  // (visually) unhighlight the neighbours of a node
  function unHighlightNeighbours(node1, node2) {
    edges.forEach((edge) => {

      // unhighlight vertical neighbour
      if (edge.source == node1) {
        if ((edge.target != node1) && (edge.target != node2)) {
          text.select(".vTextID" + edge.target).style("fill", "white");
        }
      }

      // unhighlight horizontal neighbour
      if (edge.target == node1) {
        if ((edge.source != node1) && (edge.source != node2)) {
          text.select(".hTextID" + edge.source).style("fill", "white");
        }
      }
    })
  }

  function unHighlightText() {
    text.selectAll("text").style("fill", "white");
  }

  // SS stands for single selection (called in an event when ctrl is not pressed)
  // MS stands for multiple selection (called in an event when ctrl is pressed)


  // single selection that changes the selection to the node clicked
  function nodeSS(node) {
    globalSelection.splice(0, globalSelection.length);
    globalSelection.push(node);
  }

  // multiple selection that toggles the node clicked
  function nodeMS(node) {
    var index = globalSelection.indexOf(node);
    if (index === -1) {
      globalSelection.push(node);
    } else {
      globalSelection.splice(index, 1);
    }
  }

  // single selection that changes the selection to the source id
  // or toggles to target id if only source id is already selected
  function edgeSS(node1, node2) {
    var index1 = globalSelection.indexOf(node1);
    var index2 = globalSelection.indexOf(node2);
    globalSelection.splice(0, globalSelection.length);

    if ((index1 !== -1) && (index2 === -1)) {
      globalSelection.push(node2);
    } else {
      globalSelection.push(node1);
    }
  }

  // multiple selection that toggles the node clicked
  function edgeMS(node1, node2) {
    var index1 = globalSelection.indexOf(node1);
    var index2 = globalSelection.indexOf(node2);

    if ((index1 !== -1) && (index2 !== -1)) {
      if (index1 > index2) {
        globalSelection.splice(index1, 1);
        globalSelection.splice(index2, 1);
      } else {
        globalSelection.splice(index2, 1);
        globalSelection.splice(index1, 1);
      }
    } else {
      if (index1 === -1) {
        globalSelection.push(node1);
      }

      if (index2 === -1) {
        globalSelection.push(node2);
      }
    }
  }

  function nodeEventHandler(e, d) {
    if (e.ctrlKey) {
      nodeMS(d.employeeID);
    } else {
      nodeSS(d.employeeID);
    }
  }

  function edgeEventHandler(e, d) {
    if (e.ctrlKey) {
      edgeMS(d.source, d.target);
    } else {
      edgeSS(d.source, d.target);
    }
  }

  setInterval(function () { updateHighlight(); }, 10);

}

export default generateMatrix