<template>
  <div id="app">
    <chartview/>
  </div>
</template>

<script>
import chartview from './components/chart'

export default {
  name: 'App',
  components: {
    chartview
  }
}
</script>

<style>
*{
  margin: 0;
}
#app {
  height: 450px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
