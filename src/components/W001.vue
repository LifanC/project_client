<script setup>

import axios from "axios";
import {toFindCookie} from "@/components/componentsJs/cookie";
import {setDefaultDateRange, calendar} from "@/components/componentsJs/W001.js";

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

const fromData = reactive({
  expense_and_income_number: 'A',
  inputMoney: 0,
  details: '',
})

const insTypeValue = ref('')
const radio_group_value = ref('2')
const radioItems = ref([
  {label: '收入', value: '1'},
  {label: '食物', value: '2'},
  {label: '交通', value: '3'},
  {label: '消費', value: '4'},
  {label: '3C', value: '5'},
  {label: '其他', value: '6'}
])
const datePicker = ref([])
const newDate = ref(new Date())
const defaultDateRange = ref([]);
defaultDateRange.value = setDefaultDateRange()
datePicker.value = setDefaultDateRange()

/**
 * <h3>分類W001Type方法</h3>
 */
const W001Type = (W001Type_type) => {
  console.log('W001Type_type', W001Type_type)
  switch (W001Type_type) {
    case 'insType' :
      break
    case 'insTypeClear' :
      break
  }
}
/**
 * <h3>分類radioType方法</h3>
 */
const radioType = (radioType_type) => {
  console.log('radioType_type', radioType_type)
  switch (radioType_type) {
    case 'radioInC' :
      break
    case 'radioEX' :
      break
  }
}
/**
 * <h3>分類W001Url方法</h3>
 */
const W001Url = (restfulApi_type) => {
  console.log('restfulApi_type', restfulApi_type)
  switch (restfulApi_type) {
    case 'single_search' :
      break
    case 'add' :
      break
    case 'clear' :
      break
  }
}

</script>

<template>
  {{ W001 }}測試
  <el-container>
    <el-header/>
    <el-container>
      <el-main>
        <el-space wrap>
          <el-card shadow="always">
            <el-form v-model="fromData">
              <el-form-item label="新增其他種類">
                <el-input
                    v-model="insTypeValue"
                    type="text"
                    size="small"
                    style="width: 250px;height: 100%"
                />
              </el-form-item>
              <el-form-item>
                <el-button size="small"
                           @click="W001Type('insType')">新增暫存種類
                </el-button>
                <el-button size="small"
                           @click="W001Type('insTypeClear')">清除暫存種類
                </el-button>
              </el-form-item>
              <el-form-item label="種類">
                <el-radio-group v-model="radio_group_value">
                  <el-radio-button
                      v-for="(value, key, index) in radioItems"
                      size="small"
                  >{{ key }}: {{ value }}: {{ index }}
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="選擇">
                <el-radio-group v-model="fromData.expense_and_income_number">
                  <el-radio size="small" label="A" @click="radioType('radioEX')">支出</el-radio>
                  <el-radio size="small" label="B" @click="radioType('radioInC')">收入</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="金額">
                <el-input
                    v-model.number="fromData.inputMoney"
                />
              </el-form-item>
              <el-form-item label="支出、收入內容">
                <el-input
                    v-model="fromData.details" type="textarea" style="width: 100%;height: 100%"/>
              </el-form-item>
              <el-form-item label="日期">
                <el-date-picker
                    v-model="newDate"
                    type="date"
                />
                &emsp;
                <el-button @click="W001Url('single_search')">單一查詢</el-button>
              </el-form-item>
              <el-form-item>
                <el-button @click="W001Url('add')">新增</el-button>
                <el-button @click="W001Url('clear')">清除</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-space>
        <el-divider/>
        <el-row>
          <el-form-item>
            <el-date-picker
                v-model="datePicker"
                type="daterange"
                format="YYYY-MM-DD"
                value-format="YYYY/MM/DD"
                range-separator="~"
                start-placeholder="Start"
                end-placeholder="End"
            />
            &emsp;
            <el-button @click="W001Url('search')">查詢</el-button>
          </el-form-item>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>

</style>