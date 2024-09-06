<template>
  <div class="home">
    <p @click="changeCounter">{{ counter }}</p>
    <p class="primary-text">{{ primary }}</p>
    <p v-hightLight="{ hText: 'module', text: _primary, color: 'blue' }"></p>
    <p class="warning-text">{{ hh }}</p>
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import { main, moudule1Store, moudule2Store } from '@/store'
  import { useDemo } from '@/hooks/useDemo'
  const useMain = main()
  const { counter } = storeToRefs(useMain)
  const { primary } = storeToRefs(moudule1Store())
  const { _primary } = storeToRefs(moudule2Store())
  const { hh } = useDemo()
  const changeCounter = () => {
    useMain.increment()
  }
</script>
<style lang="scss" scoped>
  .home {
    .primary-text {
      color: $app-color-primary;
      &:hover {
        color: $app-color-hover;
      }
    }
    .warning-text {
      color: $app-color-warning;
      &:hover {
        color: $app-color-danger;
      }
    }
  }
</style>
