<script setup>

import axios from "axios";
import {toFindCookie} from "@/components/componentsJs/cookie";
import {setDefaultDateRange, calendar} from "@/components/componentsJs/W001.js";

const rearEnd = 'http://localhost:8080'
const frontEnd = 'http://localhost:5173'
const path = window.location.pathname + '/';
const W001 = ref('')

goW001()

function goW001() {
  axios.get(rearEnd + path + goW001.name)
      .then((response) => {
        W001.value = response.data
      })
}

const fromData = reactive({
  expense_and_income_number: 'A',
  input_money: 0,
  details: '',
  new_date: new Date(),
  radio_group_value: '2',
  radio_items: '',
  f_name: '',
  number: '',
  id: '',
})

if (toFindCookie() === undefined) {
  let currentURL = window.location.href;
  if (currentURL !== frontEnd + path) {
    location.href = frontEnd + path
  }
} else {
  fromData.f_name = toFindCookie().substring(0, 1)
  fromData.number = toFindCookie().substring(1, 3)
  W001UrlDefault()
}

function W001UrlDefault() {
  axios.get(rearEnd + path + W001UrlDefault.name, {
    params: {
      f_name: fromData.f_name,
      number: fromData.number
    }
  })
      .then((response) => {
        tableW001.value = response.data
      })
}

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
const defaultDateRange = ref([]);
const tableW001 = ref([]);
const W001_table_column = ref([
  {'radio_items': '種類名稱'},
  {'expense_and_income_name': '選擇名稱'},
  {'input_money': '金額'},
  {'details': '內容'},
  {'new_date_Format': '日期'}
])
const modifyTF = ref(true)

defaultDateRange.value = setDefaultDateRange()
datePicker.value = setDefaultDateRange()

/**
 * <h3>分類W001Type方法</h3>
 */
const W001Type = (W001Type_type) => {
  switch (W001Type_type) {
    case 'insType' :
      let TF = true
      if (insTypeValue.value) {
        radioItems.value.forEach(element => {
          if (element.label !== insTypeValue.value) return
          TF = false
        })
        if (TF) {
          radioItems.value.push(
              {label: insTypeValue.value, value: (radioItems.value.length + 1).toString()}
          )
        }
      }
      insTypeValue.value = ''
      break
    case 'insTypeClear' :
      if (radioItems.value.length > 6) {
        radioItems.value.splice(-1, 1)
      }
      break
  }
}

/**
 * <h3>分類W001Url方法</h3>
 */
const W001Url = (restfulApi_type) => {
  fromData.radio_group_value = radio_group_value.value
  fromData.radio_items = radioItems.value[+radio_group_value.value - 1].label
  switch (restfulApi_type) {
    case 'Add' :
      axios.post(rearEnd + path + goW001.name + restfulApi_type, {
        GoW001: fromData
      })
          .then((response) => {
            tableW001.value = response.data
            fromData.input_money = 0
            fromData.details = ''
          })
      break
    case 'Single_search' :
      axios.post(rearEnd + path + goW001.name + restfulApi_type, {
        GoW001: fromData
      })
          .then((response) => {
            tableW001.value = response.data
          })
      break
    case 'Search' :

      break
    case 'Clear' :
      fromData.expense_and_income_number = 'A'
      fromData.input_money = 0
      fromData.details = ''
      fromData.new_date = new Date()
      radio_group_value.value = '2'
      modifyTF.value = true
      break
    case 'Modify' :
      axios.put(rearEnd + path + goW001.name + restfulApi_type, {
        GoW001: fromData
      })
          .then((response) => {
            tableW001.value = response.data
            fromData.expense_and_income_number = 'A'
            fromData.input_money = 0
            fromData.details = ''
            fromData.new_date = new Date()
            radio_group_value.value = '2'
            modifyTF.value = true
          })
      break
  }
}

const less_than_zero = () => {
  fromData.input_money = (fromData.input_money < 0) ? 0 : fromData.input_money
  fromData.input_money = (fromData.input_money === '') ? 0 : fromData.input_money
}

const modify = (row) => {
  modifyTF.value = false
  radio_group_value.value = row.radio_group_value
  fromData.expense_and_income_number = row.expense_and_income_number
  fromData.input_money = row.input_money
  fromData.details = row.details
  fromData.id = String(row.id)
}
const confirmEventDelete = (row) => {
  axios.delete(rearEnd + path + confirmEventDelete.name, {
    params: {
      id: row.id,
      new_date_Format: row.new_date_Format,
      f_name: row.f_name,
      number: row.number
    }
  })
      .then((response) => {
        tableW001.value = response.data
      })
}

</script>

<template>
  {{ W001 }}
  <el-container>
    <el-header/>
    <el-container>
      <el-main>
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
            <el-button @click="W001Url('Search')">查詢</el-button>
          </el-form-item>
        </el-row>
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
                <el-radio-group
                    v-model="radio_group_value"
                >
                  <el-radio-button
                      v-for="radioItem in radioItems"
                      :key="radioItem.value"
                      :label="radioItem.value"
                      size="small"
                  >({{ radioItem.value }}) {{ radioItem.label }}
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="選擇">
                <el-radio-group
                    v-model="fromData.expense_and_income_number"
                >
                  <el-radio size="small" label="A">支出</el-radio>
                  <el-radio size="small" label="B">收入</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="金額">
                <el-input
                    v-model.number="fromData.input_money"
                    @input="less_than_zero"
                />
              </el-form-item>
              <el-form-item label="支出、收入內容">
                <el-input
                    v-model="fromData.details" type="textarea" style="width: 100%;height: 100%"/>
              </el-form-item>
              <el-form-item label="日期">
                <el-date-picker
                    v-model="fromData.new_date"
                    type="date"
                />
                &emsp;
                <el-button @click="W001Url('Single_search')">單一查詢</el-button>
              </el-form-item>
              <el-form-item>
                <el-button @click="W001Url('Add')">新增</el-button>
                <el-button @click="W001Url('Clear')">清除</el-button>
                <el-button :disabled="modifyTF" @click="W001Url('Modify')">修改</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-space>
        <el-divider/>
        <el-row>
          <el-table
              :data="tableW001"
              border
              height="500px"
              style="width: 1000px">
            >
            <el-table-column
                label="功能"
                width="200px"
            >
              <template #default="scope">
                <el-button
                    link
                    type="primary"
                    @click.prevent="modify(scope.row)"
                >修改金額
                </el-button>
                <el-popconfirm
                    width="220"
                    confirm-button-text="確定"
                    cancel-button-text="取消"
                    title="確定要刪除嗎?"
                    @confirm="confirmEventDelete(scope.row)"
                >
                  <template #reference>
                    <el-button link type="primary">刪除資料</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
            <el-table-column
                v-for="i in W001_table_column"
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