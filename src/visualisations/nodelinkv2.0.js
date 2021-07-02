import * as d3 from "d3";



function generateNetworkCanvas(edges, nodes, edgeWeights, selectedNode, updateCounter) {
    var heartBeatInterval;
    var updateID;
    var side = document.getElementById(document.getElementById("testSelectNL").value);
    var canvas = document.createElement('canvas');
    var w = document.getElementById("viscontent").clientWidth;
    var h = document.getElementById("viscontent").clientHeight;
    h = h*0.80 + 5
    var oldSelection = null;
    var oldSelectionSize = 0;

    var simplifiedEdges = [];
    for (const oldEdge of edges) {
        var isNew = true;
        if (simplifiedEdges.length > 0) {
            for (const edge of simplifiedEdges) {
                if (edge.source == oldEdge.target && edge.target == oldEdge.source) {
                    edge.weight = (edge.weight + oldEdge.weight);
                    edge.sentiment = (edge.sentiment + oldEdge.sentiment) / 2;
                    isNew = false;
                }
            }
        }
        if (isNew) {
            simplifiedEdges.push(oldEdge);
        }
    }
    for (const edge of simplifiedEdges) {
        var sentiment = edge.sentiment * (1 / 0.025);
        var hue = Math.min(Math.max(-1, sentiment),1)*0.599*100 + 60;
        var saturation = Math.min(1, Math.max(0.2, Math.abs(sentiment*1.5)));
        var lightness = Math.max(0.5, Math.min(0.8, 1 - Math.abs(sentiment*1.2)));
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
        edge["color"] = "#" + ((1 << 24) + (Math.floor(r) << 16) + (Math.floor(g) << 8) + Math.floor(b)).toString(16).slice(1);
    }

    const minWidth = 0.1;                                                              // width of an edge with weight 1
    const maxWidth = 1;                                                                // width of largest edge
    const logCoefficient = (maxWidth - minWidth) / Math.log10(edgeWeights.maxWeight); 
    const logCoefficient2 = (10 - minWidth) / Math.log2(edgeWeights.maxWeight); // coeficient that is used to calculate opacity

    if (updateCounter[0] != null) {
        updateID = updateCounter[0];
    } else {
        updateID = 0;
    }

    canvas.id = "NLCanvas";
    canvas.width = w;
    canvas.height = h;
    // Creates a circle bound with diameter of the smallest of either the width or height of the window.
    var boundDistance = Math.min(w / 2, h / 2);
    var boundDistanceSquared = Math.pow(boundDistance, 2);

    side.appendChild(canvas);

    var ctx = canvas.getContext("2d");
    ctx.strokeStyle = "red"
    ctx.lineWidth = 0.1;

    var transform = d3.zoomIdentity;

    var simulation = d3 //done
        .forceSimulation(nodes)
        .force(
            "charge",
            d3.forceManyBody()
                .strength(-20)
                .distanceMax(boundDistance * 0.5))
        .force(
            "link",
            d3
                .forceLink()
                .id(function (d) {
                    return d.employeeID;
                })
                .links(simplifiedEdges)
                .strength(function (edge) {
                    return ((Math.log2(edge.weight) * logCoefficient2) + minWidth) / edgeWeights.maxWeight;
                })
        )
        .force("center", 
            d3
                .forceCenter(w / 2, h / 2))
        .on("tick", ticked);

    function ticked() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(transform.x, transform.y);
        ctx.scale(transform.k, transform.k);

        var neighbours = prepareEdges(simplifiedEdges);
        for (const node of nodes) {
            constrainNode(node);
            // Change selected node to stand out
            if (selectedNode.includes(node.employeeID)) {
                ctx.strokeStyle = "#000";
                ctx.fillStyle = "#ff0000";
            } else if (neighbours.includes(node) && selectedNode.length <= 1) {
                ctx.strokeStyle = "#000";
                ctx.fillStyle = "#00ff00";
            } else {
                ctx.strokeStyle = "#fff";
                ctx.fillStyle = "#000";
            }
            if (selectedNode.includes(node.employeeID) || selectedNode.length <= 1) {
                drawNode(node);
            }
        }
        drawSelectionInformation(neighbours);
    }


    function constrainNode(node) {
        var distanceFromCenterSquared = Math.pow(node.x - w / 2, 2) + Math.pow(node.y - h / 2, 2);
        if (distanceFromCenterSquared > boundDistanceSquared) {
            var distanceFromCenter = Math.sqrt(distanceFromCenterSquared);
            node.x = ((node.x - w / 2) / distanceFromCenter) * boundDistance + w / 2;
            node.y = ((node.y - h / 2) / distanceFromCenter) * boundDistance + h / 2;
        }
        //node.x = Math.min(w-6, Math.max(2, node.x));
        //node.y = Math.min(h-130, Math.max(2, node.y));
    }

    function prepareEdges(edges) {
        var selectionEdges = [];
        var normalEdges = [];
        var neighbours = [];

        if (selectedNode[0] == null) { // No selection, draw all edges normally
            drawAllEdges(edges, '#aaa');
        } else if (selectedNode[1] == null) { // 1 selection, draw connected edges and mark neighbouring nodes.
            for (const edge of edges) {
                if (edge.source.employeeID == selectedNode[0]) {
                    selectionEdges.push(edge);
                    neighbours.push(edge.target);
                } else if (edge.target.employeeID == selectedNode[0]) {
                    selectionEdges.push(edge);
                    neighbours.push(edge.source);
                } else {
                    normalEdges.push(edge);
                }
            }
            drawAllEdges(normalEdges, '#aaa');

            drawAllEdges(selectionEdges, '#f58a2c');
        } else { // 2 or more selections, mark edges between selected nodes.
            for (const edge of edges) {
                var fromSelection = selectedNode.includes(edge.source.employeeID);
                var toSelection = selectedNode.includes(edge.target.employeeID);
                if (fromSelection && toSelection) {
                    selectionEdges.push(edge);
                } else if (fromSelection) {
                    neighbours.push(edge.target);
                    normalEdges.push(edge);
                } else if (toSelection) {
                    neighbours.push(edge.source);
                    normalEdges.push(edge);
                } else {
                    normalEdges.push(edge);
                }
            }
            //drawAllEdges(normalEdges, '#aaa');

            drawAllEdges(selectionEdges, "Sentiment");
        }

        return neighbours;
    }

    function drawAllEdges(edges, strokeColor) {
        if (strokeColor[0] == "#") {
            ctx.strokeStyle = strokeColor;
            edges.forEach(drawEdge);
        } else {
            edges.forEach(edge => {
                ctx.strokeStyle = edge.color;
                drawEdge(edge)
            });
        }
    }

    function drawEdge(d) {
        ctx.beginPath();
        ctx.moveTo(d.source.x, d.source.y);
        ctx.lineTo(d.target.x, d.target.y);
        ctx.lineWidth=(Math.log10(d.weight) * logCoefficient) + minWidth;
        // ctx.lineWidth = d.weight / edgeWeights.maxWeight;
        ctx.stroke();
        //ctx.fillText(d.sentiment, ((d.source.x + d.target.x) / 2) + 10 , ((d.source.y + d.target.y) / 2) + 3);
    }

    function drawNode(d) {
        ctx.beginPath();
        ctx.lineWidth = 0.25;
        ctx.moveTo(d.x, d.y);
        ctx.arc(d.x, d.y, 3, 0, 2 * Math.PI);
        ctx.fillStyle = color(d);
        ctx.fill();
        ctx.stroke();
        //ctx.fillText("ID: " + d.employeeID, d.x+10, d.y+3);
    }

    function drawSelectionInformation(neighbours) {
        for (const node of nodes) {
            if (selectedNode.includes(node.employeeID)) {
                if (selectedNode.length == 1) {
                    drawNodeInformation(node, "Full");
                } else if (selectedNode.length > 1) {
                    drawNodeInformation(node, "Short");
                }
            } else if (neighbours.includes(node)) {
                if (selectedNode.length == 1) {
                    drawNodeInformation(node, "Short");
                }
            }
        }
    }
    function drawNodeInformation(d, type) {
        if (d != null) {
            var popupX, popupY;
            var popupSize, popupHeight;
            if (type == "Full") {
                popupX = d.x + 6;
                popupY = d.y + 6;
                popupSize = ctx.measureText(d.email).width + 4;
                popupHeight = 36;
            } else if (type == "Short") {
                popupX = d.x + 3;
                popupY = d.y + 3;
                popupSize = ctx.measureText(Math.max(d.jobTitle, d.name));
                popupHeight = 26;
            } else {
                console.log("Unkown dataframe type specified");
            }
            ctx.fillStyle = "#fff";
            ctx.fillRect(popupX, popupY, popupSize, popupHeight);
            ctx.strokeStyle = "#000"
            ctx.strokeRect(popupX, popupY, popupSize, popupHeight);

            if (type == "Full") {
                ctx.fillStyle = '#000';
                ctx.fillText(d.name + " | " + d.employeeID, popupX + 2, popupY + 10);
                ctx.fillText(d.jobTitle, popupX + 2, popupY + 20);
                ctx.fillText(d.email, popupX + 2, popupY + 30);
            } else if (type == "Short") {
                ctx.fillStyle = "#fff";
                ctx.fillText(d.name, popupX + 2, popupY + 10);
                ctx.fillText(d.jobTitle, popupX + 2, popupY + 20);
            }
            
        }
    }

    function color() {
        var scale = d3.scaleOrdinal(d3.schemeCategory10);
        return d => scale(d.group);
    }

    //Update loop seperate from the tick function, thus not controlled by D3
    function heartBeat() {
         if (simulation.alpha() < 0.01 && (oldSelection != selectedNode[0] || oldSelectionSize != selectedNode.length)) {
             simulation.alpha(0.004).restart();
             oldSelection = selectedNode[0];
             oldSelectionSize = selectedNode.length;
         }
         if (updateCounter[0] != updateID) {
            simulation.stop();
            simulation = null;
            clearInterval(heartBeatInterval);
         }
    }


    function onClick(event) {
        if (selectedNode.length <= 1) {
            selectedNode[0] = event.subject.employeeID;
        }
    }

    function dragNodes(simulation) {
        function dragSubject(event) {
            return simulation.find(event.x, event.y);
        }

        // Use dragStart event to hack in clickability in HTML canvas
        function dragStarted(event) {
            onClick(event);

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
            .subject(dragSubject)
            .on("start", dragStarted)
            .on("drag", dragged)
            .on("end", dragEnded)
    }

    heartBeatInterval = setInterval(function () { heartBeat(); }, 50); // Check for updates every 500 ms
    simulation.alphaDecay(0.0025).alpha(1).restart();
    return d3.select(ctx.canvas).call(dragNodes(simulation)).node();
}


export default generateNetworkCanvas