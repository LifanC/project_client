<script setup>
import index from "@/components/index.vue";
import PubSub from "pubsub-js";
import {getApi} from "@/components/js/api";
import {toFindCookie, clearCookie} from "@/components/js/cookie";

const path_ = ref('/')
const path_index = ref('/')

const userNameValue = ref()
userNameValue.value = toFindCookie()

PubSub.subscribe('home', function (msg, data) {
  // console.log('data',data)
  if (data) {
    path_.value = '/'
    path_index.value = '/index'
  } else {
    path_.value = '/'
    path_index.value = '/'
  }

})

const time = ref()
setInterval(function () {
  let NowDate = new Date()
  let Y = NowDate.getFullYear()
  let M = NowDate.getMonth() + 1
  let D = NowDate.getDate()
  let h = NowDate.getHours()
  let m = NowDate.getMinutes()
  let s = NowDate.getSeconds()
  time.value = Y + '/' + M + '/' + D + ' ' + h + ':' + m + ':' + s
}, 1000);

if (userNameValue.value !== undefined) {
  path_.value = '/'
  path_index.value = '/index'
}

const dialogVisible = ref(false)

PubSub.subscribe('delateClearCookie', function (msg, data) {
  getApi('http://localhost:8080/go/time')
      .then((result) => {
        if (result) {
          clearCookie()
          dialogVisible.value = true
        }
      })
})

if (toFindCookie() === undefined) {
  let currentURL = window.location.href;
  if (currentURL !== "http://localhost:5173/") {
    location.href = "http://localhost:5173/"
  }
}

const handleClose = (() => {
  dialogVisible.value = false
  location.href = "http://localhost:5173/"
})

</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: path_ }">Home</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: path_index }">記帳表</el-breadcrumb-item>
    <el-breadcrumb-item>...</el-breadcrumb-item>
  </el-breadcrumb>
  <el-text type="primary">➠ {{ time }}</el-text>
  <el-divider/>
  <el-text type="">
    <router-view/>
  </el-text>

  <el-dialog
      v-model="dialogVisible"
      title="時間到..."
      width="20%"
      :before-close="handleClose"
  >
    <el-text type="primary"><h2>請重新登入</h2></el-text>
  </el-dialog>
</template>

<style scoped>

</style>
