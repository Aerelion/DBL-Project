import * as d3 from "d3";



function generateNetworkCanvas(edges, nodes, selectedNode) {
    var side = document.getElementById(document.getElementById("testSelectNL").value);
    var canvas = document.createElement('canvas');
    var w = document.getElementById("viscontent").clientWidth;
    var h = document.getElementById("viscontent").clientHeight;

    canvas.width = w;
    canvas.height = h;

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
            .strength(-50)
            .distanceMax(200))
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
    .on("tick", ticked);

    function ticked() {
        ctx.clearRect(0,0, canvas.width, canvas.height);
        ctx.translate(transform.x, transform.y);
        ctx.scale(transform.k, transform.k);

        var neighbours = drawEdges(edges);

        for (const node of nodes) {
            constrainNode(node);
            // Change selected node to stand out
            if (node.employeeID == selectedNode[0]) {
                ctx.strokeStyle = "#000";
                ctx.fillStyle = "#ff0000";
            } else if (neighbours.indexOf(node) >= 0) {
                ctx.strokeStyle = "#000";
                ctx.fillStyle = "#00ff00";
            } else {
                ctx.strokeStyle = "#fff";
                ctx.fillStyle = "#000";
            }
            ctx.beginPath();
            drawNode(node) 
            ctx.fillStyle = color(node);
            ctx.fill();
            ctx.stroke();
        }
        drawSelectionInformation(selectedNode[0]);
    }

    
    function constrainNode(node) {
        node.x = Math.min(w-6, Math.max(2, node.x));
        node.y = Math.min(h-130, Math.max(2, node.y));
    } 

    function drawEdges(edges) {
        var selectionEdges = [];
        var normalEdges = [];
        var neighbours = [];
        if (selectedNode[0] == null) {
            ctx.beginPath();
            edges.forEach(drawEdge);
            ctx.strokeStyle = "#aaa";
            ctx.stroke();
        } else {
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
            ctx.beginPath();
            normalEdges.forEach(drawEdge);
            ctx.strokeStyle = "#aaa";
            ctx.stroke();

            ctx.beginPath();
            selectionEdges.forEach(drawEdge);
            ctx.strokeStyle = "#f58a2c";
            ctx.stroke();
        }

        return neighbours;
    }

    function drawEdge(d) {
        ctx.moveTo(d.source.x, d.source.y);
        ctx.lineTo(d.target.x, d.target.y);
        //ctx.fillText(d.sentiment, ((d.source.x + d.target.x) / 2) + 10 , ((d.source.y + d.target.y) / 2) + 3);
        //console.log(d.sentiment)
    }

    function drawNode(d) {
        ctx.moveTo(d.x, d.y);
        ctx.arc(d.x, d.y, 3, 0, 2 * Math.PI);
        //ctx.fillText("ID: " + d.employeeID, d.x+10, d.y+3);
    }

    function drawSelectionInformation(id) {
        for (const node of nodes) {
            if (id == node.employeeID) {
                drawNodeInformation(node);
                break;
            }
        }
    }
    function drawNodeInformation(d) {
        if (d != null) {
            var popupX = d.x + 10;
            var popupY = d.y + 10;
            var popupSize = ctx.measureText(d.email).width + 4;
            ctx.fillStyle = "#fff";
            ctx.fillRect(popupX, popupY, popupSize, 36);

            ctx.strokeStyle = "#000"
            ctx.strokeRect(popupX, popupY, popupSize, 36);
            ctx.fillStyle = "#000";
            ctx.fillText(d.name + " | " + d.employeeID, popupX + 2, popupY + 10);
            ctx.fillText(d.jobTitle, popupX + 2, popupY + 20);
            ctx.fillText(d.email, popupX + 2, popupY + 30);
        }
    }

    function color() {
        var scale = d3.scaleOrdinal(d3.schemeCategory10);
        return d => scale(d.group);
    }
    

    function zooming(event) {
      transform = event.transform;
      ticked();
    }

    function onClick(event) {
        console.log(event.subject);
        selectedNode[0] = event.subject.employeeID;
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

    console.log(zooming);
    
    return d3.select(ctx.canvas).call(dragNodes(simulation)).node();
}


export default generateNetworkCanvas