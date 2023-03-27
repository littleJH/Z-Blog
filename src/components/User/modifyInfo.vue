<script setup lang="ts">
import { User, useStore } from '../../stores/index'
import { reactive, ref, onMounted } from 'vue'
import { UploadFile, UploadFiles, UploadProps, ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { iconApi, setPersonalApi } from '../../api/user'

const store = useStore()
const form = reactive<User>({
  Newname: '',
  Newtelephone: '',
  Newemail: '',
  Newhobby: '',
  Newaddress: '',
  Newsex: '',
  Newqq: '',
  Newblog: '',
  verify: ''
})
const imageUrl = ref<string>('')

const handleAvatarChange: UploadProps['onChange'] = (file: UploadFile) => {
  const fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
  if (fileType !== 'png' && fileType !== 'jpg') {
    ElMessage.warning({
      message: '图片格式不正确，限上传png或jpg格式图片',
      duration: 3000
    })
    return false
  }
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
const rules = {
  email: [
    {
      validator: validateEmail,
      trigger: 'blur'
    }
  ],
  telephone: [
    {
      validator: validateTelephonoe,
      trigger: 'blur'
    }
  ]
}

const submit = () => {
  setPersonal()
  uploadIcon()
}

const setPersonal = () => {
  const config = {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  }
  const raw = JSON.stringify(form)
  console.log(raw)
}

const uploadIcon = () => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  }
}
</script>
<template>
  <div class="ct-bg">
    <div
      class="shadow-lg bg-white min-w-min flex flex-col items-center justify-center px-8 dark:bg-deepBlack"
    >
      <el-form :model="form" :rules="rules" label-position="top">
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
        <div
          class="bg-gray-500 w-full my-12 dark:bg-white"
          style="height: 1px"
        ></div>
        <el-form-item>
          <p>Name</p>

          <el-input v-model="form.Newname" :placeholder="store.userInfo?.Name">
          </el-input>
        </el-form-item>
        <el-form-item prop="email">
          <p>Email</p>
          <el-input
            v-model="form.Newemail"
            :placeholder="store.userInfo?.Email"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="telephone" label="">
          <p>Telephone</p>
          <el-input
            v-model="form.Newtelephone"
            :placeholder="
              store.userInfo?.Telephone === ''
                ? '待完善'
                : store.userInfo?.Telephone
            "
          >
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <p>Blog</p>
          <el-input
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
          <el-cascader
            v-model="form.Newaddress"
            :placeholder="
              store.userInfo?.Address === ''
                ? '待完善'
                : store.userInfo?.Address
            "
          />
          <!-- <template #default="{ node, data }">
            <span>{{ data.provinceName }}</span>
          </template> -->
        </el-form-item>
      </el-form>
      <div class="h-8 mt-4 pb-20">
        <button class="btn-blue" @click="submit">提交</button>
      </div>
    </div>
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
  width: 100px;
  height: 100px;
  text-align: center;
}
</style>
