<script setup>
import index from "@/components/index.vue";
import setUp from "@/components/setUp.vue";

</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/index' }">記帳表</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/setUp' }">CSV表</el-breadcrumb-item>
    <el-breadcrumb-item>...</el-breadcrumb-item>
  </el-breadcrumb>
  <el-divider/>
  <el-text type="">
    <router-view/>
  </el-text>
</template>

<style scoped>

</style>
