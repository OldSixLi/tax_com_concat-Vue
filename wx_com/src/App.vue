<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>
  #app {
    font-family: "MicroSoft YaHei";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin: 0 auto;
    font-size: 1.6rem;
    min-height: 100%;
    height: 100%;
    background-color: #fff;
    /* padding: 0.5rem; */
  } 
</style>