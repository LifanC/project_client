<script setup>
import {zeroPadding} from "@/components/componentsJs/ConvertPadding"

const date = ref('')
const time = ref('')
const showUrl = ref(false)

setInterval(() => {
  let NowDate = new Date()
  let Y = NowDate.getFullYear()
  let M = NowDate.getMonth() + 1
  let D = NowDate.getDate()
  let h = NowDate.getHours()
  let m = NowDate.getMinutes()
  let s = NowDate.getSeconds()
  date.value = Y + '/' + zeroPadding(M, 2) + '/' + zeroPadding(D, 2)
  time.value = zeroPadding(h, 2) + ':' + zeroPadding(m, 2) + ':' + zeroPadding(s, 2)
}, 1000)

const handleSelect = (url) => {
  location.href = "/" + url
}

PubSub.subscribe('IndexUrl', function (msg, data) {
  // console.log(msg, data)
  showUrl.value = data
})

</script>

<template>
  <el-container>
    <el-header>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">Index</el-breadcrumb-item>
        <el-breadcrumb-item>...</el-breadcrumb-item>
      </el-breadcrumb>
      <el-text>{{ date }}&emsp;{{ time }}</el-text>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
            @select="handleSelect"
        >
          <div v-if="showUrl">
            <el-menu-item index="W001">
              <el-text>W001</el-text>
            </el-menu-item>
            <el-menu-item index="W002">
              <el-text>W002</el-text>
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
