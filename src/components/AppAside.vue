<script setup>

const tOrf = ref()

function handleClose(key, keyPath) {
  tOrf.value = false
  let arr = [tOrf.value,key]
  PubSub.publish('main', arr)
}

function handleSelect(key, keyPath) {
  tOrf.value = true
  let arr = [tOrf.value,key]
  PubSub.publish('main', arr)
}



</script>

<template>
  <el-aside width="200px">
    <el-menu
        @select="handleSelect"
        @close="handleClose"
    >
      <el-sub-menu index="A">
        <template #title>
          Luke's Toolkit 工具包
        </template>
        <el-menu-item index="A1">
          <h1>記帳表</h1>
        </el-menu-item>
        <el-menu-item index="A2">
          <h1>顯示Excel內容</h1>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>

<style scoped>

</style>