<script setup>

import axios from "axios";

const rearEnd = 'http://localhost:8080'
const W001 = ref('')

goW001()

function goW001() {
  let path = window.location.pathname + '/';
  axios.get(rearEnd + path + goW001.name)
      .then((response) => {
        W001.value = response.data
      })
}

</script>

<template>
  {{ W001 }}
</template>

<style scoped>

</style>