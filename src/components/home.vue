<script setup>

import PubSub from "pubsub-js";
import {getApi, postApi} from "@/components/js/api";

const fromData = reactive({
  userName: '',
})

const userNameValue = ref()
const INP = ref(true)
const CER = ref(true)
const OUT = ref(true)
const show = ref(true)
const show2 = ref(true)
const show3 = ref(true)

const cookies = document.cookie.split("; ");
for (const cookie of cookies) {
  const [name, value] = cookie.split("=");
  if (name === "userName") {
    userNameValue.value = value
  }
}

fromData.userName = userNameValue.value

if (userNameValue.value) {
  INP.value = true
  CER.value = true
  OUT.value = false
} else {
  INP.value = false
  CER.value = false
  OUT.value = true
}

function goIn() {
  postApi('http://localhost:8080/go/getGo', fromData.userName)
      .then((result) => {
        if (result === '') {
          document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          PubSub.publish('home', false)
          show2.value = false
          if (fromData.userName === '' || fromData.userName === undefined) {
            show.value = false
            show2.value = true
          } else {
            show3.value = true
          }
          fromData.userName = ''
        } else {
          document.cookie = `userName=${result}`
          fromData.userName = result
          INP.value = true
          CER.value = true
          OUT.value = false
          PubSub.publish('home', true)
          show.value = true
        }
      })
}

function goOut() {
  document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  INP.value = false
  CER.value = false
  OUT.value = true
  fromData.userName = ''
  PubSub.publish('home', false)
  show.value = false
  show2.value = true
}

if (userNameValue.value) {
  PubSub.publish('home', true)
  show2.value = false
} else {
  show.value = false
  show2.value = true
}

</script>

<template>
  <el-container>
      <el-main>
        <el-row>
          <el-card shadow="never">
            <el-form v-model="fromData">
              <el-form-item label="使用者">
                <el-input :disabled="INP" type="text" v-model="fromData.userName"/>
              </el-form-item>
              <el-form-item>
                <el-button :disabled="CER" type="primary" @click="goIn">登入</el-button>
                <el-button :disabled="OUT" type="primary" @click="goOut">登出</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-row>
        admin
        <el-form-item>
          <div v-if="show">
            <el-text type="success" size="large"><h1>成功</h1></el-text>
          </div>
          <div v-else-if="show2">
            <el-text type="warning" size="large"><h1>請輸入使用者</h1></el-text>
          </div>
          <div v-else-if="show3">
            <el-text type="danger" size="large"><h1>失敗</h1></el-text>
          </div>
        </el-form-item>
      </el-main>
    </el-container>
</template>

<style scoped>
.demo-calendar {
  height: 100%;
  width: 700px;
}

.layout-container-demo .el-header {
  background-color: black;
}

.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  height: 100%;
  right: 20px;
}

.custom-width {
  width: 250px;
}
</style>