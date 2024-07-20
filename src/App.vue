<script setup>
import {toFindCookie} from "@/components/componentsJs/cookie";
import {dateConversionYMDhms} from "@/components/componentsJs/ConvertPadding";


const date = ref('')
const showUrl = ref(false)

setInterval(() => {
  date.value = dateConversionYMDhms(true)
}, 1000)

const handleSelect = (url) => {
  location.href = "/" + url
}

PubSub.subscribe('IndexUrl', function (msg, data) {
  // console.log(msg, data)
  showUrl.value = data ? true : false
})
if (toFindCookie() !== undefined) {
  showUrl.value = true
}

</script>

<template>
  <el-container>
    <el-header>
      <el-breadcrumb separator="*">
        <el-breadcrumb-item :to="{ path: '/' }">Index</el-breadcrumb-item>
        <el-breadcrumb-item></el-breadcrumb-item>
      </el-breadcrumb>
      <el-text>{{ date }}</el-text>
    </el-header>
    <el-container>
      <el-aside width="150px">
        <el-menu
            @select="handleSelect"
        >
          <div v-if="showUrl">
            <el-menu-item index="W001">
              <el-text>記帳系統 W001</el-text>
            </el-menu-item>
            <el-menu-item index="W002">
              <el-text>總務系統 W002</el-text>
            </el-menu-item>
            <el-menu-item index="W003">
              <el-text>分析系統 W003</el-text>
            </el-menu-item>
            <el-menu-item index="W004">
              <el-text>匯率系統 W004</el-text>
            </el-menu-item>
            <el-menu-item index="W005">
              <el-text>JokeAPI W005</el-text>
            </el-menu-item>
          </div>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>

</style>
