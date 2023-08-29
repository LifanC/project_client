<script setup>
import index from "@/components/index.vue";
import setUp from "@/components/setUp.vue";
import PubSub from "pubsub-js";

const path_ = ref('/')
const path_index = ref('/')
const path_setUp = ref('/')

PubSub.subscribe('home', function (msg, data) {
  // console.log('data',data)
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

</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: path_ }">Home</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: path_index }">記帳表</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: path_setUp }">CSV表</el-breadcrumb-item>
    <el-breadcrumb-item>...</el-breadcrumb-item>
  </el-breadcrumb>
  <el-divider/>
  <el-text type="">
    <router-view/>
  </el-text>
</template>

<style scoped>

</style>
