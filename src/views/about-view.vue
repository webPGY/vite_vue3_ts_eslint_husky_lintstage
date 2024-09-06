<template>
  <div class="about">
    <h1>{{ $t('This is an about page') }}</h1>
    <p @click="changeCounter">{{ counter }}</p>
  </div>
</template>
<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import { main } from '@/store'
  const useMain = main()
  const { counter } = storeToRefs(main())
  const changeCounter = () => {
    useMain.increment()
  }
</script>
