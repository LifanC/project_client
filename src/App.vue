<script setup>
import index from "@/components/index.vue";
import setUp from "@/components/setUp.vue";
import PubSub from "pubsub-js";
import {getApi} from "@/components/js/api";

const path_ = ref('/')
const path_index = ref('/')
const path_setUp = ref('/')
const TF = ref(false)

PubSub.subscribe('home', function (msg, data) {
  // console.log('data',data)
  dataTF(data)
  TF.value = data
  if(data){
    path_.value = '/'
    path_index.value = '/index'
    path_setUp.value = '/setUp'
  }else{
    path_.value = '/'
    path_index.value = '/'
    path_setUp.value = '/'
  }

})

const time = ref()
setInterval(function() {
  let NowDate = new Date()
  let Y = NowDate.getFullYear()
  let M = NowDate.getMonth() + 1
  let D = NowDate.getDate()
  let h = NowDate.getHours()
  let m = NowDate.getMinutes()
  let s = NowDate.getSeconds()
  time.value = Y +'/'+M+'/'+D+' '+h+':'+m+':'+s
}, 1000);

const userNameValue = ref()
const cookies = document.cookie.split("; ");
for (const cookie of cookies) {
  const [name, value] = cookie.split("=");
  if (name === "userName") {
    userNameValue.value = value
  }
}

function dataTF(data){
  if(data){
    getApi('http://localhost:8080/go/time')
        .then((result) => {
          document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        })
  }
}

</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: path_ }">Home</el-breadcrumb-item>
    <div v-if="TF">
      <el-breadcrumb-item :to="{ path: path_index }">記帳表</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: path_setUp }">CSV表</el-breadcrumb-item>
      <el-breadcrumb-item>...</el-breadcrumb-item>
    </div>
  </el-breadcrumb>
  <el-text type="primary"><h2>{{ time }}</h2></el-text>
  <span id="ShowBox"></span>
  <el-divider/>
  <el-text type="">
    <router-view/>
  </el-text>
</template>

<style scoped>

</style>
