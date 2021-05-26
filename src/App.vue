<template>
<!-- Stuff we want on all of the pages will be here -->
  <Header/>
  <Navbar/>
</template>

<script>
import Header from './views/Header.vue'
import Navbar from './views/Navbar.vue'

export default {
  name: 'App',
  components: {
    Header,
    Navbar
  }
    
  }
</script>


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


</style>
