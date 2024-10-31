<script setup>
import axios from "axios";
import {toFindCookie} from "@/components/componentsJs/cookie";

axios.defaults.baseURL = 'http://localhost:8080'
const frontEnd = 'http://localhost:5173'
const path = window.location.pathname + '/'

const fromData = reactive({
  accountNumber: '',
  password: '',
})

if (toFindCookie() === undefined) {
  location.href = frontEnd
} else {
  let findCookie = toFindCookie().split('|')
  fromData.accountNumber = findCookie[0]
  fromData.password = findCookie[1]
}

const W001 = ref('')
goW001()

async function goW001() {
  try {
    const response = await axios.get(path + goW001.name)
    W001.value = response.data
    PubSub.publish('W001', W001.value)
  } catch (error) {
    console.error('goW001 Error:', error)
  }
}

const fileList = ref([]);
const text = ref('');

const beforeRemove = (file) => {
  text.value = ''
  fileList.value = []
}

const submitUpload = async () => {
  if (fileList.value.length > 0) {
    fromData.fileList = fileList.value[0].raw
    fromData.fileName = fileList.value[0].name
    try {
      const response = await axios({
        method: 'post',
        url: path + submitUpload.name,
        data: fromData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      text.value = response.data
    } catch (error) {
      // console.error('goW001 Error:', error)
      text.value = error.response.data
    }
  }
}

</script>

<template>
  <el-container>
    <el-header>{{ W001 }}</el-header>
    <el-container>
      <el-main>
        <el-row>
          <el-upload
              v-model:file-list="fileList"
              :before-remove="beforeRemove"
              :limit="1"
              :auto-upload="false"
          >
            <template #trigger>
              <el-button type="primary">選擇資料</el-button>
            </template>
            <template #tip>
              <br>
              <el-text>限制1個文件</el-text>
            </template>
            <el-button type="success" @click="submitUpload">
              上傳到伺服器
            </el-button>
          </el-upload>
        </el-row>
        <el-text>{{ text }}</el-text>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>

</style>