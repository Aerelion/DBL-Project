<template>
    <div id="theSidebar" class="sidebar">
        <a href="javascript:void(0)" class="closebtn" @click="closeBar">&times;</a>

        <div class="fileUpload">
          <input type="text" placeholder="Name of the Dataset">
          <p id="msg"></p>
          <input type="file" accept=".csv" @change="selectFile"><button @click="uploadFile">Upload</button>
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
          <ul id="list" class="column"> </ul>
        </div>

    </div>

    <div class="sidebarButton">
        <button class="openbtn" @click="openBar">&#9776; Options</button>
    </div>
</template>

<script>
export default{
    methods: {
        /* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
        openBar() {
            document.getElementById("theSidebar").style.width = "300px";
            document.getElementById("viscontent").style.marginLeft = "300px";
        },

        /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
        closeBar() {
            document.getElementById("theSidebar").style.width = "0";
            document.getElementById("viscontent").style.marginLeft = "0";
        }
    }
}
</script>


<style scoped>

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
  float:left;
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
    transition: margin-left .5s;
    text-align: left;
    z-index: 1;
  }

  .dataList {
    height: 20%;
    overflow: scroll;
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
  .sidebar {padding-top: 15px;}
  .sidebar a {font-size: 18px;}
}
</style>