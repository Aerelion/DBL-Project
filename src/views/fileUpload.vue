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
            var array = [];
            data.columns.forEach((hello) => {
              var obj = {}
              obj["property"] = hello;
              obj["value"] = hello.length;
              array.push(obj)
            })
            //testParaghraph.innerHTML = data.columns.length;
            //visDiv.appendChild(testParaghraph);
            this.generateArc(array);
            console.log(array);
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
        generateArc(array) {
      var w = 500;
      var h = 500;
      var colors = d3.scaleOrdinal(d3.schemeDark2);
      //var margin = 45;

      //var radius = Math.min(w, h) / 2 - margin

      var svg = d3
        .select("#vis")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .style("background", "black");

      var data = d3.pie().sort(null).value(function(d){return d.value})(array);
      var arcs = d3.arc()
                    .innerRadius(0)
                    .outerRadius(200)
                    .padAngle(.05)
                    .padRadius(50);
      var pies = svg.append("g").attr("transform", "translate(250, 250)")
                               .selectAll("path").data(data);
      pies.enter().append("path").attr("d", arcs).attr("fill", function(d){return colors(d.data.value);});
}
}
}
</script>
<style scoped>
  ul{
    list-style-type: none;
  }
</style>

