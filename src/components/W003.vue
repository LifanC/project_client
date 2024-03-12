<script setup>

import axios from "axios";
import {toFindCookie} from "@/components/componentsJs/cookie";
import {setDateRange} from "@/components/componentsJs/W001";

axios.defaults.baseURL = 'http://localhost:8080'
const frontEnd = 'http://localhost:5173'
const path = window.location.pathname + '/'
const W003 = ref('')

goW003()

async function goW003() {
  try {
    const response = await axios.get(path + goW003.name)
    W003.value = response.data
  } catch (error) {
    console.error('goW003 Error:', error);
  }
}

const fromData = reactive({
  f_name: '',
  number: '',
})

if (toFindCookie() === undefined) {
  location.href = frontEnd
} else {
  fromData.f_name = toFindCookie().substring(0, 1)
  fromData.number = toFindCookie().substring(1, 3)
  W003UrlDefault()
}

function W003UrlDefault() {
  monthProportion()
}

async function monthProportion() {
  try {
    const response = await axios.post(path + goW003.name + monthProportion.name, {
      GoW003_fNume_number: [fromData.f_name, fromData.number],
      GoW003_setDateRangeLast: setDateRange(-1),
      GoW003_setDateRangeThis: setDateRange(0),
      GoW003_setDateRangeNext: setDateRange(1),
    })
    console.log('list12',response.data[0])
    console.log('list2',response.data[1])
  } catch (error) {
    console.error('monthProportion Error:', error);
  }
}

</script>

<template>
  <el-container>
    <el-header>{{ W003 }}</el-header>
    <el-container>
      <el-aside width="100px">

      </el-aside>
      <el-main>

      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>

</style>