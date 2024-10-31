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

const msgW001 = ref('W001')
const dataW001 = ref('記帳系統')
PubSub.subscribe('W001', function (msg, data) {
  // console.log(msg, data)
  msgW001.value = msg
  dataW001.value = data
})

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
            <el-menu-item :index="msgW001">
              <el-text>{{ dataW001 }}</el-text>
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
