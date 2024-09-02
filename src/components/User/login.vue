<script setup lang="ts">
import { ref, reactive, defineEmits, onMounted } from 'vue'
import { useStore, User } from '../../stores/store'
import type { FormInstance } from 'element-plus'
import { verifyApi, registApi, loginApi, personalGetApi, securityApi, updatepassApi } from '../../api/user'
import { getUserLabelApi } from '../../api/label'
import { useCountDown } from '../../hooks/countDown'
import { ElMessage } from 'element-plus'
import router from '../../router/router'

interface Form {
  [key: string]: string
}
interface Form2 {
  [key: string]: Form
}

const store = useStore()
const loginFlag = ref<boolean>(true)
const registerRuleFormRef = ref<FormInstance>()
const findRuleFormRef = ref<FormInstance>()
const loginForm = reactive<Form>({
  email: '',
  password: ''
})
const registerForm = reactive<Form>({
  email: '',
  password: '',
  checkPass: '',
  name: '',
  verify: ''
})
const findPassForm = reactive<Form2>({
  form1: {
    email: '',
    verify: ''
  },
  form2: {
    resetPass: '',
    newPass: '',
    checkPass: ''
  }
})
const verifyBtn = ref<string>('获取验证码')
const verifyBtn2 = ref<string>('获取验证码')
const gettingVerify = ref<boolean>(false)
const mode = ref<'login' | 'register'>('login')
const showDialog = reactive({
  show: false,
  step1: true,
  step2: false
})

//自定义事件
const emit = defineEmits<{
  (e: 'login', value: string): void
}>()

//表单校验
const validateEmail = (_: any, value: any, callback: any) => {
  const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
  if (value === '') {
    callback(new Error('请输入邮箱地址！'))
  } else {
    if (!reg.test(value)) {
      callback(new Error('请输入正确的邮箱地址！'))
    } else {
      callback()
    }
  }
}
const validatePass = (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码！'))
  } else {
    if (registerForm.checkPass !== '') {
      if (!registerRuleFormRef.value) return
      registerRuleFormRef.value.validateField('checkPass')
    }
    callback()
  }
}
const validateCheckpass = (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码！'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致！'))
  } else {
    callback()
  }
}
const registerRules = reactive({
  email: [
    {
      validator: validateEmail,
      trigger: 'blur'
    }
  ],
  password: [
    { validator: validatePass, trigger: 'blur' },
    {
      required: true,
      min: 6,
      message: '密码长度不足6位！',
      trigger: 'blur'
    }
  ],
  checkPass: [
    { validator: validateCheckpass, trigger: 'blur' },
    {
      required: true,
      min: 6,
      message: '密码长度不足6位！',
      trigger: 'blur'
    }
  ],
  name: [
    {
      required: true,
      message: '请输入用户名！',
      trigger: 'blur'
    },
    {
      max: 20,
      message: '用户名长度不要超过20！',
      trigger: 'blur'
    }
  ]
})
const loginRules = reactive({
  email: [
    {
      validator: validateEmail,
      trigger: 'blur'
    }
  ],
  password: [{ required: true, message: '请输入密码！', trigger: 'blur' }]
})
const validateNewPass = (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码！'))
  } else {
    if (findPassForm.form2.checkPass !== '') {
      if (!findRuleFormRef.value) return
      findRuleFormRef.value.validateField('checkPass')
    }
    callback()
  }
}
const validateCheckNewPass = (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码！'))
  } else if (value !== findPassForm.form2.newPass) {
    callback(new Error('两次输入的密码不一致！'))
  } else {
    callback()
  }
}
const findPassRules = reactive({
  email: [
    {
      validator: validateEmail,
      trigger: 'blur'
    }
  ],
  resetPass: [
    {
      required: true,
      message: '请输入系统重置后的密码！',
      trigger: 'blur'
    }
  ],
  newPass: [
    {
      validator: validateNewPass,
      trigger: 'blur'
    }
  ],
  checkPass: [
    {
      validator: validateCheckNewPass,
      trigger: 'blur'
    }
  ]
})

//
const closeCard = () => {
  if (showDialog.show) {
    showDialog.show = false
    loginFlag.value = true
  } else {
    loginFlag.value = false
  }
}
const findPass = () => {
  showDialog.show = true
  loginFlag.value = false
}

