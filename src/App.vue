<script setup>

const path_ = ref('/')
const time = ref('')

setInterval(() => {
  let NowDate = new Date()
  let Y = NowDate.getFullYear()
  let M = NowDate.getMonth() + 1
  let D = NowDate.getDate()
  let h = NowDate.getHours()
  let m = NowDate.getMinutes()
  let s = NowDate.getSeconds()
  time.value = zeroPadding(Y, M, D, h, m, s)
}, 1000)

const zeroPadding = (Y, M, D, h, m, s) => {
  let MzeroPadding = String(M).padStart(2, '0')
  let DzeroPadding = String(D).padStart(2, '0')
  let hzeroPadding = String(h).padStart(2, '0')
  let mzeroPadding = String(m).padStart(2, '0')
  let szeroPadding = String(s).padStart(2, '0')
  let YMD = Y + '/' + MzeroPadding + '/' + DzeroPadding
  let hms = hzeroPadding + ':' + mzeroPadding + ':' + szeroPadding
  return YMD + ' ' + hms
}

</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: path_ }">Home</el-breadcrumb-item>
    <el-breadcrumb-item>...</el-breadcrumb-item>
  </el-breadcrumb>
  <el-text>{{ time }}</el-text>
  <el-divider/>
  <router-view/>
</template>

<style scoped>

</style>
