<template>
  <div class="email">
    <p class="back" @click="back">&nbsp;{{ '<' }}&nbsp; 返回</p>
    <iframe v-if="href" :src="href" frameborder="0" class="iframe-email"></iframe>
  </div>
</template>
<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import { main } from '@/store'
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  const router = useRouter()
  const useMain = main()
  const { seid } = storeToRefs(main())
  const href = computed(() => {
    return `https://oi.bwoil.com/web/email/#/home?sessionId=${seid.value}&devinfo=${new Date().getTime()}`
  })
  const back = () => {
    router.replace('/')
  }
  window.addEventListener('message', (event: MessageEvent) => {
    if (event?.data?.type === 'init') {
      console.log('init------email', event.data?.data)
    }
    if (event?.data?.type === 'newMail') {
      console.log('new------email', event.data?.data)
      // window?.util?.startFlash('Welcome Electron')
      window?.util?.showNotification('一封新邮件')
    }
  })
</script>
<style lang="scss" scoped>
  .email {
    width: 100%;
    height: 100%;
    .back {
      width: 100%;
      height: 40px;
      line-height: 40px;
      padding-left: 16px;
      text-align: left;
      cursor: pointer;
      color: $app-color-primary;
    }
    .iframe-email {
      width: 100%;
      height: calc(100% - 40px);
      border: none;
      outline: none;
    }
  }
</style>
