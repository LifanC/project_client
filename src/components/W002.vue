<script setup>

import axios from "axios";
import {toFindCookie} from "@/components/componentsJs/cookie";
import {dateConversionYMDhms} from "@/components/componentsJs/ConvertPadding";

const rearEnd = 'http://localhost:8080'
const frontEnd = 'http://localhost:5173'
const path = window.location.pathname + '/'
const W002 = ref('')

goW002()

function goW002() {
  axios.get(rearEnd + path + goW002.name)
      .then((response) => {
        W002.value = response.data
      })
}

const fromData = reactive({
  id: '',
  f_name: '',
  number: '',
  a_value: '',
  b_value: '',
  // 分類
  c_value: '',
  // Ex
  d_value: '',
  // 備註
  e_value: '',
  // 數量
  f_value: '',
  // 金額
  g_value: '',
  new_date: new Date(),
})

if (toFindCookie() === undefined) {
  location.href = frontEnd
} else {
  fromData.a_value = toFindCookie()
  fromData.b_value = (dateConversionYMDhms(false)
      .replace(/\D/g, '')
      .substring(8, 0)) + '000001'
  fromData.f_name = toFindCookie().substring(0, 1)
  fromData.number = toFindCookie().substring(1, 3)
  W002UrlDefault()
}

const all_totle_w001_ex = ref(0)
const all_totle_w001_ic = ref(0)
const tableW0012 = ref([]);
const W001_table_column2 = ref([
  {'new_date_Format': '日期'},
  {'expense': '支出'},
  {'income': '收入'},
  {'totle_money': '總金額'}
])
const all_totle_w002 = ref(0)

function W002UrlDefault() {
  axios.get(rearEnd + path + W002UrlDefault.name, {
    params: {
      f_name: fromData.f_name,
      number: fromData.number
    }
  })
      .then((response) => {
        tableW002.value = response.data[0]
        all_totle_w002.value = 0
        for (let num in tableW002.value) {
          all_totle_w002.value += +tableW002.value[num].total
        }
      })
  axios.get(rearEnd + '/W001/W001UrlDefault', {
    params: {
      f_name: fromData.f_name,
      number: fromData.number
    }
  })
      .then((response) => {
        tableW0012.value = response.data[1]
        all_totle_w001_ex.value = 0
        all_totle_w001_ic.value = 0
        for (let num in tableW0012.value) {
          all_totle_w001_ex.value += +tableW0012.value[num].expense
          all_totle_w001_ic.value += +tableW0012.value[num].income
        }
      })
}

const typeSelects = ref([
  {label: '固定', value: 'A'},
  {label: '消耗', value: 'B'},
  {label: '其他', value: 'C'}
])
const productCategory = ref('')

const selectProductCategory = (selectValue) => {
  if (selectValue === '') {
    productCategory.value = typeSelects.value[typeSelects.value.length - 1].value
    fromData.c_value = productCategory.value
  } else {
    fromData.c_value = selectValue
  }
}

const tableW002 = ref([])
const W002_table_column = ref([
  {'m_code': '編號'},
  {'remark': '備註'},
  {'quantity': '數量'},
  {'amount': '金額'},
  {'total': '總金額'},
  {'new_date': '日期'}
])

const h_totle = ref('')
const calc = () => {
  fromData.f_value = fromData.f_value <= 0 ? '' : fromData.f_value;
  fromData.g_value = fromData.g_value <= 0 ? '' : fromData.g_value;
  if (fromData.f_value !== '' && fromData.g_value !== '') {
    h_totle.value = fromData.f_value * fromData.g_value;
  }
}

const addTF = ref(false)
const modifyTF = ref(true)
const W002Url = (restfulApi_type) => {
  switch (restfulApi_type) {
    case 'Add' :
      let patternNum = /^\d+$/
      if ([
        fromData.c_value,
        fromData.d_value,
        fromData.e_value,
        fromData.f_value,
        fromData.g_value
      ].some(value => value === '')) {
        return
      }
      if (!patternNum.test(fromData.d_value)) return
      if (fromData.new_date === null) {
        fromData.new_date = new Date()
      }
      axios.post(rearEnd + path + goW002.name + restfulApi_type, {
        GoW002: fromData
      })
          .then((response) => {
            tableW002.value = response.data[0]
            fromData.c_value = ''
            fromData.d_value = ''
            fromData.e_value = ''
            fromData.f_value = ''
            fromData.g_value = ''
            h_totle.value = ''
            productCategory.value = ''
            all_totle_w002.value = 0
            for (let num in tableW002.value) {
              all_totle_w002.value += +tableW002.value[num].total
            }
          })
      break
    case 'Modify' :
      axios.put(rearEnd + path + goW002.name + restfulApi_type, {
        GoW002: fromData
      })
          .then((response) => {
            addTF.value = false
            tableW002.value = response.data[0]
            fromData.c_value = ''
            fromData.d_value = ''
            fromData.e_value = ''
            fromData.f_value = ''
            fromData.g_value = ''
            h_totle.value = ''
            all_totle_w002.value = 0
            for (let num in tableW002.value) {
              all_totle_w002.value += +tableW002.value[num].total
            }
          })
      break
  }
}

