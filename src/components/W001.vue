<script setup>

import axios from "axios";
import {toFindCookie} from "@/components/componentsJs/cookie";
import {setDefaultDateRange, setDateRange} from "@/components/componentsJs/W001.js";

axios.defaults.baseURL = 'http://localhost:8080'
const frontEnd = 'http://localhost:5173'
const path = window.location.pathname + '/'
const W001 = ref('')

goW001()

async function goW001() {
  try {
    const response = await axios.get(path + goW001.name)
    W001.value = response.data
  } catch (error) {
    console.error('goW001 Error:', error);
  }
}

const fromData = reactive({
  expense_and_income_number: 'A',
  input_money: 0,
  details: '',
  new_date: new Date(),
  radio_group_value: '6',
  radio_items: '',
  f_name: '',
  number: '',
  id: '',
  setInputMoney: 0,
})

if (toFindCookie() === undefined) {
  location.href = frontEnd
} else {
  fromData.f_name = toFindCookie().substring(0, 1)
  fromData.number = toFindCookie().substring(1, 3)
  W001UrlDefault()
}

function W001UrlDefault() {
  axios.get(path + W001UrlDefault.name, {
    params: {
      f_name: fromData.f_name,
      number: fromData.number
    }
  })
      .then((response) => {
        tableW001.value = response.data[0]
        tableW0012.value = response.data[1]
      })
      .catch(error => {
        console.error('W001UrlDefault Error:', error);
      });
  monthProportion(setDateRange(0))
}

const insTypeValue = ref('')
const radio_group_value = ref('6')
const radioItems = ref([
  {label: '薪資', value: '1'},
  {label: '食物', value: '2'},
  {label: '交通', value: '3'},
  {label: '消費', value: '4'},
  {label: '3C', value: '5'},
  {label: '娛樂', value: '6'}
])
const datePicker = ref(setDefaultDateRange())
const tableW001 = ref([]);
const W001_table_column = ref([
  {'new_date_Format': '日期'},
  {'radio_items': '種類名稱'},
  {'expense_and_income_name': '選擇名稱'},
  {'input_money': '金額'},
  {'details': '內容'}
])
const tableW0012 = ref([]);
const W001_table_column2 = ref([
  {'new_date_Format': '日期'},
  {'expense': '支出'},
  {'income': '收入'},
  {'totle_money': '損益'}
])

const addTF = ref(true)
const modifyTF = ref(true)

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
              {label: insTypeValue.value, value: '7'}
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

const hint = ref('')
/**
 * <h3>分類W001Url方法</h3>
 */
const W001Url = (restfulApi_type) => {
  hint.value = ''
  Start_printIreport.value = []
  if (fromData.new_date === null) {
    fromData.new_date = new Date()
  }
  let returnAdd = false
  if (fromData.expense_and_income_number === 'A' && radio_group_value.value === '1') {
    radio_group_value.value = '6'
    returnAdd = true
  } else if (fromData.expense_and_income_number === 'B' && radio_group_value.value !== '1') {
    radio_group_value.value = '1'
    returnAdd = true
  }
  fromData.radio_group_value = radio_group_value.value
  fromData.radio_items = radioItems.value[+radio_group_value.value - 1].label
  switch (restfulApi_type) {
    case 'Add' :
      if (returnAdd) return
      axios.post(path + goW001.name + restfulApi_type, {
        GoW001: fromData
      })
          .then((response) => {
            tableW001.value = response.data[0]
            tableW0012.value = response.data[1]
            fromData.input_money = 0
            fromData.details = ''
            addTF.value = true
            hint.value = 'Success'
          })
          .catch(error => {
            console.error('Add Error:', error);
          });
      break
    case 'Single_search' :
      axios.post(path + goW001.name + restfulApi_type, {
        GoW001: fromData
      })
          .then((response) => {
            tableW001.value = response.data[0]
            tableW0012.value = response.data[1]
            hint.value = 'Success'
          })
          .catch(error => {
            console.error('Single_search Error:', error);
          });
      break
    case 'Search' :
      if (datePicker.value === null) {
        datePicker.value = setDefaultDateRange()
      }
      axios.post(path + goW001.name + restfulApi_type, {
        GoW001_datePicker: datePicker.value,
        GoW001_fNume_number: [fromData.f_name, fromData.number]
      })
          .then((response) => {
            tableW001.value = response.data.length > 0 ? response.data[0] : [];
            tableW0012.value = response.data.length > 0 ? response.data[1] : [];
            hint.value = 'Success'
          })
          .catch(error => {
            console.error('Search Error:', error);
          });
      break
    case 'Clear' :
      fromData.expense_and_income_number = 'A'
      fromData.input_money = 0
      fromData.details = ''
      fromData.new_date = new Date()
      radio_group_value.value = '6'
      modifyTF.value = true
      datePicker.value = setDefaultDateRange()
      hint.value = ''
      break
    case 'Modify' :
      if (returnAdd) return
      axios.put(path + goW001.name + restfulApi_type, {
        GoW001: fromData
      })
          .then((response) => {
            tableW001.value = response.data[0]
            tableW0012.value = response.data[1]
            fromData.expense_and_income_number = 'A'
            fromData.input_money = 0
            fromData.details = ''
            fromData.new_date = new Date()
            radio_group_value.value = '6'
            modifyTF.value = true
            hint.value = 'Success'
          })
          .catch(error => {
            console.error('Modify Error:', error);
          });
      break
  }
}

