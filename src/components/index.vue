<script setup>

import axios from "axios";
import {addCookie, clearCookie, toFindCookie} from "@/components/componentsJs/cookie";

const rearEnd = 'http://localhost:8080'
const fromData = reactive({
  f_name: '',
  number: '',
  restfulApi_type: '',
})
const Start_indexUrl_type = ref('')


const indexUrl = (restfulApi_type) => {
  fromData.restfulApi_type = restfulApi_type
  axios({
    method: 'post',
    url: rearEnd + '/Index/' + indexUrl.name,
    data: fromData
  })
      .then((response) => {
        // ['true', 'Login Success']
        // ['false', 'Login Fail']
        // console.log(response.data)
        if (response.data[0] === 'true') {
          if (restfulApi_type === 'Delete') {
            quitIndexUrl()
          } else {
            addCookie(fromData.f_name, fromData.number)
            PubSub.publish('IndexUrl', response.data[0])
          }
          Start_indexUrl_type.value = response.data[1]
        } else if (response.data[0] === 'false') {
          fromData.f_name = ''
          fromData.number = ''
          Start_indexUrl_type.value = response.data[1]
          PubSub.publish('IndexUrl', response.data[0])
        }
      })
}

const quitIndexUrl = () => {
  clearCookie()
  fromData.f_name = ''
  fromData.number = ''
  Start_indexUrl_type.value = ''
  PubSub.publish('IndexUrl', 'false')
}

if (toFindCookie() !== undefined) {
  fromData.f_name = toFindCookie().substring(0, 1)
  fromData.number = toFindCookie().substring(1, 3)
}

</script>

<template>
  <el-text size="large"><h1>首頁 Index</h1></el-text>
  <el-row>
    <el-form v-model="fromData">
      <el-form-item label="F-Name">
        <el-input v-model="fromData.f_name"
                  maxlength="1"
                  show-word-limit
                  clearable
        />
      </el-form-item>
      <el-form-item label="Number">
        <el-input v-model="fromData.number"
                  maxlength="2"
                  show-word-limit
                  clearable
        />
      </el-form-item>
    </el-form>
  </el-row>
  <el-form-item label="Submit">
    <el-button @click="indexUrl('Login')">登入測試</el-button>
    <el-button @click="indexUrl('Register')">註冊測試</el-button>
    <el-button @click="indexUrl('Delete')">刪除測試</el-button>
    <el-button @click="quitIndexUrl">退出測試</el-button>
  </el-form-item>
  {{ Start_indexUrl_type }}
</template>

<style scoped>

</style>