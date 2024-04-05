<script setup>

import axios from "axios";
import {addCookie, clearCookie, toFindCookie} from "@/components/componentsJs/cookie";

axios.defaults.baseURL = 'http://localhost:8080'
const fromData = reactive({
  f_name: '',
  number: '',
  restfulApi_type: '',
})
const Start_indexUrl_type = ref('')

const isText = ref(false)
const isNumeric = ref(false)
const checkIf = (cIf) => {
  switch (cIf) {
    case 'name':
      let patternStr = /^[A-Z]+$/
      if (patternStr.test(fromData.f_name)) {
        isText.value = true
      } else {
        isText.value = false
      }
      break
    case 'number':
      if (fromData.number.length === 2) {
        let patternNum = /^\d+$/
        if (patternNum.test(fromData.number)) {
          isNumeric.value = true
        } else {
          isNumeric.value = false
        }
      } else {
        isNumeric.value = false
      }
      break
  }

}

const indexUrl = async (restfulApi_type) => {
  if (isText.value && isNumeric.value) {
    fromData.restfulApi_type = restfulApi_type
    try {
      const response = await axios({
        method: 'post',
        url: '/Index/' + indexUrl.name,
        data: fromData
      });
      if (response.data[0] === true) {
        if (restfulApi_type === 'Delete') {
          quitIndexUrl()
        } else {
          addCookie(fromData.f_name, fromData.number)
          PubSub.publish('IndexUrl', response.data[0])
        }
        Start_indexUrl_type.value = response.data[1]
      } else if (response.data[0] === false) {
        fromData.f_name = ''
        fromData.number = ''
        Start_indexUrl_type.value = response.data[1]
        PubSub.publish('IndexUrl', response.data[0])
      }
    } catch (error) {
      console.error('indexUrl請求失敗:', error);
    }
  }
}

const quitIndexUrl = () => {
  clearCookie()
  fromData.f_name = ''
  fromData.number = ''
  Start_indexUrl_type.value = ''
  PubSub.publish('IndexUrl', false)
  isText.value = false
  isNumeric.value = false
}

if (toFindCookie() !== undefined) {
  fromData.f_name = toFindCookie().substring(0, 1)
  fromData.number = toFindCookie().substring(1, 3)
  isText.value = true
  isNumeric.value = true
}

</script>

<template>
  <el-container>
    <el-header>
      <el-text size="large"><b>首頁&emsp;使用者登入</b></el-text>
    </el-header>
    <el-container>
      <el-aside width="250px">
        <el-form v-model="fromData">
          <el-descriptions
              direction="horizontal"
              :column="1"
          >
            <el-descriptions-item>
              <el-text v-if="!isText">輸入英文 : 大寫。範例 : A</el-text>
              <el-row>
                <el-form-item>
                  <el-input v-model="fromData.f_name"
                            maxlength="1"
                            show-word-limit
                            @input="checkIf('name')"
                  >
                    <template #prepend>F-Name</template>
                  </el-input>
                </el-form-item>
              </el-row>
              <el-text v-if="!isNumeric">輸入數字 : 2碼。範例 : 01</el-text>
              <el-row>
                <el-form-item>
                  <el-input v-model="fromData.number"
                            maxlength="2"
                            show-word-limit
                            @input="checkIf('number')"
                  >
                    <template #prepend>Number</template>
                  </el-input>
                </el-form-item>
              </el-row>
              <el-button-group>
                <el-button @click="indexUrl('Login')">登入</el-button>
                <el-button @click="indexUrl('Register')">註冊</el-button>
                <el-button @click="indexUrl('Delete')">刪除</el-button>
                <el-button @click="quitIndexUrl">登出</el-button>
              </el-button-group>
            </el-descriptions-item>
          </el-descriptions>
        </el-form>
        {{ Start_indexUrl_type }}
      </el-aside>
    </el-container>
  </el-container>
</template>

<style scoped>

</style>