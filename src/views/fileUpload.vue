<template>
  <div class="fileupload" v-bind:style="{display:grid}">
    <h1>File Upload Page</h1>
    <input type="text" placeholder="Name of the Dataset" v-model=datasets.dataName class="form-control">
    <p id="msg"></p><br><br>
    <input type="file" accept=".csv" @change="selectFile"><button @click="uploadFile">Upload</button><br><br>
    <ul id="list"> </ul>
  </div><br><br>
  <div id="vis"></div>
</template>

<script>
import firebase from 'firebase';
import * as d3 from 'd3';
import {db} from '../main'

export default {
  name: 'fileUpload',
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
          uploadTask.on('state_changed', () => {
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
          var visDiv = document.getElementById('vis');
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
            //testParaghraph.innerHTML = data.columns.length;
            //visDiv.appendChild(testParaghraph);
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
      var w = 500;
      var h = 500;

      var svg = d3
        .select("#vis")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .style("background", "black");
      
      var simulation = d3.forceSimulation(nodes)
          .force("charge", d3.forceManyBody().strength(-5))
          .force("link", d3.forceLink().id(function (d) {return d.employeeID;}).links(edges))
          .force("center", d3.forceCenter(w / 2, h / 2))
          .on("end", ticked);

        var link = svg
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
          .enter()
          .append("circle")
          .attr("r", 5)
          .attr("fill", function() {return "red";});
        
        function ticked() {
          link
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
        console.log(simulation);
}
}
}


</script>
<style scoped>
  ul{
    list-style-type: none;
  }
  .edges line {
      stroke: rgb(255, 255, 255);
      stroke-opacity: 0.6;
    }

    .nodes circle {
      stroke: rgb(255, 255, 255);
      stroke-width: 1.5px;
    }
</style>