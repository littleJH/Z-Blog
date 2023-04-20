<script setup lang="ts">
import { User, useStore } from '../../stores/store'
import { reactive, ref, onMounted } from 'vue'
import { UploadFile, UploadFiles, UploadProps, ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  iconApi,
  setPersonalApi,
  userinfoApi,
  verifyApi,
  personalGetApi
} from '../../api/user'
import { onBeforeMount } from 'vue'
import router from '../../router/router'
import alertCard from '../alertCard.vue'
import type { FormRules } from 'element-plus'
import {
  createUserLabelApi,
  getUserLabelApi,
  deleteUserLabelApi
} from '../../api/label'

const store = useStore()
const userInfo = reactive(
  localStorage.getItem('userInfo') !== null
    ? JSON.parse(localStorage.getItem('userInfo') as string)
    : ''
)
const labelText = ref<string>(userInfo.Labels[0])
const labelList = ref([...userInfo.Labels])
const form = reactive({
  Newname: '',
  Newtelephone: '',
  Newemail: '',
  Newhobby: '',
  Newaddress: '',
  Newsex: null as boolean | null,
  Newqq: '',
  Newblog: '',
  Verify: ''
})
const imageUrl = ref<string>('')
const showDialog = ref<boolean>(false)
const config = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
}

onBeforeMount(() => {
  form.Newname = userInfo.Name
  form.Newaddress = userInfo.Address
  form.Newblog = userInfo.Blog
  form.Newemail = userInfo.Email
  form.Newhobby = userInfo.Hobby
  form.Newqq = userInfo.QQ
  form.Newsex = userInfo.Sex
  form.Newtelephone = userInfo.Telephone
})

const handleAvatarChange: UploadProps['onChange'] = (file: UploadFile) => {
  const fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
  if (fileType !== 'png' && fileType !== 'jpg') {
    ElMessage.warning({
      message: '图片格式不正确，限上传png或jpg格式图片',
      offset: 80
    })
    return false
  }
  uploadIcon(file.raw)
  imageUrl.value = URL.createObjectURL(file.raw!)
  return true
}

const validateEmail = (_: any, value: any, callback: any) => {
  const reg =
    /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
  if (!reg.test(value)) {
    callback(new Error('请输入正确的邮箱地址！'))
  } else {
    callback()
  }
}
const validateTelephonoe = (_: any, value: any, callback: any) => {
  const reg =
    /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
  if (!reg.test(value)) {
    callback(new Error('请输入正确的手机号！'))
  } else {
    callback()
  }
}
const rules = reactive<FormRules>({
  Newemail: [
    {
      validator: validateEmail,
      trigger: 'blur'
    }
  ],
  Newtelephone: [
    {
      validator: validateTelephonoe,
      trigger: 'blur'
    }
  ]
})

const submit = () => {
  if (form.Newemail !== userInfo.Email) {
    verifyApi(userInfo.Email).then(res => {
      showDialog.value = true
    })
  } else {
    uploadInfo()
  }
  addLabel()
}

const uploadInfo = () => {
  const config = {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json'
    }
  }
  setPersonalApi(JSON.stringify(form), config).then(async res => {
    if (res.data.code === 200) {
      await personalGetApi(config).then(res => {
        localStorage.setItem('userInfo', JSON.stringify(res.data.data.user))
      })
      ElMessage.success({
        message: '资料修改成功',
        offset: 80
      })
      router.push({
        path: '/personal/info'
      })
    }
  })
}

const uploadIcon = (file: any) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  }
  const form = new FormData()
  form.append('file', file)
  iconApi(form, config).then(res => {
    console.log(res)
    if (res.data.code === 200) {
      ElMessage.success({
        message: '头像修改成功',
        offset: 80
      })
    }
  })
}

const afterEnter = () => {
  const el = document.getElementById('verifyInput') as HTMLElement
  el.focus()
}

const deleteLabel = async (index: number) => {
  const { deleteUserLabelApi } = await import('../../api/label')
  const label = userInfo.Labels[index].replaceAll('+', '%2B')
  deleteUserLabelApi(label, config).then(res => {
    console.log(res.data)
    if (res.data.code === 200) {
      userInfo.Labels.splice(index, 1)
      labelList.value.splice(index, 1)
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    }
  })
}

const addLabel = () => {
  const config = {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json'
    }
  }
  const data = {
    label: labelText.value
  }
  if (labelText.value === userInfo.Labels[0]) {
    createUserLabel(data, config)
  } else {
    deleteUserLabelApi(userInfo.Labels[0], config).then(res => {
      console.log(res.data)
      if (res.data.code === 200) {
        createUserLabel(data, config)
      }
    })
  }
}

