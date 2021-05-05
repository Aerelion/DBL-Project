<template>
  <div>
    <Header/>
    <Chart/>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Chart from './components/Chart.vue';

export default {
  name: 'App',
  components: {
    Header,
    Chart
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
</style>
