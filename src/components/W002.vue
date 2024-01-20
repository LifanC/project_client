<script setup>

import axios from "axios";

const rearEnd = 'http://localhost:8080'
const W002 = ref('')

goW002()

function goW002() {
  let path = window.location.pathname + '/';
  axios.get(rearEnd + path + goW002.name)
      .then((response) => {
        W002.value = response.data
      })
}

</script>

<template>
  {{ W002 }}
</template>

<style scoped>

</style>