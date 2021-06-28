<template>
  <div id="theSidebar" class="sidebar">
    <a href="javascript:void(0)" class="closebtn" @click="closeBar">&times;</a>

    <div class="fileUpload">
      <input
        type="text"
        placeholder="Name of the Dataset"
        v-model="datasets.dataName"
        class="form-control"
      />
      <p id="msg"></p>
      <input type="file" accept=".csv" @change="selectFile" /><button
        @click="uploadFile"
      >
        Upload
      </button>
    </div>

    <div class="windowSelection">
      <h3>Node-Link Diagram Window</h3>
      <select id="testSelectNL">
        <option value="visLeft">Left</option>
        <option value="visRight">Right</option>
      </select>

      <h3>Adjacency Matrix Window</h3>
      <select id="testSelectAM">
        <option value="visRight">Right</option>
        <option value="visLeft">Left</option>
      </select>

      <!--
      <h3 class="type">Select visualisation type</h3>
      <select id="visType">
        <option value="nodelink">Node-Link Diagram</option>
        <option value="matrix">Adjacency Matrix</option>
      </select>
    </div>
    --></div>

    <div class="dataList">
      <ul id="list" class="column"></ul>
    </div>
  </div>

  <div class="sidebarButton">
    <button class="openbtn" @click="openBar">&#9776; Options</button>
  </div>

  <div class="visGrid">
    <div id="viscontent">
      <div id="visLeft"></div>
    </div>
    <div id="viscontent"><div id="visRight"></div></div>
  </div>
  <div class="sliderDiv">
    <input
      type="range"
      min="1"
      max="100"
      value="0"
      class="slider"
      id="range"
      style="display: none;"
      @input="showRangeValue"
      @change="update"
    />
    <p id="rangeValue"></p>
  </div>
</template>

<script>
import firebase from "firebase";
import * as d3 from "d3";
import { db } from "../main";
//import generateNetwork from "../visualisations/nodelink";
import generateMatrix from "../visualisations/adjacencymatrix";
import generateNetworkCanvas from "../visualisations/nodelinkv2.0";

var link = [];
var linkEntry = -1;
var visLink;
var minDate;
var maxDate;
var selectedNodes = [];

