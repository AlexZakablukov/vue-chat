<template>
  <div class="wrapper">
    <Sidebar/>
    <main class="main">
      <Nuxt />
    </main>
  </div>
</template>

<script>
import Vue from 'vue'
import Sidebar from "~/components/sidebar.vue";

export default Vue.extend({
  name: 'ChatLayout',
  components: {
    Sidebar,
  }
})
</script>

<style lang="css">
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  .wrapper{
    height: 100vh;
    display: grid;
    grid-template-columns: 300px 1fr;
    background-color: #ececec;
  }
</style>
