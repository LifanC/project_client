<script setup>
import PubSub from "pubsub-js";
import {getApi, postApi} from "@/components/js/api";
import {addCookie, clearCookie, toFindCookie} from "@/components/js/cookie";

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

userNameValue.value = toFindCookie()
fromData.userName = toFindCookie()

if (userNameValue.value !== undefined) {
  INP.value = true
  CER.value = true
  OUT.value = false
} else {
  INP.value = false
  CER.value = false
  OUT.value = true
}

/**
 * <h3>登入</h3>
 */
function goIn() {
  postApi('http://localhost:8080/go/getGo', fromData.userName)
      .then((result) => {
        if (result === '') {
          clearCookie()
          show2.value = false
          if (fromData.userName === '' || fromData.userName === undefined) {
            show.value = false
            show2.value = true
          } else {
            show3.value = true
          }
          fromData.userName = ''
          PubSub.publish('home', false)
          dialogVisible.value = true
        } else {
          dataTF(true)
          addCookie(result)
          fromData.userName = result
          INP.value = true
          CER.value = true
          OUT.value = false
          show.value = true
          userNa.value = []
          PubSub.publish('home', true)
          dialogVisible.value = false
        }
      })
}

/**
 * <h3>登出</h3>
 */
function goOut() {
  clearCookie()
  INP.value = false
  CER.value = false
  OUT.value = true
  fromData.userName = ''
  show.value = false
  show2.value = true
  PubSub.publish('home', false)
  dialogVisible.value = false
}

if (userNameValue.value !== undefined) {
  PubSub.publish('home', true)
  show2.value = false
} else {
  PubSub.publish('home', false)
  show.value = false
  show2.value = true
}

const userNa = ref([])

function getUserName() {
  getApi('http://localhost:8080/go/getUserName')
      .then((result) => {
        userNa.value = result
      })
}

PubSub.subscribe('home', function (msg, data) {
  dataTF(data)
  userNameValue.value = toFindCookie()
  if (toFindCookie() === undefined) {
    userNameValue.value = '登出'
  }
})

function dataTF(data) {
  if (data) {
    getApi('http://localhost:8080/go/time')
        .then((result) => {
          clearCookie()
        })
  }
}

if (toFindCookie() === undefined) {
  let currentURL = window.location.href;
  if (currentURL !== "http://localhost:5173/") {
    location.href = "http://localhost:5173/"
  }
}

const dialogVisible = ref(false)
const handleClose = (() => {
  fromData.userName = ''
  dialogVisible.value = false
})

</script>

<template>
  <el-container class="layout-container-demo">
    <span>{{ userNameValue }}</span>
    <el-header>
      <div class="toolbar">
        <h1>Luke's 作品集</h1>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-button plain @click="dialogVisible = true">
          使用者管理
        </el-button>
      </el-aside>
      <el-container>
        <el-main>
          Main
        </el-main>
      </el-container>
    </el-container>
  </el-container>
  <el-dialog
      v-model="dialogVisible"
      width="400px"
      :before-close="handleClose"
  >
    <el-row>
      <el-card shadow="never">
        <el-form v-model="fromData">
          <el-form-item label="使用者">
            <el-input :disabled="INP" type="text" maxlength="6" v-model="fromData.userName"/>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="CER" type="primary" @click="goIn">登入</el-button>
            <el-button :disabled="OUT" type="primary" @click="goOut">登出</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-row>
    <el-button link type="default" @click="getUserName">查詢使用者</el-button>
    <el-form-item>
      <el-text type="success" v-for="un in userNa">{{ `${un}&emsp;` }}</el-text>
    </el-form-item>
    <el-form-item>
      <el-text v-if="show" type="success" size="small"><h3>成功</h3></el-text>
      <el-text v-else-if="show2" type="warning" size="small"><h3>請輸入使用者</h3></el-text>
      <el-text v-else-if="show3" type="danger" size="small"><h3>失敗</h3></el-text>
    </el-form-item>
  </el-dialog>
</template>

<style scoped>
.demo-calendar {
  height: 100%;
  width: 700px;
}

.layout-container-demo .el-header {
  background-color: white;
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