export default {
  name: "Home",
  components: {},
  data() {
    return {
      datasets: {
        fileLink: null,
        dataName: null,
      },
      selectedFile: null,
      datasetNo: 0,
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    };
  },
  mounted() {
    this.getAllDatabaseEntries(); //the mounted() lifecycle executes after all components of the page have finished loading, so after the page is ready
    // the previous uploaded datasets are visible in the page.
  },

  methods: {
    showRangeValue() {
      var x = document.getElementById("range").value;
      var dateValue = new Date(parseInt(x));

      var displayDate =
        this.months[dateValue.getMonth()] +
        " " +
        dateValue.getDate() +
        ", " +
        dateValue.getFullYear();

      document.getElementById("rangeValue").innerHTML = displayDate;
    },

    extractName(email) {
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
    },
    showDatabaseEntries(name) {
      var ul = document.getElementById("list");
      var header = document.createElement("h2");
      var _name = document.createElement("li");
      var _visualise = document.createElement("button");
      var help = linkEntry;
      header.innerHTML = "Dataset-" + ++this.datasetNo;
      _name.innerHTML = "Name of the dataset: " + name;
      _visualise.innerHTML = "Visualise";
      _visualise.onclick = async () => {
        visLink = link[help];
        console.log(visLink);
        console.log(link);
        document.getElementById("range").style.display = "inline"
        this.update()
        //this.animate()
      };
      ul.appendChild(header);
      ul.appendChild(_name);
      ul.appendChild(_visualise);
    },

    getAllDatabaseEntries() {
      db.collection("datasets")
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            linkEntry++;
            let name = doc.data().dataName;
            link[linkEntry] = doc.data().fileLink;
            this.showDatabaseEntries(name);
          });
        });
    },

    // async animate() {
    //   function sleep(ms) {
    //     return new Promise(
    //       resolve => setTimeout(resolve, ms)
    //     );
    //   }
    //   var skip = 7 // how many days per step
    //   for (var d = new Date(1999, 0, 1); d <= document.getElementById("range").max; d.setDate(d.getDate() + skip)) {
    //     document.getElementById("range").value = d.getTime()
    //     await this.update();
    //     await sleep(2000);
    //   }
    // },

    async update() {
      var visDiv = document.getElementById(
          document.getElementById("testSelectNL").value
        );
        visDiv.innerHTML = "";

        visDiv = document.getElementById(
          document.getElementById("testSelectAM").value
        );
        visDiv.innerHTML = "";
        const response = await fetch(visLink);
        var data = d3.csvParse(await response.text(), d3.autoType);

        var edges = [];
        var nodes = [];

        // "edgeWeights.weight[source][target]" can be used to get the weight of the source-target edge
        // "edgeWeights.maxWeight" is the largest edge weight in the dataset
        // this is used as an intermediary variable to calculate wEdges (weighted edges)
        var edgeWeights = {
          weight: {},
          maxWeight: 0,
        };

        // weighted edges (maybe we will replace edges with this, as it adds weights to edges and also should improve performance)
        // a copy is required since generateNetworkCanvas modifies the wEdges parameter
        var wEdges = [];
        var wEdgesCopy = [];

        // this function auto-executes whenever visualise is clicked
        // the purpose of this function is to calculate the minDate and the maxDate of the given dataset
        (function () {

          maxDate = new Date(-3155692597470);
          minDate = new Date(3155692597470);

          data.forEach((x) => {
            // check if current date is larger than maxDate
            if (x.date > maxDate) {
              maxDate = x.date;
            }

            // check if current date is smaller than minDate
            if (x.date < minDate) {
              minDate = x.date;
            }
          });

          document.getElementById("range").max = maxDate.getTime();
          document.getElementById("range").min = minDate.getTime();
          // document.getElementById("range").value = (maxDate.getTime()+minDate.getTime())/2;

        })();

        this.showRangeValue();  // display date right after pressing visualise

        data=data.filter((x) => {return x.date<=document.getElementById("range").value;});  // filter out datapoints given the slider

        data.forEach((x) => {
          var objNodesTo = {};
          var objNodesFrom = {};

          var index = nodes.findIndex((o) => o.employeeID == x.fromId);
          if (index === -1) {
            objNodesFrom["employeeID"] = x.fromId;
            objNodesFrom["email"] = x.fromEmail;
            objNodesFrom["name"]=this.extractName(x.fromEmail);
            objNodesFrom["jobTitle"] = x.fromJobtitle;
            nodes.push(objNodesFrom);

            // add missing node ID to edgeWeights
            edgeWeights.weight[x.fromId] = {};
          }

          var index2 = nodes.findIndex((o) => o.employeeID == x.toId);
          if (index2 === -1) {
            objNodesTo["employeeID"] = x.toId;
            objNodesTo["email"] = x.toEmail;
            objNodesTo["name"]=this.extractName(x.toEmail);
            objNodesTo["jobTitle"] = x.toJobtitle;
            nodes.push(objNodesTo);

            // add missing node ID to edgeWeights
            edgeWeights.weight[x.toId] = {};
          }

          // init current edge with weight 0
          edgeWeights.weight[x.fromId][x.toId] = 0;
          let temp = ++edgeWeights.weight[x.fromId][x.toId];

          if (temp > edgeWeights.maxWeight) {
            edgeWeights.maxWeight = temp;
          }
        });

        // calculate edgeWeight values
        data.forEach((x) => {
          let temp = ++edgeWeights.weight[x.fromId][x.toId];

          if (temp > edgeWeights.maxWeight) {
            edgeWeights.maxWeight = temp;
          }

          // add the edges to the edges array.
          var objEdges = {};
          objEdges["source"] = x.fromId;
          objEdges["target"] = x.toId;
          objEdges["sentiment"] = x.sentiment;
          objEdges["messageType"] = x.messageType;
          objEdges["date"] = x.date;
          objEdges["weight"] = edgeWeights.weight[x.fromId][x.toId];
          edges.push(objEdges);
        });

        // create array of weighted edges
        Object.keys(edgeWeights.weight).forEach((fromId) => {
          Object.keys(edgeWeights.weight[fromId]).forEach((toId) => {
            let objEdges = {};
            let objEdgesCopy = {};
            objEdges["source"] = parseInt(fromId);
            objEdges["target"] = parseInt(toId);
            objEdges["weight"] = edgeWeights.weight[fromId][toId];
            objEdgesCopy["source"] = parseInt(fromId);
            objEdgesCopy["target"] = parseInt(toId);
            objEdgesCopy["weight"] = edgeWeights.weight[fromId][toId];

            wEdges.push(objEdges);
            wEdgesCopy.push(objEdgesCopy);
          });
        });

        generateNetworkCanvas(wEdges, nodes, edgeWeights, selectedNodes);
        generateMatrix(wEdgesCopy, nodes, edgeWeights, selectedNodes);
    },

    openBar() {
      document.getElementById("theSidebar").style.width = "300px";
      document.getElementById("visLeft").style.marginLeft = "300px";
    },

    closeBar() {
      document.getElementById("theSidebar").style.width = "0";
      document.getElementById("visLeft").style.marginLeft = "0";
    },

    selectFile(event) {
      this.selectedFile = event.target.files[0]; //Selects the uploaded file and assigns it to the "selectedFile" variable.
      //TODO: Add proper checks to ensure that the files given are csv files.
    },

    uploadFile() {
      let fileName = `${this.selectedFile.name}`;
      var storageRef = firebase.storage().ref(fileName);
      let uploadTask = storageRef.put(this.selectedFile);
      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          //Handle unsuccessfull uploads.
          console.log(error);
        },
        () => {
          //Handle successfull uploads.
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.datasets.fileLink = downloadURL;
            this.saveDataToDB();
          });
        }
      );
    },

    saveDataToDB() {
      db.collection("datasets")
        .add(this.datasets)
        .then((docRef) => {
          var sucMsg = document.getElementById("msg");
          sucMsg.innerHTML = "The dataset has been uploaded successfully.";
          console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    },
  },
};
</script>

