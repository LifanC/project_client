<script setup>

import axios from "axios";
import {toFindCookie} from "@/components/componentsJs/cookie";

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

if (toFindCookie() === undefined) {
  let currentURL = window.location.href;
  if (currentURL !== 'http://localhost:5173/') {
    location.href = 'http://localhost:5173/'
  }
}

</script>

<template>
  {{ W001 }}
</template>

<style scoped>

</style>