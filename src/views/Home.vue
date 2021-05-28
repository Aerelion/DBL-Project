<template>
  <div class="test">
    <div class="side">
      <Sidebar/>
    </div>
    <div class="visGrid">
      <div id="visLeft">
      </div>

      <div id="visRight">
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from './Sidebar.vue'
import firebase from 'firebase';
import * as d3 from 'd3';
import {db} from '../main'

export default {
  name: 'Home',
  components: {
    Sidebar
  },
    data () {
      return {
        datasets: {
          fileLink: null,
          dataName: null,
        },
          selectedFile: null,
          datasetNo: 0
      }
  },
  mounted() {
    this.getAllDatabaseEntries(); //the mounted() lifecycle executes after all components of the page have finished loading, so after the page is ready
                                  // the previous uploaded datasets are visible in the page.
  },
  methods: {
      selectFile(event) {
          this.selectedFile = event.target.files[0] //Selects the uploaded file and assigns it to the "selectedFile" variable.
          //TODO: Add proper checks to ensure that the files given are csv files.
      },
      uploadFile() {
          let fileName = `${this.selectedFile.name}`;
          var storageRef = firebase.storage().ref(fileName);
          let uploadTask = storageRef.put(this.selectedFile);
          uploadTask.on('state_changed',() => {
          }, (error) => {
            //Handle unsuccessfull uploads.
            console.log(error);
          }, () => {
            //Handle successfull uploads.
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              this.datasets.fileLink = downloadURL;
              this.saveDataToDB();
            })
          })
          },
      saveDataToDB() {
          db.collection("datasets").add(this.datasets).then((docRef) => {
            var sucMsg = document.getElementById("msg")
            sucMsg.innerHTML = "The dataset has been uploaded successfully."
            console.log("Document written with ID: ", docRef.id);
          })
          .catch( (error) => {
            console.error("Error adding document: ", error);
          })
          },
      showDatabaseEntries(name, link) {
          var ul = document.getElementById('list');
          var header = document.createElement('h2');
          var _name = document.createElement('li');
          var _visualise = document.createElement('button');
          var visDiv = document.getElementById('visRight');
         // var testParaghraph = document.createElement("h2");
          header.innerHTML = "Dataset-"+ (++this.datasetNo);
          _name.innerHTML="Name of the dataset: "+name;
          _visualise.innerHTML = "Visualise";
          _visualise.onclick = async () => {
            visDiv.innerHTML="";
            const response = await fetch(link);
            const data = d3.csvParse(await response.text(), d3.autoType);
            var edges = [];
            var nodes = [];
            //console.log(data);
            data.forEach((x) => {
              var objEdges = {}
              objEdges["source"] = x.fromId;
              objEdges["target"] = x.toId;
              edges.push(objEdges);
              var objNodesTo = {}
              var objNodesFrom = {}
              var index = nodes.findIndex(o => o.employeeID == x.fromId)
              if(index === -1) {
                objNodesFrom["employeeID"] = x.fromId;
                nodes.push(objNodesFrom);
              }
              var index2 = nodes.findIndex(o => o.employeeID == x.toId)
              if(index2 === -1) {
                objNodesTo["employeeID"] = x.toId;
                nodes.push(objNodesTo);
              }
            })
            console.log(edges);
            console.log(nodes);
            this.generateNetwork(edges, nodes);
          }
          ul.appendChild(header);
          ul.appendChild(_name);
          ul.appendChild(_visualise);
        },
      getAllDatabaseEntries() {
          db.collection('datasets').get().then((snapshot) => {
            snapshot.forEach((doc) => {
              let name = doc.data().dataName;
              let link = doc.data().fileLink;
              this.showDatabaseEntries(name, link);
            }
            )
          }
          )
        },
    generateNetwork(edges, nodes) {
      var w = 0.5 * window.innerWidth;
      var h = 0.85 * window.innerHeight;

      var svg = d3
        .select("#visRight")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .style("background", "black")
        .call(d3.zoom().on('zoom', (event) => {
            svg.attr('transform', event.transform).scaleExtent([1,24]);}))
        .append('g');
      
      var simulation = d3.forceSimulation(nodes)
          .force("charge", d3.forceManyBody().strength(-50))
          .force("link", d3.forceLink().id(function (d) {return d.employeeID;}).links(edges))
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
          .attr("fill", function() {return "blue";})
          //.call(dragNodes(simulation));
        
        function ticked() {
          edge
            .attr("x1", function(d) {
              return d.source.x;
            })
            .attr("y1", function(d) {
              return d.source.y;
            })
            .attr("x2", function(d) {
              return d.target.x;
            })
            .attr("y2", function(d) {
              return d.target.y;
            });
            
            node
              .attr("cx", function(d) {
              return d.x;
            })
              .attr("cy", function(d) {
              return d.y;
            });
        }
        /*function dragNodes(simulation) { // This needs a lot more optimization, so it is being left out for the prototype.
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
        }*/
      console.log(simulation)
      return svg.node();
}
/*generateNetworkWithCanvas(edges, nodes) { //Trying to optimize by using a canvas instead of svg, should improve performance of the full dataset quite a bit, but just testing atm. Not included in the prototype.
      var w = 1000;
      var h = 600;
      var r = 5;

      var htmlCanvas = d3
        .select("#vis")
        .append("canvas")
        .attr("width", w)
        .attr("height", h)
        .style("background", "black");
      
      var canvasToolbox = htmlCanvas.node().getContext('2d'); //Canvas toolbox, it is an object carrying all the properties and methods we need to draw on the canvas.
      
      //var div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
      
      var simulation = d3.forceSimulation(nodes)
          .force("charge", d3.forceManyBody().strength(-30))
          .force("x", d3.forceX(w / 2).strength(0.1))
          .force("y", d3.forceY(h / 2).strength(0.1))
          .force("link", d3.forceLink().id(function (d) {return d.employeeID;}).links(edges))
          .force("center", d3.forceCenter(w / 2, h / 2));
      
      var transform = d3.zoomIdentity;

      initGraph(edges, nodes);

      function initGraph(edges, nodes) {
        
        function zoomed(event) {
          console.log("zooming");
          transform = event.transform;
          ticked()
        }
        console.log("Hello")
        d3.select(htmlCanvas)
            .call(d3.drag().subject(dragsubject).on("start", dragStarted).on("drag", dragged).on("end",dragEnded))
            .call(d3.zoom().scaleExtent([1 / 10, 8]).on("zoom", zoomed));
        
        function dragsubject(event) {
          var i,
          x = transform.invertX(event.x),
          y = transform.invertY(event.y),
          dx,
          dy;
          for (i = nodes.length - 1; i >= 0; --i) {
            var node = nodes[i];
            dx = x - node.x;
            dy = y - node.y;

            if (dx * dx + dy * dy < r * r) {

              node.x =  transform.applyX(node.x);
              node.y = transform.applyY(node.y);

              return node;
            }
          }
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
          simulation.nodes(nodes).on('tick', ticked);
          simulation.force("link").links(edges);
          
          function ticked() {
          canvasToolbox.save();
          canvasToolbox.clearRect(0, 0, w, h);
          canvasToolbox.translate(transform.x, transform.y);
          canvasToolbox.scale(transform.k, transform.k);

          edges.forEach(function (d) {
            canvasToolbox.beginPath();
            canvasToolbox.moveTo(d.source.x, d.source.y);
            canvasToolbox.lineTo(d.target.x, d.target.y);
            canvasToolbox.stroke();
          });
          nodes.forEach(function (d) {
            canvasToolbox.beginPath();
            canvasToolbox.arc(d.x, d.y, r, 0, 2 * Math.PI, true);
            canvasToolbox.fillStyle = d.col ? "red":"black"
            canvasToolbox.fill();
          });
          canvasToolbox.restore();
        }

      }
}*/
}
}

</script>

<style scoped>
  .visGrid {
    position: absolute;
    display: grid;
    width: 100%;
    height: 90.5%;
    background-color: #3f3f3f;
    grid-template-columns: 1fr 1fr;
    color: white;
    z-index: -10;
    transition: margin-left .5s;
  }
  
  .side {
    position: absolute;
  }

  #visLeft {
    border-right: 3px solid white;
    transition: margin-left .5s;
  }

  #visRight {
    transition: margin-left .5s;
  }
</style>
