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
  a_value: '',
  b_value: '',
  c_value: '',
  d_value: '',
  e_value: '',
  f_value: '',
  g_value: '',
  h_value: '',
})

if (toFindCookie() === undefined) {
  location.href = frontEnd
} else {
  fromData.a_value = toFindCookie()
  fromData.b_value = (dateConversionYMDhms(false)
      .replace(/\D/g, '')
      .substring(8, 0)) + '000001'
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
  {'a_value': 'a_value'},
  {'b_value': 'b_value'},
  {'c_value': 'c_value'},
  {'d_value': 'd_value'},
  {'e_value': 'e_value'},
  {'f_value': 'f_value'},
  {'g_value': 'g_value'},
  {'h_value': 'h_value'}
])

const calc = () => {
  fromData.f_value = fromData.f_value <= 0 ? '' : fromData.f_value;
  fromData.g_value = fromData.g_value <= 0 ? '' : fromData.g_value;
  if (fromData.f_value !== '' && fromData.g_value !== '') {
    fromData.h_value = fromData.f_value * fromData.g_value;
  }
}

const W002Url = (restfulApi_type) => {
  switch (restfulApi_type) {
    case 'Add' :
      let patternNum = /^\d+$/
      if (fromData.c_value === '' ||
          fromData.d_value.length !== 3 ||
          !patternNum.test(fromData.d_value) ||
          fromData.e_value === '' ||
          fromData.f_value === '' ||
          fromData.g_value === '' ||
          fromData.h_value === ''
      ) {
        return
      }
      console.log(fromData)
      axios.post(rearEnd + path + goW002.name + restfulApi_type, {
        GoW002: fromData
      })
          .then((response) => {
            console.log(response.data)
          })
      break
  }
}

</script>

<template>
  <el-container>
    <el-header>{{ W002 }}</el-header>
    <el-container>
      <el-aside width="290px">
        <el-text>範例 : L0720240218000001A001</el-text>
        <el-form v-model="fromData">
          <el-form-item>
            <el-select
                v-model="productCategory"
                filterable
                placeholder="分類"
                clearable
                style="width: 290px"
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
                style="width: 50px"
                maxlength="3"
                v-model="fromData.d_value"
            />
            <el-input
                style="width: 290px"
                :rows="2"
                type="textarea"
                placeholder="內容"
                v-model="fromData.e_value"
            />
            <el-input
                style="width: 100px"
                type="number"
                placeholder="數量"
                v-model.number="fromData.f_value"
                @input="calc"
            />
            <el-input
                style="width: 190px"
                type="number"
                placeholder="金額"
                v-model.number="fromData.g_value"
                @input="calc"
            />
            <el-input
                style="width: 290px"
                readonly
                disabled
                type="number"
                placeholder="總金額"
                v-model.number="fromData.h_value"
            />
            <el-button
                style="width: 290px"
                @click="W002Url('Add')"
            >
              新增
            </el-button>
          </el-form-item>
        </el-form>
      </el-aside>
      <el-main>
        <el-table
            :data="tableW002"
            border
            height="250px"
            style="width: 1000px"
            v-if="tableW002.length > 0"
        >
          <el-table-column
              v-for="i in W002_table_column"
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