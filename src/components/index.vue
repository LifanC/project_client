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

const permissions_btn = ref(false)

const permissionsFunction = () => {
  permissions_btn.value = true
}

const permissionsFromData = reactive({
  account: '',
  password: '',
})

const selectEncryption = ref([])
const selectPrivatedata = ref([])
const W005_table_column = ref([
  {'account': '帳號'},
  {'password': '密碼'}
])

const permissionsFunctionSelect = async () => {
  let pattern = /^[A-Z,a-z,\d]+$/
  let account_password = pattern.test(permissionsFromData.account) && pattern.test(permissionsFromData.password)
  if (account_password && permissionsFromData.account.length === 10 && permissionsFromData.password.length === 10) {
    AP_Text.value = ''
    try {
      const response = await axios.post('/Index/' + permissionsFunctionSelect.name, {
        account: permissionsFromData.account,
        password: permissionsFromData.password
      })
      permissions_btn.value = (response.data.isNotEmpty) ? false : true
      permissions_ft.value = (response.data.isNotEmpty) ? false : true
      selectEncryption.value = response.data.selectEncryption
    } catch (error) {
      console.error('permissionsFunctionSelect Error:', error);
    }
  } else {
    AP_Text.value = '輸入錯誤'
    accountText.value = permissionsFromData.account
    passwordText.value = permissionsFromData.password
    permissionsFromData.account = ''
    permissionsFromData.password = ''
  }
}

const AP_Text = ref('')
const accountText = ref('')
const passwordText = ref('')

const permissionsFunctionAdd = async () => {
  let pattern = /^[A-Z,a-z,\d]+$/
  let account_password = pattern.test(permissionsFromData.account) && pattern.test(permissionsFromData.password)
  if (account_password && permissionsFromData.account.length === 10 && permissionsFromData.password.length === 10) {
    AP_Text.value = ''
    try {
      const response = await axios.post('/Index/' + permissionsFunctionAdd.name, {
        account: permissionsFromData.account,
        password: permissionsFromData.password
      })
      if (response.data) {
        AP_Text.value = '新增成功'
        permissionsFromData.account = ''
        permissionsFromData.password = ''
      } else {
        AP_Text.value = '新增失敗'
        permissionsFromData.account = ''
        permissionsFromData.password = ''
      }
    } catch (error) {
      console.error('permissionsFunctionAdd Error:', error);
    }
  } else {
    AP_Text.value = '輸入錯誤'
    accountText.value = permissionsFromData.account
    passwordText.value = permissionsFromData.password
    permissionsFromData.account = ''
    permissionsFromData.password = ''
  }
}

const permissionsFunctionAdmin = async () => {
  try {
    const response = await axios.post('/Index/' + permissionsFunctionAdmin.name, {
      account: permissionsFromData.account,
      password: permissionsFromData.password
    })
    if (response.data.isNotEmpty) {
      selectPrivatedata.value = response.data.selectPrivatedata
    }
    permissionsFromData.account = ''
    permissionsFromData.password = ''
  } catch (error) {
    console.error('permissionsFunctionAdmin Error:', error);
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
                <el-button @click="permissionsFunction">管理權限</el-button>
              </el-button-group>
            </el-descriptions-item>
          </el-descriptions>
        </el-form>
        {{ Start_indexUrl_type }}
        <el-table
            :data="selectEncryption"
            style="width: 500px"
            empty-text="無資料"
        >
          <el-table-column
              v-for="i in W005_table_column"
              :label="i[Object.keys(i)[0]].toString()"
              :prop="Object.keys(i).toString()"
          />
        </el-table>
      </el-aside>
      <el-main v-if="permissions_btn">
        <el-form v-model="permissionsFromData">
          <el-text>帳號、密碼 : 輸入10碼</el-text>
          <el-row>
            <el-input
                style="width:250px"
                v-model="permissionsFromData.account"
                maxlength="10"
                show-word-limit
            >
              <template #prepend>帳號</template>
            </el-input>
          </el-row>
          <el-row>
            <el-input
                style="width:250px"
                v-model="permissionsFromData.password"
                maxlength="10"
                show-word-limit
            >
              <template #prepend>密碼</template>
            </el-input>
          </el-row>
        </el-form>
        <el-button-group>
          <el-button @click="permissionsFunctionSelect">查詢管理權限</el-button>
          <el-button @click="permissionsFunctionAdd">新增管理權限</el-button>
          <el-button @click="permissionsFunctionAdmin">BOSS權限</el-button>
        </el-button-group>
        <p>{{ AP_Text }}</p>
        <p>{{ accountText }}</p>
        <p>{{ passwordText }}</p>
        <el-table
            :data="selectPrivatedata"
            style="width: 500px"
            empty-text="無資料"
        >
          <el-table-column
              v-for="i in W005_table_column"
              :label="i[Object.keys(i)[0]].toString()"
              :prop="Object.keys(i).toString()"
          />
        </el-table>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>

</style>