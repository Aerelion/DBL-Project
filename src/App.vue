<template>
  <!-- Stuff we want on all of the pages will be here -->
  <div class="header">
    <h1>DBL project</h1>
  </div>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/visualise">Visualise</router-link>
  </div>
  <router-view />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

* {
  padding: 0;
  margin: 0;
  border: 0;
}

#nav {
  padding: 10px;
  background-color: #2c3e50;
  border-bottom: 3px solid black;
  color: white;
}

#nav a {
  font-weight: bold;
  color: white;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.header {
  background: #2c3e50;
  color: white;
}

.header h1 {
  padding: 5px;
}

.header a {
  font-weight: bold;
  color: #50921b;
}

.header a.router-link-exact-active {
  color: #42b983;
}
</style>
