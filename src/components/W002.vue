<script setup>

import axios from "axios";
import {toFindCookie} from "@/components/componentsJs/cookie";

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

if (toFindCookie() === undefined) {
  let currentURL = window.location.href;
  if (currentURL !== 'http://localhost:5173/') {
    location.href = 'http://localhost:5173/'
  }
}

</script>

<template>
  {{ W002 }}測試
</template>

<style scoped>

</style>