const modify = (row) => {
  addTF.value = true
  modifyTF.value = false
  fromData.id = String(row.id)
  fromData.a_value = row.m_code.substring(0, 3)
  fromData.b_value = row.m_code.substring(3, 17)
  fromData.c_value = row.m_code.substring(17, 18)
  fromData.d_value = row.m_code.substring(18, 21)
  fromData.e_value = row.remark
  fromData.f_value = row.quantity
  fromData.g_value = row.amount
  h_totle.value = fromData.f_value * fromData.g_value;
}

const confirmEventDelete = (row) => {
  axios.delete(rearEnd + path + confirmEventDelete.name, {
    params: {
      id: row.id,
      f_name: row.m_code.substring(0, 2),
      number: row.m_code.substring(2, 3),
    }
  })
      .then((response) => {
        tableW002.value = response.data[0]
        fromData.c_value = ''
        fromData.d_value = ''
        fromData.e_value = ''
        fromData.f_value = ''
        fromData.g_value = ''
        h_totle.value = ''
        all_totle_w002.value = 0
        for (let num in tableW002.value) {
          all_totle_w002.value += +tableW002.value[num].total
        }
      })
}

</script>

<template>
  <el-container>
    <el-header>{{ W002 }}</el-header>
    <el-container>
      <el-aside width="330px">
        <el-text>範例 : L0720240218000001A001</el-text>
        <el-form v-model="fromData">
          <el-form-item>
            <el-select
                v-model="productCategory"
                filterable
                placeholder="分類"
                clearable
                style="width: 330px"
                @change="selectProductCategory"
            >
              <el-option v-for="typeSelect in typeSelects"
                         :key="typeSelect.value"
                         :label="typeSelect.label"
                         :value="typeSelect.value"
              />
            </el-select>
            <el-input
                style="width: 50px"
                readonly
                maxlength="1"
                v-model="fromData.a_value"
                disabled
            />
            <el-input
                style="width: 155px"
                readonly
                maxlength="14"
                v-model="fromData.b_value"
                disabled
            />
            <el-input
                style="width: 35px"
                readonly
                maxlength="1"
                v-model="fromData.c_value"
                disabled
            />
            <el-input
                style="width: 90px"
                maxlength="3"
                v-model="fromData.d_value"
                placeholder="Ex : 001"
            />
            <el-input
                style="width: 335px"
                :rows="2"
                type="textarea"
                placeholder="備註"
                v-model="fromData.e_value"
            />
            <el-input
                style="width: 120px"
                type="number"
                placeholder="數量"
                v-model.number="fromData.f_value"
                @input="calc"
            />
            <el-input
                style="width: 210px"
                type="number"
                placeholder="金額"
                v-model.number="fromData.g_value"
                @input="calc"
            />
            <el-input
                style="width: 330px"
                readonly
                disabled
                type="number"
                placeholder="總金額"
                :value="h_totle"
            />
            <el-date-picker
                v-model="fromData.new_date"
                type="date"
                style="width: 330px"
            />
            <el-button-group>
              <el-button
                  :disabled="addTF"
                  style="width: 165px"
                  @click="W002Url('Add')"
              >新增
              </el-button>
              <el-button
                  :disabled="modifyTF"
                  style="width: 165px"
                  @click="W002Url('Modify')"
              >修改
              </el-button>
            </el-button-group>
          </el-form-item>
        </el-form>
      </el-aside>
      <el-main>
        <el-row>
          <el-table
              :data="tableW002"
              border
              height="250px"
              style="width: 1300px"
              v-if="tableW002.length > 0"
          >
            <el-table-column
                label="功能"
                width="150%"
            >
              <template #default="scope">
                <el-button-group>
                  <el-button
                      @click.prevent="modify(scope.row)"
                  >修改
                  </el-button>
                  <el-popconfirm
                      width="220"
                      confirm-button-text="確定"
                      cancel-button-text="取消"
                      title="確定要刪除嗎?"
                      @confirm="confirmEventDelete(scope.row)"
                  >
                    <template #reference>
                      <el-button>刪除</el-button>
                    </template>
                  </el-popconfirm>
                </el-button-group>
              </template>
            </el-table-column>
            <el-table-column
                v-for="i in W002_table_column"
                :label="i[Object.keys(i)[0]].toString()"
                :prop="Object.keys(i).toString()"
            />
            <template #append>
              <el-text size="large" type="warning">
                &emsp;總務系統總支出&emsp;{{ all_totle_w002 }}
              </el-text>
            </template>
          </el-table>
        </el-row>
        <el-row>
          <el-table
              :data="tableW0012"
              height="250px" border
              style="width: 1000px"
              v-if="tableW0012.length > 0"
          >
            <el-table-column
                v-for="i in W001_table_column2"
                :label="i[Object.keys(i)[0]].toString()"
                :prop="Object.keys(i).toString()"
            />
            <template #append>
              <el-text size="large" type="warning">
                &emsp;記帳系統總支出&emsp;{{ all_totle_w001_ex }}
              </el-text>
              <el-text size="large" type="warning">
                &emsp;記帳系統總收入&emsp;{{ all_totle_w001_ic }}
              </el-text>
            </template>
          </el-table>
        </el-row>
      </el-main>
    </el-container>
  </el-container>

</template>

<style scoped>

</style>