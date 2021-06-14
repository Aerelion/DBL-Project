import * as d3 from "d3";


function generateNetworkCanvas(edges, nodes, canvas, selection) {
    var side = document.getElementById("testSelect").value;
    var w = document.getElementById("viscontent").clientWidth;
    var h = document.getElementById("viscontent").clientHeight;

    canvas = document.getElementById(side);
    canvas.width = w;
    canvas.height = h;
    console.log(edges);
    console.log(nodes);

    var ctx = canvas.getContext("2d");
    ctx.strokeStyle = "red"
    

    var transform = d3.zoomIdentity;
    
    var simulation = d3 //done
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
    .on("tick", ticked);

    function ticked() {
        ctx.clearRect(0,0, canvas.width, canvas.height);
        ctx.translate(transform.x, transform.y);
        ctx.scale(transform.k, transform.k);
        ctx.beginPath();
        ctx.lineWidth = 1;
        edges.forEach(drawEdge);
        ctx.strokeStyle = "#aaa";
        ctx.stroke();

        ctx.strokeStyle = "#fff";
        for (const node of nodes) {
            // Change selected node to stand out
            if (node == selection) {
                ctx.strokeStyle = "#000";
                ctx.fillStyle = "#ff0000";
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
        drawNodeInformation(selection)
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
            ctx.fillText(extractName(d.email) + " | " + d.employeeID, popupX + 2, popupY + 10);
            ctx.fillText(d.jobTitle, popupX + 2, popupY + 20);
            ctx.fillText(d.email, popupX + 2, popupY + 30);
        }
    }

    function extractName(email) {
        // Splice off the email server
        var nameBuilder = email.substring(0, email.indexOf("@"));
        // Split mail into seperate names
        nameBuilder = nameBuilder.split(".");
        // Initialize surnames and capitalize
        var name = "";
        for (var i = 0; i < nameBuilder.length; i++) {
            if (nameBuilder[i] != null && nameBuilder[i].length > 0) {
                if (i < nameBuilder.length-1) {
                    name = name + nameBuilder[i][0].toUpperCase() + ".";
                } else {
                    name = name + " " + nameBuilder[i][0].toUpperCase() + nameBuilder[i].substring(1);
                }
            }
        }
        return name
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
        selection = event.subject;
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

    console.log(zooming)
    return d3.select(ctx.canvas).call(dragNodes(simulation)).node();
}


export default generateNetworkCanvas