// 注册
const getVerify = () => {
  registerRuleFormRef.value?.validate((bool: Boolean, obj: any) => {
    if (bool) {
      verifyApi(registerForm.email).then(res => {
        if (res.data.code === 200) {
          useCountDown(verifyBtn, gettingVerify)
          ElMessage.success({
            message: '验证码获取成功，有效时间300s，请查看邮箱',
            offset: 80
          })
        } else {
          ElMessage.warning({
            message: res.data.msg,
            offset: 80
          })
        }
      })
    }
  })
}
const register = () => {
  const form = new FormData()
  form.append('Email', registerForm.email)
  form.append('Password', registerForm.password)
  form.append('Name', registerForm.name)
  form.append('Verify', registerForm.verify)

  registApi(form).then(res => {
    if (res.data.code === 200) {
      ElMessage.success({
        message: '注册成功，欢迎！',
        offset: 80
      })
      localStorage.setItem('token', res.data.data.token)
      Object.keys(registerForm).forEach(key => {
        registerForm[key] = ''
      })
      loginFlag.value = true
      router.push('/')
    }
  })
}

//登录
const login = () => {
  const form = new FormData()
  form.append('Email', loginForm.email)
  form.append('Password', loginForm.password)

  loginApi(form).then(res => {
    console.log(res.data)
    if (res.data.code === 200) {
      localStorage.setItem('token', res.data.data.token)

      loginFlag.value = false
      Object.keys(loginForm).forEach(key => {
        loginForm[key] = ''
      })
      getPersonal()
      router.push('/')
    } else {
      ElMessage.warning({
        message: res.data.msg,
        offset: 80
      })
    }
  })
}
const getPersonal = () => {
  const config = {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  }
  personalGetApi(config).then(res => {
    const user = res.data.data.user as User
    getUserLabelApi(user.ID, config).then(result => {
      user.Labels = result.data.data.labels
      store.userInfo = user
      localStorage.setItem('userInfo', JSON.stringify(user))
      emit('login', user.Icon)
    })
  })
}

