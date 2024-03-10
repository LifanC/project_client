<script setup>

import axios from "axios";
import {toFindCookie} from "@/components/componentsJs/cookie";
import {setDateRange} from "@/components/componentsJs/W001";

const rearEnd = 'http://localhost:8080'
const frontEnd = 'http://localhost:5173'
const path = window.location.pathname + '/'
const W003 = ref('')

goW003()

function goW003() {
  axios.get(rearEnd + path + goW003.name)
      .then((response) => {
        W003.value = response.data
      })
      .catch(error => {
        console.error('goW002 Error:', error);
      });
}

const fromData = reactive({
  f_name: '',
  number: '',
})

if (toFindCookie() === undefined) {
  location.href = frontEnd
} else {
  fromData.f_name = toFindCookie().substring(0, 1)
  fromData.number = toFindCookie().substring(1, 3)
  W003UrlDefault()
}

function W003UrlDefault() {
  monthProportion()
}

const tableW0012This = ref([]);
const tableW0012Last = ref([]);
const W001_table_column2 = ref([
  {'new_date_Format': '日期'},
  {'expense': '支出'},
  {'income': '收入'},
  {'totle_money': '總金額'}
])

function monthProportion() {
  axios.post(rearEnd + path + goW003.name + monthProportion.name, {
    GoW003_fNume_number: [fromData.f_name, fromData.number],
    GoW003_setDateRangeThis: setDateRange(0),
    GoW003_setDateRangeLast: setDateRange(-1)
  })
      .then((response) => {
        tableW0012This.value = response.data[0]
        tableW0012Last.value = response.data[1]
      })
      .catch(error => {
        console.error('monthProportion Error:', error);
      });
}

</script>

<template>
  <el-container>
    <el-header>{{ W003 }}</el-header>
    <el-container>
      <el-aside width="100px">

      </el-aside>
      <el-main>
        <el-text size="large">本月</el-text>
        <el-row>
          <el-table
              :data="tableW0012This"
              height="80px" border
              style="width: 1000px"
              v-if="tableW0012This.length > 0"
          >
            <el-table-column
                v-for="i in W001_table_column2"
                :label="i[Object.keys(i)[0]].toString()"
                :prop="Object.keys(i).toString()"
            />
          </el-table>
        </el-row>
        <el-text size="large">上月</el-text>
        <el-row>
          <el-table
              :data="tableW0012Last"
              height="80px" border
              style="width: 1000px"
              v-if="tableW0012Last.length > 0"
          >
            <el-table-column
                v-for="i in W001_table_column2"
                :label="i[Object.keys(i)[0]].toString()"
                :prop="Object.keys(i).toString()"
            />
          </el-table>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>

</style>