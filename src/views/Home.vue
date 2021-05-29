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

    <!-- Does not do anything yet -> link with js function to select either viscontent or viscontent2 -->
    <div class="windowSelection">
      <h3>Select visualisation window</h3>
      <select id="testSelect">
        <option value="Left">Left</option>
        <option value="Right">Right</option>
      </select>
    </div>

    <div class="dataList">
      <ul id="list" class="column"></ul>
    </div>
  </div>

  <div class="sidebarButton">
    <button class="openbtn" @click="openBar">&#9776; Options</button>
  </div>

  <div class="visGrid">
    <div id="visLeft"></div>

    <div id="visRight"></div>
  </div>
</template>

<script>
import firebase from "firebase";
import * as d3 from "d3";
import { db } from "../main";
import generateNetwork from "../visualisations/nodelink";

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
    };
  },
  mounted() {
    this.getAllDatabaseEntries(); //the mounted() lifecycle executes after all components of the page have finished loading, so after the page is ready
    // the previous uploaded datasets are visible in the page.
  },
  methods: {
    showDatabaseEntries(name, link) {
      var ul = document.getElementById("list");
      var header = document.createElement("h2");
      var _name = document.createElement("li");
      var _visualise = document.createElement("button");
      var visDiv = document.getElementById("visLeft");
      header.innerHTML = "Dataset-" + ++this.datasetNo;
      _name.innerHTML = "Name of the dataset: " + name;
      _visualise.innerHTML = "Visualise";
      _visualise.onclick = async () => {
        visDiv.innerHTML = "";
        const response = await fetch(link);
        const data = d3.csvParse(await response.text(), d3.autoType);
        var edges = [];
        var nodes = [];
        //console.log(data);
        data.forEach((x) => {
          var objEdges = {};
          objEdges["source"] = x.fromId;
          objEdges["target"] = x.toId;
          edges.push(objEdges);
          var objNodesTo = {};
          var objNodesFrom = {};
          var index = nodes.findIndex((o) => o.employeeID == x.fromId);
          if (index === -1) {
            objNodesFrom["employeeID"] = x.fromId;
            nodes.push(objNodesFrom);
          }
          var index2 = nodes.findIndex((o) => o.employeeID == x.toId);
          if (index2 === -1) {
            objNodesTo["employeeID"] = x.toId;
            nodes.push(objNodesTo);
          }
        });
        console.log(edges);
        console.log(nodes);
        generateNetwork(edges, nodes);
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
            let name = doc.data().dataName;
            let link = doc.data().fileLink;
            this.showDatabaseEntries(name, link);
          });
        });
    },
    /* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
    openBar() {
      document.getElementById("theSidebar").style.width = "300px";
      document.getElementById("viscontent").style.marginLeft = "300px";
    },

    /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
    closeBar() {
      document.getElementById("theSidebar").style.width = "0";
      document.getElementById("viscontent").style.marginLeft = "0";
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
  position: absolute;
  display: grid;
  width: 100%;
  height: 90%;
  background-color: #3f3f3f;
  grid-template-columns: 1fr 1fr;
  color: white;
  z-index: -10;
}

/* Style page content - use this if you want to push the page content to the right when you open the side navigation */
#main {
  transition: margin-left 0.5s; /* If you want a transition effect */
  padding: 100px;
}

#viscontent {
  border-right: 3px solid white;
  height: 100%;
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
  font-size: 36px;
  margin-left: 50px;
  padding: 8px 8px 8px 32px;
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
}

/* Push page content to the right */
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

/* On smaller screens, where height is less than 450px, change the style of the sidenav (less padding and a smaller font size) */
@media screen and (max-height: 450px) {
  .sidebar {
    padding-top: 15px;
  }
  .sidebar a {
    font-size: 18px;
  }
}
</style>
