<script setup>

import axios from "axios";
import {toFindCookie} from "@/components/componentsJs/cookie";
import {dateConversionYMDhms} from "@/components/componentsJs/ConvertPadding";

axios.defaults.baseURL = 'http://localhost:8080'
const frontEnd = 'http://localhost:5173'
const path = window.location.pathname + '/'
const W005 = ref('')

goW005()

async function goW005() {
  try {
    const response = await axios.get(path + goW005.name)
    W005.value = response.data
  } catch (error) {
    console.error('goW003 Error:', error);
  }
}

const fromData = reactive({
  f_name: '',
  number: '',
  fileName: 'W005F',
})

const permissions_tf = ref(true)

if (toFindCookie() === undefined) {
  location.href = frontEnd
} else {
  fromData.f_name = toFindCookie().substring(0, 1)
  fromData.number = toFindCookie().substring(1, 3)
  let tempPermissions = toFindCookie().substring(3, 4)
  switch (tempPermissions) {
    case 'A':
      permissions_tf.value = true
      break
    case 'B':
      permissions_tf.value = false
      break
    default :
      permissions_tf.value = false
      break
  }
  W005UrlDefault()
}

const pathUrl = ref('')
function W005UrlDefault() {
  axios.get(path + W005UrlDefault.name, {
    params: {
      f_name: fromData.f_name,
      number: fromData.number,
      fileName: fromData.fileName
    }
  })
      .then((response) => {
        pathUrl.value = response.data
      })
      .catch(error => {
        console.error('W005UrlDefault Error:', error);
      });
}

const tableW005 = ref([])
const W005_table_column = ref([
  {'date': '日期'},
  {'expense': '費用'},
  {'income': '收入'},
  {'sum': '淨利'}
])

const textLog = ref([])

const method = async (val) => {
  textLog.value = []
  switch (val) {
    case 'Select' :
      try {
        const response = await axios.post(path + goW005.name + method.name + val, {
          GoW005: fromData
        })
        let data = response.data.data
        tableW005.value = data.dataParams
        for (let i = 0; i < data.logList.length; i++) {
          textLog.value.push(data.logList[i][i + 1])
          let logLists = data.logLists[i][i + 1]
          for (let logListsKey in logLists) {
            textLog.value.push(logLists[logListsKey])
          }
          textLog.value.push('')
        }
      } catch (error) {
        console.error('Select Error:', error);
      }
      break
  }
}

</script>

<template>
  <el-container>
    <el-header>{{ W005 }}</el-header>
    <el-container>
      <el-aside width="500px">
        <el-text>{{ pathUrl}}</el-text>
        <el-form v-model="fromData">
          <el-row>
            <el-button-group>
              <el-button
                  style="width: 110px"
                  @click="method('Select')"
              >查詢
              </el-button>
            </el-button-group>
          </el-row>
          <el-table
              :data="tableW005"
              border
              height="500px"
              style="width: 1300px"
              empty-text="無資料"
              show-summary="show-summary"
              sum-text="合計"
          >
            <el-table-column
                v-for="i in W005_table_column"
                :label="i[Object.keys(i)[0]].toString()"
                :prop="Object.keys(i).toString()"
            />
          </el-table>
        </el-form>
      </el-aside>
      <el-main>
        <el-text
            v-for="(item, index) in textLog"
            :key="index"
        >
          {{ item }}<br>
        </el-text>
      </el-main>
    </el-container>
  </el-container>

</template>

<style scoped>

</style>