<script setup>

import axios from "axios";
import {addCookie, clearCookie, toFindCookie} from "@/components/componentsJs/cookie";

axios.defaults.baseURL = 'http://localhost:8080'
const fromData = reactive({
  f_name: '',
  number: '',
  restfulApi_type: '',
  permissions_value: '',
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
        if (fromData_permissions_value.value === 'A') {
          permissions_ft.value = true
        } else if (fromData_permissions_value.value === 'B') {
          permissions_ft.value = false
        }
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

const fromData_permissions_value = ref('A')

const indexUrl = async (restfulApi_type) => {
  if (isText.value && isNumeric.value) {
    fromData.restfulApi_type = restfulApi_type
    fromData.permissions_value = fromData_permissions_value.value
    try {
      const response = await axios({
        method: 'post',
        url: '/Index/' + indexUrl.name,
        data: fromData
      });
      if (response.data[0]) {
        if (restfulApi_type === 'Delete') {
          quitIndexUrl()
          permissions_ft.value = true
        } else {
          fromData.permissions_value = fromData_permissions_value.value
          const response_permissions = await axios({
            method: 'post',
            url: '/Index/' + indexUrl.name + 'Permissions',
            data: fromData
          });
          addCookie(fromData.f_name, fromData.number, fromData_permissions_value.value)
          permissions_ft.value = true
          PubSub.publish('IndexUrl', response.data[0])
        }
        Start_indexUrl_type.value = response.data[1]
      } else {
        quitIndexUrl()
        PubSub.publish('IndexUrl', response.data[0])
        Start_indexUrl_type.value = response.data[1]
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
  fromData_permissions_value.value = 'A'
  permissions_ft.value = true
}

if (toFindCookie() !== undefined) {
  fromData.f_name = toFindCookie().substring(0, 1)
  fromData.number = toFindCookie().substring(1, 3)
  fromData_permissions_value.value = toFindCookie().substring(3, 4)
  isText.value = true
  isNumeric.value = true
}

indexUrlDefault()
const permissions = ref([])
const permissions_ft = ref(true)

async function indexUrlDefault() {
  try {
    const response = await axios.get('/Index/' + indexUrlDefault.name)
    permissions.value = response.data
  } catch (error) {
    console.error('indexUrlDefault Error:', error);
  }
}

const account_number = ref('')
const password_number = ref('')
const permissions_btn = ref(false)
const Account = ref('')
const Password = ref('')

const permissionsFunction = async (val) => {
  if (val) {
    if (permissions_btn.value) {
      let fromBean = {
        account: account_number.value,
        password: password_number.value
      }
      try {
        const response = await axios({
          method: 'post',
          url: '/Index/' + permissionsFunction.name,
          data: fromBean
        });
        permissions_btn.value = !response.data
        permissions_ft.value = !response.data
      } catch (error) {
        console.error('indexUrlDefault Error:', error);
      }
    }
  } else {
    permissions_btn.value = true
    const responseDefault = await axios({
      method: 'get',
      url: '/Index/' + 'permissionsDefault'
    });
    Account.value = responseDefault.data[0]
    Password.value = responseDefault.data[1]
  }
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
              <el-row>
                <el-form-item>
                  <el-select
                      style="width:200px"
                      v-model="fromData_permissions_value"
                      filterable
                      :disabled="permissions_ft"
                  >
                    <el-option
                        v-for="item in permissions"
                        :key="item.PERMISSION_VALUE"
                        :label="`${item.PERMISSION_NAME} - ${item.PERMISSION_VALUE}`"
                        :value="item.PERMISSION_VALUE"
                    >
                      <span style="float: left">{{ item.PERMISSION_NAME }}</span>
                      <span style=" float: right;
                          color: var(--el-text-color-secondary);
                          font-size: 13px;"
                      >{{ item.PERMISSION_VALUE }}</span>
                    </el-option>
                  </el-select>
                  <el-text v-if="!isText">輸入英文 : 大寫。範例 : A</el-text>
                  <el-input
                      style="width:200px"
                      v-model="fromData.f_name"
                      maxlength="1"
                      show-word-limit
                      @input="checkIf('name')"
                  >
                    <template #prepend>F-Name</template>
                  </el-input>
                  <el-text v-if="!isNumeric">輸入數字 : 2碼。範例 : 01</el-text>
                  <el-input
                      style="width:200px"
                      v-model="fromData.number"
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
                <el-button @click="permissionsFunction(false)">管理權限</el-button>
              </el-button-group>
            </el-descriptions-item>
          </el-descriptions>
        </el-form>
        {{ Start_indexUrl_type }}
      </el-aside>
      <el-main v-if="permissions_btn">
        <el-row>
          <el-input
              style="width:250px"
              v-model="account_number"
              maxlength="10"
              show-word-limit
              :placeholder=Account
          />
        </el-row>
        <el-row>
          <el-input
              style="width:250px"
              v-model="password_number"
              maxlength="10"
              show-word-limit
              :placeholder=Password
          />
        </el-row>
        <el-button @click="permissionsFunction(true)">查詢管理權限</el-button>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>

</style>