const createUserLabel = (data: any, config: any) => {
  createUserLabelApi(JSON.stringify(data), config).then(res => {
    if (res.data.code === 200) {
      getUserLabelApi(store.userInfo?.ID, config).then(res => {
        if (res.data.code === 200) {
          userInfo.Labels = res.data.data.labels
          labelText.value = userInfo.Labels[0]
          localStorage.setItem('userInfo', JSON.stringify(userInfo))
          store.userInfo = userInfo
        }
      })
    }
  })
}
</script>
<template>
  <div
    class="bg-white w-full flex flex-col items-center justify-center p-8 dark:bg-deepBlack"
  >
    <el-form
      :model="form"
      :rules="rules"
      label-position="top"
      size="large"
      class="w-full"
    >
      <el-form-item>
        <div class="w-full flex flex-col justify-center items-center">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleAvatarChange"
          >
            <img
              v-if="imageUrl"
              :src="imageUrl"
              class="avatar max-w-full max-h-full"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </div>
      </el-form-item>
      <el-divider></el-divider>
      <div>
        <div
          v-if="userInfo.Labels.length === 0"
          class="text-blue-500 hover:cursor-pointer"
        >
          <p class="mb-4">+快来添加自己的座右铭吧！</p>
          <el-input v-model="labelText"></el-input>
        </div>
        <div v-else>
          <p class="text-sm mb-4">座右铭</p>
          <el-input v-model="labelText">
            <template #suffix>
              <span class="w-8 h-8 flex justify-center items-center">
                <svg
                  @click="deleteLabel(0)"
                  t="1680750464826"
                  class="icon h-6 w-6 hover:h-8 hover:w-8 hover:cursor-pointer transition-all duration-500 ease-in-out"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="2905"
                  width="32"
                  height="32"
                >
                  <path
                    d="M632.917333 572.672l165.290667 165.248a42.624 42.624 0 0 1-60.288 60.288l-165.248-165.290667a42.624 42.624 0 0 1 60.245333-60.245333z m-346.88 225.536a42.624 42.624 0 0 1-60.245333-60.288L451.754667 512 225.792 286.08a42.624 42.624 0 1 1 60.288-60.288L512 451.754667l225.92-225.962667a42.624 42.624 0 1 1 60.288 60.288L286.08 798.208z"
                    fill="#EF4444"
                    p-id="2906"
                  ></path>
                </svg>
              </span>
            </template>
          </el-input>
        </div>
      </div>
      <el-divider></el-divider>
      <el-form-item>
        <p>Name</p>

        <el-input
          v-model="form.Newname"
          size="large"
          :placeholder="store.userInfo?.Name"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="Newemail">
        <p>Email</p>
        <el-input
          v-model="form.Newemail"
          :placeholder="store.userInfo?.Email"
          size="large"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="Newtelephone" label="">
        <p>Telephone</p>
        <el-input
          size="large"
          v-model="form.Newtelephone"
          :placeholder="
            store.userInfo?.Telephone === ''
              ? '待完善'
              : store.userInfo?.Telephone
          "
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="Hobby" label="">
        <p>Hobby</p>
        <el-input
          size="large"
          v-model="form.Newhobby"
          :placeholder="
            store.userInfo?.Hobby === '' ? '待完善' : store.userInfo?.Hobby
          "
        >
        </el-input>
      </el-form-item>
      <el-form-item label="">
        <p>Blog</p>
        <el-input
          size="large"
          v-model="form.Newblog"
          :placeholder="
            store.userInfo?.Blog === '' ? '待完善' : store.userInfo?.Blog
          "
        >
        </el-input>
      </el-form-item>
      <el-form-item label="">
        <p>QQ</p>
        <el-input
          size="large"
          v-model="form.Newqq"
          :placeholder="
            store.userInfo?.QQ === '' ? '待完善' : store.userInfo?.QQ
          "
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <p class="w-full">Sex</p>
        <div>
          <el-select
            size="large"
            v-model="form.Newsex"
            :placeholder="store.userInfo?.Sex === false ? '男' : '女'"
          >
            <el-option label="男" :value="false"></el-option>
            <el-option label="女" :value="true"></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="">
        <p class="w-full">Address</p>
        <!-- <el-cascader
          v-model="form.Newaddress"
          :placeholder="
            store.userInfo?.Address === '' ? '待完善' : store.userInfo?.Address
          "
        /> -->
        <el-input size="large" v-model="form.Newaddress"></el-input>
        <!-- <template #default="{ node, data }">
            <span>{{ data.provinceName }}</span>
          </template> -->
      </el-form-item>
    </el-form>
    <div class="h-8 mt-4 pb-20">
      <button class="btn-red-large" @click="submit">提交</button>
    </div>
    <Transition @after-enter="afterEnter">
      <alertCard v-if="showDialog" @close-dialog="showDialog = false">
        <div class="p-4 flex flex-col items-center">
          <p>
            <span class="flex justify-center">您正在修改邮箱</span>
          </p>
          <p>请查看"{{ userInfo.Email }}"获取验证码</p>
          <input
            id="verifyInput"
            type="text"
            v-model="form.Verify"
            class="bg-white rounded p-2 my-4 input-focus"
          />
          <button class="btn-red-large mb-4" @click="uploadInfo">确定</button>
        </div>
      </alertCard></Transition
    >
  </div>
</template>
<style scoped lang="less">
p {
  padding: 0.5rem 0 0 0;
  width: 100%;
}
.el-icon.avatar-uploader-icon {
  border: 1px dashed var(--el-border-color);
  border-color: var(--el-color-primary);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  font-size: 28px;
  color: #8c939d;
  width: 12rem;
  height: 12rem;
  text-align: center;
}
</style>