const printIreport_Array = ref([])
const handleSelectionChange = (val) => {
  printIreport_Array.value = []
  if (val.length > 0) {
    for (let valKey in val) {
      printIreport_Array.value.push(val[valKey])
    }
  }
  proportion(val)
}

const tableOneDayProportion = ref([])
const tableOneDayProportion_column = ref([
  {'income': '收入'},
  {'income_proportion': ''},
  {'expense': '支出'},
  {'expense_r2_proportion': '食物'},
  {'expense_r3_proportion': '交通'},
  {'expense_r4_proportion': '消費'},
  {'expense_r5_proportion': '3C'},
  {'expense_r6_proportion': '娛樂'},
  {'expense_r7_proportion': '其他'}
])
const proportion = (val) => {
  if (val.length === 1) {
    axios.post(path + goW001.name + proportion.name, {
      f_name: val[0].f_name,
      number: val[0].number,
      new_date_Format: val[0].new_date_Format
    })
        .then((response) => {
          tableOneDayProportion.value = response.data
        })
        .catch(error => {
          console.error('proportion Error:', error);
        });
    axios.post(path + goW001.name + proportion.name + 'Single_search', {
      f_name: val[0].f_name,
      number: val[0].number,
      new_date_Format: val[0].new_date_Format
    })
        .then((response) => {
          tableW001.value = response.data[0]
          hint.value = 'Success'
        })
        .catch(error => {
          console.error('proportion Error:', error);
        });
  }
}

const Start_printIreport = ref([])
const printIreport = () => {
  Start_printIreport.value = []
  axios.post(path + goW001.name + printIreport.name, {
    GoW001_print: printIreport_Array.value
  })
      .then((response) => {
        Start_printIreport.value.push(response.data[0], response.data[1])
      })
      .catch(error => {
        console.error('printIreport Error:', error);
      });
}

const less_than_zero = () => {
  fromData.input_money = (fromData.input_money < 0) ? 0 : fromData.input_money
  fromData.input_money = (fromData.input_money === '') ? 0 : fromData.input_money
  addTF.value = fromData.input_money <= 0;
}

const modify = (row) => {
  modifyTF.value = false
  radio_group_value.value = row.radio_group_value
  fromData.radio_group_value = row.radio_group_value
  fromData.expense_and_income_number = row.expense_and_income_number
  fromData.input_money = row.input_money
  fromData.setInputMoney = row.input_money
  fromData.details = row.details
  fromData.id = String(row.id)
  fromData.new_date = row.upate_time
}
const confirmEventDelete = (row) => {
  axios.delete(path + confirmEventDelete.name, {
    params: {
      id: row.id,
      new_date_Format: row.new_date_Format,
      f_name: row.f_name,
      number: row.number,
      expense_and_income_number: row.expense_and_income_number,
      input_money: row.input_money,
    }
  })
      .then((response) => {
        tableW001.value = response.data[0]
        tableW0012.value = response.data[1]
      })
      .catch(error => {
        console.error('confirmEventDelete Error:', error);
      });
}

function monthProportion(val) {
  axios.post(path + goW001.name + monthProportion.name, {
    GoW001_fNume_number: [fromData.f_name, fromData.number],
    GoW001_setDateRange: val
  })
      .then((response) => {
        tableOneDayProportion.value = response.data
      })

      .catch(error => {
        console.error('proportion Error:', error);
      });
}

const thisMonthNum = ref(0)
const thisMonth = (val) => {
  switch (val) {
    case 'lastMonth':
      datePicker.value = setDateRange(--thisMonthNum.value)
      monthProportion(datePicker.value)
      break
    case 'thisMonth':
      thisMonthNum.value = 0
      datePicker.value = setDateRange(0)
      monthProportion(setDateRange(0))
      break
    case 'nextMonth':
      datePicker.value = setDateRange(++thisMonthNum.value)
      monthProportion(datePicker.value)
      break
  }
}

</script>

