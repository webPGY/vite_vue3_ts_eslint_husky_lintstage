<template>
  <div class="home">
    <div class="login-wrap">
      <p>Welcome Electron</p>
      <el-input v-model="userName" placeholder="请输入用户名" />
      <el-input v-model="userPassword" type="password" placeholder="请输入密码" />
      <el-button type="primary" :disabled="disabled" @click="login">登录闪邮</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import { main, moudule1Store } from '@/store'
  import userApi from '@/request/usermanager.api'
  // import { useDemo } from '@/hooks/useDemo'
  import { GetBoDeviceId, showTips } from '@/utils/common'
  import { computed } from 'vue'
  const router = useRouter()
  const useMain = main()
  const { seid } = storeToRefs(useMain)
  const { primary } = storeToRefs(moudule1Store())
  const userName = ref('')
  const userPassword = ref('')
  const disabled = computed(() => {
    return !userName.value.trim() || !userPassword.value.trim()
  })
  // const { _primary } = storeToRefs(moudule2Store())
  // const { hh } = useDemo()
  // const changeCounter = async () => {
  //   useMain.increment()
  // }

  const login = async () => {
    const bodeviceId = await GetBoDeviceId()
    try {
      const res: any = await userApi.login(userName.value, userPassword.value, bodeviceId)
      if (res?.data) {
        seid.value = res.data.seid
        router.push('/email')
      } else {
        showTips('账号或密码错误', 'fail')
      }
    } catch (error) {
      console.error(error)
      showTips('账号或密码错误', 'fail')
    }
  }
</script>
<style lang="scss" scoped>
  .home {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .login-wrap {
      width: 400px;
      height: 400px;
      border-radius: 6px;
      border: 1px solid $text-black-9;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      p {
        color: $text-black-0;
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 30px;
      }
      .el-input {
        margin: 12px 0;
      }
      .el-button {
        margin-top: 12px;
        outline: none;
      }
    }
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
