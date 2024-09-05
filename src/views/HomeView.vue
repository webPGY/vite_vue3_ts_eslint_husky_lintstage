<template>
  <div class="home">
    <img alt="Vue logo" src="@/assets/vue.svg" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
    {{ a }} {{ a }}
  </div>
</template>

<script lang="ts" setup>
  import HelloWorld from '../components/HelloWorld.vue' // @ is an alias to /src
  let a = 1
  a = 2
</script>