<template>
  <el-container>
    <el-header>{{ W001 }}</el-header>
    <el-row>
      <el-table
          :data="tableOneDayProportion"
          border
          height="80px"
          style="width: 750px"
          v-if="tableOneDayProportion.length > 0"
      >
        <el-table-column
            v-for="i in tableOneDayProportion_column"
            :label="i[Object.keys(i)[0]].toString()"
            :prop="Object.keys(i).toString()"
        />
      </el-table>
    </el-row>
    <el-row>
      <el-button-group>
        <el-button @click="thisMonth('lastMonth')">上月</el-button>
        <el-button @click="thisMonth('thisMonth')">本月</el-button>
        <el-button @click="thisMonth('nextMonth')">下月</el-button>
      </el-button-group>
    </el-row>
    <el-container>
      <el-aside width="450px">
        <el-descriptions
            direction="horizontal"
            :column="2"
        >
          <el-descriptions-item>
            <el-date-picker
                v-model="datePicker"
                type="daterange"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                range-separator="~"
                start-placeholder="Start"
                end-placeholder="End"
                style="width: 200px"
            />
          </el-descriptions-item>
          <el-descriptions-item>
            <el-button @click="W001Url('Search')">查詢</el-button>
          </el-descriptions-item>
          <el-descriptions-item span="2">
            <el-button @click="printIreport()">列印報表</el-button>
            {{ Start_printIreport[0] }}&emsp;{{ Start_printIreport[1] }}
          </el-descriptions-item>
        </el-descriptions>
        <el-space wrap>
          <el-form v-model="fromData">
            <el-descriptions
                direction="vertical"
                :column="2"
                border
            >
              <el-descriptions-item label="新增分類" span="2" label-align="center">
                <el-input
                    v-model="insTypeValue"
                    type="text"
                    size="small"
                    style="width: 255px"
                    placeholder="新增下方沒有的選項"
                />
                <el-button-group>
                  <el-button size="small" @click="W001Type('insType')">新增</el-button>
                  <el-button size="small" @click="W001Type('insTypeClear')">清除分類</el-button>
                </el-button-group>
                <el-radio-group style="width: 100%" v-model="radio_group_value">
                  <el-radio-button
                      v-for="radioItem in radioItems"
                      :key="radioItem.value"
                      :label="radioItem.value"
                      size="small"
                  >({{ radioItem.value }}) {{ radioItem.label }}
                  </el-radio-button>
                </el-radio-group>
              </el-descriptions-item>
              <el-descriptions-item label="選擇" label-align="center" align="center">
                <el-radio-group v-model="fromData.expense_and_income_number">
                  <el-radio-button size="small" label="A">支出</el-radio-button>
                  <el-radio-button size="small" label="B">收入</el-radio-button>
                </el-radio-group>
              </el-descriptions-item>
              <el-descriptions-item label="金額" label-align="center" align="center">
                <el-input
                    v-model.number="fromData.input_money"
                    style="width: 100%"
                    @input="less_than_zero"
                />
              </el-descriptions-item>
              <el-descriptions-item label="款項名稱" label-align="center" align="center">
                <el-input
                    v-model="fromData.details"
                    style="width: 100%"
                    type="textarea"
                />
              </el-descriptions-item>
              <el-descriptions-item label="日期" label-align="center" align="center">
                <el-date-picker
                    v-model="fromData.new_date"
                    type="date"
                    style="width: 139px"
                />
                <el-button
                    style="width: 80px"
                    @click="W001Url('Single_search')">單一查詢
                </el-button>
                <el-button-group>
                  <el-button
                      style="width: 73px"
                      :disabled="addTF"
                      @click="W001Url('Add')">
                    新增
                  </el-button>
                  <el-button
                      style="width: 73px"
                      :disabled="modifyTF"
                      @click="W001Url('Modify')">
                    修改
                  </el-button>
                  <el-button
                      style="width: 73px"
                      @click="W001Url('Clear')">
                    清除
                  </el-button>
                </el-button-group>
              </el-descriptions-item>
            </el-descriptions>
          </el-form>
        </el-space>
        <el-text type="success">{{ hint }}</el-text>
      </el-aside>
      <el-main>
        <el-row>
          <el-table
              :data="tableW0012"
              @selection-change="handleSelectionChange"
              height="250px" border
              style="width: 1000px"
              v-if="tableW0012.length > 0"
          >
            <el-table-column type="selection" width="55px"/>
            <el-table-column
                v-for="i in W001_table_column2"
                :label="i[Object.keys(i)[0]].toString()"
                :prop="Object.keys(i).toString()"
            />
          </el-table>
        </el-row>
        <el-row>
          <el-table
              :data="tableW001"
              border
              height="500px"
              style="width: 1000px"
              v-if="tableW001.length > 0"
          >
            >
            <el-table-column
                label="功能"
                width="150%"
            >
              <template #default="scope">
                <el-button-group>
                  <el-button
                      @click.prevent="modify(scope.row)"
                  >修改資料
                  </el-button>
                  <el-popconfirm
                      width="220"
                      confirm-button-text="確定"
                      cancel-button-text="取消"
                      title="確定要刪除嗎?"
                      @confirm="confirmEventDelete(scope.row)"
                  >
                    <template #reference>
                      <el-button>刪除資料</el-button>
                    </template>
                  </el-popconfirm>
                </el-button-group>
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