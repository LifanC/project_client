<script setup>
import AppAside from "@/components/AppAside.vue";
import index from "@/components/index.vue";
import setUp from "@/components/setUp.vue";

const A1 = ref()
const A2 = ref()

PubSub.subscribe('main', function (msg, data) {
  // console.log('data',data)
  A1.value = false
  A2.value = false
  switch (data[1]) {
    case 'A1':
      A1.value = true
      break
    case 'A2':
      A2.value = true
      PubSub.publish('A2')
      break
  }

})


</script>

<template>
  <el-container>
    <AppAside/>
    <el-container>
      <div v-show="A1">
        <index/>
      </div>
      <div v-show="A2">
        <setUp/>
      </div>
    </el-container>
  </el-container>
</template>

<style scoped>

</style>
