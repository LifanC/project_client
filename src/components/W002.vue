<script setup>

import axios from "axios";
import {toFindCookie} from "@/components/componentsJs/cookie";

const rearEnd = 'http://localhost:8080'
const frontEnd = 'http://localhost:5173'
const path = window.location.pathname;
const W002 = ref('')

goW002()

function goW002() {
  axios.get(rearEnd + path + '/' + goW002.name)
      .then((response) => {
        W002.value = response.data
      })
}

if (toFindCookie() === undefined) {
  location.href = frontEnd
}

</script>

<template>
  <el-container>
    <el-header>{{ W002 }}</el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<style scoped>

</style>