<script setup>

import axios from "axios";
import {toFindCookie, addCookie, clearCookie} from "@/components/componentsJs/cookie";

axios.defaults.baseURL = 'http://localhost:8080'

const fromData = reactive({
  accountNumber: '',
  password: '',
})

const errors = reactive({
  accountNumber: '',
  password: '',
})

if (toFindCookie() !== undefined) {
  let findCookie = toFindCookie().split('|')
  fromData.accountNumber = findCookie[0]
  fromData.password = findCookie[1]
  errors.accountNumber = ''
  errors.password = ''
}

const adminFromData = reactive({
  adminAccountNumber: '',
  adminPassword: '',
})

const isText = ref(false)
const checkIf = (cIf) => {
  switch (cIf) {
    case 'accountNumber':
      if (!fromData.accountNumber) {
        if (/^[A-Za-z0-9]+$/.test(fromData.accountNumber)) {
          errors.accountNumber = ''
        } else {
          errors.accountNumber = '輸入錯誤'
        }
      }
      break
    case 'password':
      if (!fromData.password) {
        if (/^[0-9]+$/.test(fromData.password)) {
          errors.password = ''
        } else {
          errors.password = '輸入錯誤'
        }
      }
      break
  }
}

const indexUrl = async (restfulApi_type) => {
  errors.accountNumber = ''
  errors.password = ''
  switch (restfulApi_type) {
    case 'Login':
      try {
        const response = await axios({
          method: 'post',
          url: '/Index/' + indexUrl.name,
          data: fromData
        });
        let data = response.data
        if (data) {
          fromData.accountNumber = ''
          fromData.password = ''
          if (toFindCookie() !== undefined) {
            let findCookie = toFindCookie().split('|')
            fromData.accountNumber = findCookie[0]
            fromData.password = findCookie[1]
            PubSub.publish('IndexUrl', data)
          } else {
            PubSub.publish('IndexUrl', !data)
          }
        } else {
          addCookie(fromData.accountNumber, fromData.password)
          PubSub.publish('IndexUrl', !data)
        }
      } catch (error) {
        console.error('indexUrl請求失敗:', error);
      }
      break
    case 'LoginOut':
      clearCookie()
      fromData.accountNumber = ''
      fromData.password = ''
      PubSub.publish('IndexUrl', false)
      break
  }
}

const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogVal = ref()
const tableIndex = ref([]);
const tableIndexh = ref([]);
const message = ref('');
const indexTableColumn = ref([
  {'accountNumber': '帳號'},
  {'password': '密碼'},
  {'update_time': '日期'}
])

const dialogMethod = async (val) => {
  dialogVisible.value = true
  let valArr = ['註冊', '更新', '刪除', '查詢']
  dialogTitle.value = valArr[val - 1]
  dialogVal.value = val
}

const dialogAdmin = async () => {
  try {
    const response = await axios({
      method: 'post',
      url: '/Index/' + dialogAdmin.name,
      data: adminFromData
    });
    let data = response.data
    tableIndex.value = data[0]
    tableIndexh.value = data[1]
    adminFromData.adminAccountNumber = ''
    adminFromData.adminPassword = ''

  } catch (error) {
    console.error('dialogAdmin請求失敗:', error);
  }
}
const dialogVisibleClean = async () => {
  errors.accountNumber = ''
  errors.password = ''
  adminFromData.adminAccountNumber = ''
  adminFromData.adminPassword = ''
  dialogVisible.value = false
  dialogVal.value = null;
  message.value = ''
}

const dialogVisibleMethod = async () => {
  fromData.dialogValue = dialogVal.value
  if (dialogVal.value != 3) {
    clearCookie()
  }
  try {
    const response = await axios({
      method: 'post',
      url: '/Index/' + dialogVisibleMethod.name,
      data: fromData
    });
    let data = response.data
    message.value = data[0]
    tableIndex.value = data[1][0]
    tableIndexh.value = data[1][1]
    PubSub.publish('IndexUrl', false)
  } catch (error) {
    console.error('dialogVisibleMethod請求失敗:', error);
  }
}

