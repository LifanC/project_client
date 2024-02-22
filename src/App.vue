<script setup>
import {zeroPadding} from "@/components/componentsJs/ConvertPadding"
import {toFindCookie} from "@/components/componentsJs/cookie";
import {dateConversionYMDhms} from "@/components/componentsJs/ConvertPadding";


const date = ref('')
const time = ref('')
const showUrl = ref(false)

setInterval(() => {
  date.value = dateConversionYMDhms(true)
}, 1000)

const handleSelect = (url) => {
  location.href = "/" + url
}

PubSub.subscribe('IndexUrl', function (msg, data) {
  // console.log(msg, data)
  switch (data) {
    case 'true': showUrl.value = true
      break
    case 'false': showUrl.value = false
      break
  }
})
if (toFindCookie() !== undefined) {
  showUrl.value = true
}

</script>

<template>
  <el-container>
    <el-header>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">Index</el-breadcrumb-item>
        <el-breadcrumb-item>...</el-breadcrumb-item>
      </el-breadcrumb>
      <el-text>{{ date }}</el-text>
    </el-header>
    <el-container>
      <el-aside width="80px">
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
