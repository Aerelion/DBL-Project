<template>
  <div class="wrap">
    <div class="homeHeader">
      <h1>Welcome to our website!</h1><br>
      <p>We are Group 34, a group of students from the Eindhoven University of Technology, and we have built a data visualisation tool for you!</p>
    </div>
    <div class="manual">
      <h1>How to use our tool:</h1>
      <br>
      <div class="steps">
        <div class=step1>
          <p>Step 1: Click the 'Options' button on the visualisation page to fold out the menu</p>
          <img src="./Images/step1.png" alt="step 1">
        </div>
        <div class=step2>
          <p>Step 2: Upload and name your dataset at the top of the menu</p>
          <img src="./Images/step2.png" alt="step 2">
        </div>
        <div class=step3>
          <p>Step 3: Refresh the page, find your dataset in the list below and visualise!</p>
          <img src="./Images/step3.png" alt="step 3">
        </div>
      </div>        
    </div>
    <div class="about">
      <h1>About us:</h1>
      <p>text about all of us?</p>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  background-color: #3f3f3f;
  color: white;
  overflow: auto;
}
.homeHeader {
  background-color: #3f3f3f;
  padding: 30px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
  width: 50%;
}

.homeHeader h1 {
  font-size: 70px;
}

.homeHeader p {
  font-size: 25px;
}

.manual {
  border-top: 3px ridge white;
  border-bottom: 3px ridge white;
  width: 80%;
  justify-content: center;
  margin: auto;
  padding: 30px;
}

.steps {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  width: 80%;
  margin: auto;
  justify-content: center;
}

.step1 {
  border-right: 1px solid white;
}

.step2 {
  border-right: 1px solid white;
}

.steps > img {
  max-width: 100%;
  height: auto;
}

.step1 img {
  border: 2px solid black;
  margin-top: 20px;
}

.step2 img {
  margin-top: 50px;
}

.about {
  margin-top: 50px;
}



</style>
