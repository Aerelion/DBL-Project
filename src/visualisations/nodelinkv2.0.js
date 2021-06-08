import * as d3 from "d3";


function generateNetworkCanvas(edges, nodes, canvas) {
    var side = document.getElementById("testSelect").value;
    var w = document.getElementById("viscontent").clientWidth;
    var h = document.getElementById("viscontent").clientHeight;

    canvas = document.getElementById(side);
    canvas.width = w;
    canvas.height = h;
    console.log(edges)
    console.log(nodes)

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
        edges.forEach(drawEdge);
        ctx.strokeStyle = "#aaa";
        ctx.stroke();

        ctx.strokeStyle = "#fff";
        for (const node of nodes) {
        ctx.beginPath();
        drawNode(node) 
        ctx.fillStyle = color(node);
        ctx.fill();
        ctx.stroke();
        }
        //drawText()
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
        ctx.fillText("ID: " + d.employeeID, d.x+10, d.y+3);
    }

    /*function drawText(d) {
      ctx.strokeRect(w-210, 10, 200, 100);
      ctx.fillText(d.employeeID, (w-210) + 10, 10+3)
      

    }
console.log(drawText)*/
    function color() {
        var scale = d3.scaleOrdinal(d3.schemeCategory10);
        return d => scale(d.group);
    }
    

    function zooming(event) {
      transform = event.transform;
      ticked();
    }

    function dragNodes(simulation) {
        function dragSubject(event) {
            return simulation.find(event.x, event.y);
        }

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
            .subject(dragSubject)
            .on("start", dragStarted)
            .on("drag", dragged)
            .on("end", dragEnded);
      }
    console.log(zooming)
    return d3.select(ctx.canvas).call(dragNodes(simulation)).on("click", function() {d3.select(this).style("stroke", "red"); console.log(d3.select(this))}).node();
}


export default generateNetworkCanvas