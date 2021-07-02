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
          <p>Step 3: Refresh the page, find your dataset in the list below and visualise! </p> <br>
          <img src="./Images/step3.png" alt="step 3">
        </div>
      </div>   
      <br>
      <p>After this, you can use the slider at the bottom of the page to show data from only before
         the date displayed below the slider!</p>     
    </div>
    <div class="about">
      <div class="features">
        <h1>Our Features</h1><br>
        <div class="steps">
          <div class="icon1">
            <img src="./Images/graph.png" alt="nodelink">
            <h3>Clear</h3><br>
            <p>Using our visualisation tool, you will get clear visualisations also for very large data sets. We believe this is
              essential in a good data visualisation tool, since it may get hard to get a good overview when visualisations get cluttered.</p>
          </div>
          <div class="icon2">
            <img src="./Images/stopwatch.png" alt="stopwatch">
            <h3>Fast</h3><br>
            <p>One of our key features is the tool's performance. For data sets of all sizes, visualisations are generated quickly and
              interaction is smooth. This makes working with our tool a pleasant experience.</p>
          </div>
          <div class="icon3">
            <img src="./Images/lightbulb.png" alt="bulb">
            <h3>Insightful</h3><br>
            <p>Using our tool, you can easily gain insight in connections between things. Because of several highlighting techniques we have
              implemented, it is easy to view links between your data nodes, even for very large data sets.</p>
          </div>
        </div>
      </div>
      <div class="team">
        <h1>Our Team</h1>
        <div class="members">
          <div id="member1">
            <h3>Andree Ştef</h3>
            <h4>Scrum master and programmer</h4>
            <br>
            <p>Hi! I'm Andree and I was the scrum master of the team. I made the adjacency matrix visualisation, and worked on improving the website performance.
               Although there have been minor setbacks throughout the development process, I believe we managed to make a good product, and I enjoyed working with everyone else on this list.</p>
          </div>
          <div id="member2">
            <h3>Hannes Janmaat</h3>
            <h4>Report and deadline manager</h4>
            <br>
            <p>Hello! I am Hannes and I was in charge of most of the report and other 
deadlines there were during the project, such as the evaluation.
The team members made working on the project an enjoyable experience!</p>
          </div>
          <div id="member3">
            <h3>Tijn Koppert</h3>
            <h4>Web designer and programmer</h4>
            <br>
            <p>Hey! I am Tijn and I made and implemented the design for the website you are currently looking at! I also worked on
              the time slider and making the visualisations dynamic. I had a great time working on this project with some amazing 
              team members!
            </p>
          </div>
          <div id="member4">
            <h3>Berkay Kösebay</h3>
            <h4>Lead programmer</h4>
            <br>
            <p>Text to be added</p>
          </div>
          <div id="member5">
            <h3>Koen Mann</h3>
            <h4>Programmer</h4>
            <br>
            <p>Text to be added</p>
          </div>
          <div id="member6">
            <h3>Dembis Spaans</h3>
            <h4>Report writer and programmer</h4>
            <br>
            <p>Hi, I am Dembis. I worked on some stuff on the website and the report. Enjoy our beautiful visualizations!</p>
          </div>
        </div>
      </div>
    </div>
    <div>Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a>
         from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
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
  border-top: 10px ridge white;
  justify-content: center;
  margin: auto;
  padding: 30px;
  margin-bottom: 50px;
}

.steps {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  margin: auto;
  justify-content: center;
  margin-bottom: 20px;
}

.step1 {
  border-right: 1px solid white;
}

.step2 {
  border-right: 1px solid white;
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

.features {
  justify-content: center;
  margin: auto;
  padding: 30px;
  background: #348AA7;
  border: 8px ridge white;
}

.features p {
  justify-content: center;
  width: 70%;
  margin: auto;
}

.icon1 img {
  padding: 10px;
  border-radius: 50%;
  background: #9EA93F;
  width: 20%;
  margin: 15px;
}

.icon2 img {
  padding: 10px;
  border-radius: 50%;
  background: #9EA93F;
  width: 20%;
  margin: 15px;
}

.icon3 img {
  padding: 10px;
  border-radius: 50%;
  background: #9EA93F;
  width: 20%;
  margin: 15px;
}

.team {
  justify-content: center;
  margin: auto;
  padding: 30px;
}

.members {
  margin-top: 20px;
  display: grid; 
  grid-template-columns: 1fr 1fr 1fr; 
  grid-template-rows: 1fr 1fr; 
  gap: 80px 40px; 
  grid-template-areas: 
    ". . ."
    ". . ."; 
}

.members p {
  justify-content: center;
  width: 70%;
  margin: auto;
}

.members > div {
  background: #363636;
  padding: 10px;
  border: 4px ridge white;
}

</style>
