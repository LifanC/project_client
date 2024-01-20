<script setup>

import axios from "axios";
import {addCookie, clearCookie, toFindCookie} from "@/components/componentsJs/cookie";

const rearEnd = 'http://localhost:8080'
const fromData = reactive({
  f_name: '',
  number: '',
})
const f_name_number = ref('')
f_name_number.value = toFindCookie()

const indexUrl = () => {
  axios({
    method: 'post',
    url: rearEnd + '/Index/' + indexUrl.name,
    data: fromData
  })
      .then((response) => {
        addCookie(fromData.f_name, fromData.number)
        PubSub.publish('IndexUrl', response.data)
      })

}

const quitIndexUrl = () => {
  clearCookie()
}

console.log('toFindCookie',f_name_number.value)

</script>

<template>
  <el-text><h1>Index</h1></el-text>
  <el-row>
    <el-form v-model="fromData">
      <el-form-item label="F-Name">
        <el-input v-model="fromData.f_name"
                  maxlength="1"
                  show-word-limit
        />
      </el-form-item>
      <el-form-item label="Number">
        <el-input v-model="fromData.number"
                  maxlength="2"
                  show-word-limit
        />
      </el-form-item>
    </el-form>
  </el-row>
  <el-form-item label="Submit">
    <el-button @click="indexUrl">測試</el-button>
    <el-button @click="quitIndexUrl">退出測試</el-button>
  </el-form-item>
</template>

<style scoped>

</style>