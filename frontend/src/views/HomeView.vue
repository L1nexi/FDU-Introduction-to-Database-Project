<template>
  <div class="home">
    <h1>
      Welcome to the Music Info Management Site
    </h1>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
export default {

  name: 'HomeView',
  // components: {
  //   HelloWorld
  // }
  props: {
    msg: String
  },
}
</script>

<style>
.home {
  text-align: center;
}

</style>