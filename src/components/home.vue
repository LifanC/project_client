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
fromData.userName = userNameValue.value

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
function getUserName(){
  getApi('http://localhost:8080/go/getUserName')
      .then((result) => {
        userNa.value = result
      })
}

PubSub.subscribe('home', function (msg, data) {
  dataTF(data)
})

function dataTF(data){
  if(data){
    getApi('http://localhost:8080/go/time')
        .then((result) => {
          clearCookie()
        })
  }
}

</script>

<template>
  <el-container>
      <el-main>
        <el-row>
          <el-card shadow="never">
            <el-form v-model="fromData">
              <el-form-item label="暫時使用者">
                <el-input :disabled="INP" type="text" maxlength="6" v-model="fromData.userName"/>
              </el-form-item>
              <el-form-item>
                <el-button :disabled="CER" type="primary" @click="goIn">登入</el-button>
                <el-button :disabled="OUT" type="primary" @click="goOut">登出</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-row>
        <el-button link type="default" @click="getUserName">查詢暫時使用者</el-button>
        <el-form-item>
          <el-text type="success" v-for="un in userNa">{{`${un}&emsp;`}}</el-text>
        </el-form-item>
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