</script>

<template>
  <el-container>
    <el-header>
      <el-text size="large"><b>首頁&emsp;使用者登入</b></el-text>
    </el-header>
    <el-container>
      <el-aside width="300px">
        <el-form v-model="fromData">
          <el-row>
            <el-form-item>
              <el-input
                  style="width:100%"
                  v-model="fromData.accountNumber"
                  maxlength="10"
                  show-word-limit
                  @blur="checkIf('accountNumber')"
                  clearable
              >
                <template #prepend>帳號</template>
              </el-input>
              <span v-if="errors.accountNumber">{{ errors.accountNumber }}</span>
              <el-input
                  style="width:100%"
                  v-model="fromData.password"
                  maxlength="10"
                  show-word-limit
                  @blur="checkIf('password')"
                  clearable
              >
                <template #prepend>密碼</template>
              </el-input>
              <span v-if="errors.password">{{ errors.password }}</span>
            </el-form-item>
          </el-row>
        </el-form>
        <el-button-group>
          <el-button @click="indexUrl('Login')">登入</el-button>
          <el-button @click="indexUrl('LoginOut')">登出</el-button>
        </el-button-group>
        <el-button-group>
          <el-button @click="dialogMethod(1)">註冊</el-button>
          <el-button @click="dialogMethod(2)">更新</el-button>
          <el-button @click="dialogMethod(3)">刪除</el-button>
          <el-button @click="dialogMethod(4)">查詢</el-button>
        </el-button-group>
      </el-aside>
    </el-container>
  </el-container>
  <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500"
  >
    <el-row>
      <el-form v-model="adminFromData">
        <el-input
            style="width:50%"
            v-model="adminFromData.adminAccountNumber"
            clearable
        >
          <template #prepend>管理帳號</template>
        </el-input>
        <el-input
            style="width:50%"
            v-model="adminFromData.adminPassword"
            clearable
        >
          <template #prepend>管理密碼</template>
        </el-input>
      </el-form>
    </el-row>
    <el-button type="primary" @click="dialogAdmin">送出</el-button>
    <p>主要資料</p>
    <el-row>
      <el-table
          :data="tableIndex"
          border
          style="width: 500px; height: 100px;"
          empty-text="無資料"
      >
        <el-table-column
            v-for="i in indexTableColumn"
            :label="i[Object.keys(i)[0]].toString()"
            :prop="Object.keys(i).toString()"
        />
      </el-table>
    </el-row>
    <p>異動資料</p>
    <el-row>
      <el-table
          :data="tableIndexh"
          border
          style="width: 500px; height: 250px;"
          empty-text="無資料"
      >
        <el-table-column
            v-for="i in indexTableColumn"
            :label="i[Object.keys(i)[0]].toString()"
            :prop="Object.keys(i).toString()"
        />
      </el-table>
    </el-row>
    <span>{{ dialogTitle }}</span>
    <el-form v-model="fromData">
      <el-row>
        <el-form-item>
          <el-input
              style="width:100%"
              v-model="fromData.accountNumber"
              maxlength="10"
              show-word-limit
              @blur="checkIf('accountNumber')"
              clearable
          >
            <template #prepend>帳號</template>
          </el-input>
          <span v-if="errors.accountNumber">{{ errors.accountNumber }}</span>
          <el-input
              style="width:100%"
              v-model="fromData.password"
              maxlength="10"
              show-word-limit
              @blur="checkIf('password')"
              clearable
          >
            <template #prepend>密碼</template>
          </el-input>
          <span v-if="errors.password">{{ errors.password }}</span>
        </el-form-item>
      </el-row>
    </el-form>
    <template #footer>
      {{ message }}
      <el-button @click="dialogVisibleClean">取消</el-button>
      <el-button type="primary" @click="dialogVisibleMethod">
        {{ dialogTitle }}
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>

</style>