//找回密码
const getVerify2 = () => {
  verifyApi(findPassForm.form1.email).then(res => {
    if (res.data.code === 200) {
      useCountDown(verifyBtn2, gettingVerify)
      ElMessage.success({
        message: '验证码获取成功，有效时间300s，请查看邮箱',
        offset: 80
      })
    } else {
      ElMessage.warning({
        message: res.data.msg,
        offset: 80
      })
    }
  })
}
const nextStep = () => {
  const form = new FormData()
  form.append('Email', findPassForm.form1.email)
  form.append('Verify', findPassForm.form1.verify)
  securityApi(form).then(res => {
    if (res.data.code === 200) {
      ElMessage.success({
        message: '密码已由系统重置，请查看邮箱。您可以直接使用重置后的密码登录，也可以重新设置密码！',
        offset: 80
      })
      showDialog.step1 = false
      showDialog.step2 = true
    } else {
      ElMessage.warning({
        message: res.data.msg,
        offset: 80
      })
    }
  })
}
const preStep = () => {
  showDialog.step1 = true
  showDialog.step2 = false
}
const submitNewPass = () => {
  const form = new FormData()
  form.append('first', findPassForm.form2.resetPass)
  form.append('second', findPassForm.form2.newPass)
  updatepassApi(form).then(res => {
    console.log(res)
    if (res.data.code === 200) {
      ElMessage.success({
        message: '密码修改成功！',
        offset: 80
      })
      const form2 = new FormData()
      form2.append('Email', findPassForm.form1.email)
      form2.append('Password', findPassForm.form2.newPass)
      loginApi(form2).then(res => {
        if (res.data.code === 200) {
          localStorage.setItem('token', res.data.data.token)

          closeCard()
          Object.keys(findPassForm).forEach(key => {
            Object.keys(findPassForm[key]).forEach(key2 => {
              findPassForm[key][key2] = ''
            })
          })
          getPersonal()
        }
      })
    } else {
      ElMessage.warning({
        message: res.data.msg,
        offset: 80
      })
    }
  })
}
</script>
<template>
  <Transition enter-active-class="animate__animated animate__fadeIn animate__fast" leave-active-class="animate__animated animate__fadeOut animate__faster">
    <div class="h-full absolute top-0 w-full flex justify-center items-center">
      <div v-if="loginFlag" class="flex justify-center items-center shadow-md" style="width: 600px; height: 400px">
        <Transition enter-to-class="animate__animated animate__fadeInRight">
          <!-- 登录模式 -->
          <div v-if="mode === 'login'" class="w-1/2 h-full bg-blue-200 flex flex-col justify-center items-center bg-opacity-50 dark:bg-opacity-30 dark:text-white">
            <div class="w-full h-8 text-center text-2xl p-12">登录</div>
            <div class="w-full">
              <el-form :model="loginForm" :rules="loginRules" class="m-4">
                <el-form-item prop="email">
                  <el-input v-model="loginForm.email" placeholder="邮箱"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input v-model="loginForm.password" placeholder="密码" type="password"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div class="text-xs">
              <a href="#" class="text-center hover:text-blue-500" @click="findPass">忘记密码</a>
            </div>
            <div class="p-4 h-4">
              <button @click="login" class="btn-blue">登录</button>
            </div>
          </div>
        </Transition>
        <Transition enter-active-class="animate__animated animate__fadeInLeft">
          <div v-if="mode === 'login'" class="w-1/2 h-full bg-red-300 bg-opacity-50 flex flex-col justify-center items-center dark:bg-opacity-30 dark:text-white">
            <p class="text-2xl p-4 w-full text-center">没有账号？</p>
            <p class="p-4 w-full text-center">立即注册吧！</p>
            <div class="p-4 h-4">
              <button @click="mode = 'register'" class="btn-red">注册</button>
            </div>
          </div>
        </Transition>
        <!-- 注册模式 -->
        <Transition enter-active-class="animate__animated animate__fadeInRight">
          <div v-if="mode === 'register'" class="w-1/2 h-full bg-red-300 bg-opacity-50 flex flex-col justify-center items-center dark:bg-opacity-30 dark:text-white">
            <p class="text-2xl p-4 w-full text-center">已有账号？</p>
            <p class="p-4 w-full text-center">立即登录吧！</p>
            <div class="p-4">
              <button @click="mode = 'login'" class="btn-red">登录</button>
            </div>
          </div>
        </Transition>
        <Transition enter-active-class="animate__animated animate__fadeInLeft">
          <div v-if="mode === 'register'" class="w-1/2 h-full bg-blue-200 flex flex-col justify-center items-center bg-opacity-50 dark:bg-opacity-30 dark:bg-opacity-30 dark:text-white">
            <p class="w-full mb-4 text-center text-2xl">注册</p>
            <div class="w-full">
              <el-form ref="registerRuleFormRef" :rules="registerRules" :model="registerForm" class="px-4 w-full">
                <el-form-item prop="email">
                  <el-input v-model="registerForm.email" placeholder="邮箱"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input v-model="registerForm.password" placeholder="密码" type="password"></el-input>
                </el-form-item>
                <el-form-item prop="checkPass">
                  <el-input v-model="registerForm.checkPass" placeholder="确认密码" type="password"></el-input>
                </el-form-item>
                <el-form-item prop="name">
                  <el-input v-model="registerForm.name" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="registerForm.verify" placeholder="验证码"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div class="text-xs">
              <button @click="getVerify" :disabled="gettingVerify" class="text-center hover:cursor-pointer hover:text-blue-500">
                {{ verifyBtn }}
              </button>
            </div>
            <div class="m-4 h-4">
              <button @click="register" class="btn-blue">注册</button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
  <!-- 找回密码 -->
  <Transition enter-active-class="animate__animated animate__fadeInDownBig" leave-active-class="animate__animated animate__fadeOutUpBig">
    <div v-if="showDialog.show" @mousedown.self="closeCard" class="w-full h-full fixed flex justify-center top-0 items-center z-30">
      <div v-if="showDialog.step1" class="flex flex-col justify-center items-center bg-blue-200 bg-opacity-50 shadow-2xl dark:bg-opacity-30 dark:text-white" style="width: 300px; height: 300px">
        <p class="text-center text-xl pb-4">找回密码</p>
        <div class="px-4 py-2 w-full">
          <el-form :model="findPassForm.form1" ref="findRuleFormRef" :rules="findPassRules" class="">
            <el-form-item prop="email">
              <el-input v-model="findPassForm.form1.email" placeholder="邮箱"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="findPassForm.form1.verify" placeholder="验证码"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="text-xs">
          <button @click="getVerify2" class="text-center hover:cursor-pointer hover:text-blue-500">
            {{ verifyBtn2 }}
          </button>
        </div>
        <div class="h-4 p-6">
          <button @click="nextStep" class="btn-blue">下一步</button>
        </div>
      </div>
      <div v-if="showDialog.step2" class="flex flex-col justify-center bg-blue-200 bg-opacity-50 shadow-2xl dark:bg-opacity-30 dark:text-white" style="width: 300px; height: 300px">
        <p class="text-center text-xl pb-2">找回密码</p>
        <el-form :model="findPassForm.form2" :rules="findPassRules" class="px-4 py-2">
          <el-form-item prop="resetPass">
            <el-input v-model="findPassForm.form2.resetPass" placeholder="系统重置密码"></el-input>
          </el-form-item>
          <el-form-item prop="newPass">
            <el-input v-model="findPassForm.form2.newPass" placeholder="新密码" type="password"></el-input>
          </el-form-item>
          <el-form-item prop="checkPass">
            <el-input v-model="findPassForm.form2.checkPass" placeholder="确认密码" type="password"></el-input>
          </el-form-item>
        </el-form>
        <div class="h-4 flex justify-center">
          <button @click="preStep" class="btn-blue">上一步</button>
          <button @click="submitNewPass" class="btn-red">确定</button>
        </div>
      </div>
    </div>
  </Transition>
</template>
<style scoped lang="less"></style>