<style scoped>
.visGrid {
  overflow: hidden;
  position: absolute;
  display: grid;
  width: 100%;
  bottom: 0;
  top: 0;
  background-color: #3f3f3f;
  grid-template-columns: 1fr 1fr;
  color: white;
  z-index: -10;
  transition: margin-left 0.5s;
}

#viscontent {
  position: relative;
  height: 100%;
  width: 100%;
  transition: margin-left 0.5s;
  margin-top: 9%;
}

.sidebar {
  height: 100%;
  width: 0;
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  background-color: black;
  color: white;
  overflow-x: hidden;
  padding-top: 60px;
  transition: 0.5s; /* 0.5 second transition effect to slide in the sidebar */
  float: left;
}

.sidebar a:hover {
  color: #f1f1f1;
}

.sidebar .closebtn {
  position: absolute;
  top: 0;
  right: 25px;
  font-size: 35px;
  margin-left: 50px;
  padding: 8px;
  text-decoration: none;
  color: #818181;
  display: block;
  transition: 0.3s;
}

.openbtn {
  font-size: 20px;
  cursor: pointer;
  background-color: black;
  color: white;
  padding: 10px 15px;
  border: none;
}

.openbtn:hover {
  color: black;
  background-color: #42b983;
  transition: 0.3s;
}

.sidebarButton {
  position: absolute;
  transition: margin-left 0.5s;
  text-align: left;
  z-index: 1;
}

.dataList {
  height: 50%;
  overflow-y: auto;
}

.fileUpload {
  border-bottom: 2px solid white;
}

.windowSelection {
  padding: 30px;
  border-bottom: 2px solid white;
}

.type {
  margin-top: 0.5cm;
}

#visLeft {
  transition: margin-left 0.5s;
  border-right: 3px solid white;
}

#visRight {
  transition: margin-left 0.5s;
}

.sliderDiv {
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: #2c3e50;
  height: 40px;
}

.slider {
  width: 80%;
}

#rangeValue {
  color: white;
}
</style>
