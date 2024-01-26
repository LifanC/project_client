<script setup>

import axios from "axios";
import {toFindCookie} from "@/components/componentsJs/cookie";

const rearEnd = 'http://localhost:8080'
const frontEnd = 'http://localhost:5173'
const path = window.location.pathname + '/';
const W002 = ref('')

goW002()

function goW002() {
  axios.get(rearEnd + path + goW002.name)
      .then((response) => {
        W002.value = response.data
      })
}

if (toFindCookie() === undefined) {
  let currentURL = window.location.href;
  if (currentURL !== frontEnd + path) {
    location.href = frontEnd + path
  }
}

</script>

<template>
  {{ W002 }}測試
</template>

<style scoped>

</style>