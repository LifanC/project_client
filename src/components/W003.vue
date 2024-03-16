<script setup>

import axios from "axios";
import {toFindCookie} from "@/components/componentsJs/cookie";
import {setDateRange} from "@/components/componentsJs/W001";

axios.defaults.baseURL = 'http://localhost:8080'
const frontEnd = 'http://localhost:5173'
const path = window.location.pathname + '/'
const W003 = ref('')

goW003()

async function goW003() {
  try {
    const response = await axios.get(path + goW003.name)
    W003.value = response.data
  } catch (error) {
    console.error('goW003 Error:', error);
  }
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
  monthProportion(-1, 0, 1)
}

const thisMonthNum = ref(0)
const thisMonth = (val) => {
  switch (val) {
    case 'lastMonth':
      --thisMonthNum.value
      break
    case 'thisMonth':
      thisMonthNum.value = 0
      break
    case 'nextMonth':
      ++thisMonthNum.value
      break
  }
  monthProportion(thisMonthNum.value - 1, thisMonthNum.value, thisMonthNum.value + 1)
}

const last2Total = ref(0)
const this2Total = ref(0)
const next2Total = ref(0)
const last2TotalText = ref('上月')
const this2TotalText = ref('本月')
const next2TotalText = ref('下月')
const last12Total_ex = ref(0)
const this12Total_ex = ref(0)
const next12Total_ex = ref(0)
const last12TotalText_ex = ref('上月')
const this12TotalText_ex = ref('本月')
const next12TotalText_ex = ref('下月')
const last12Total_in = ref(0)
const this12Total_in = ref(0)
const next12Total_in = ref(0)
const last12TotalText_in = ref('上月')
const this12TotalText_in = ref('本月')
const next12TotalText_in = ref('下月')
const lastProportionTotal_in = ref(0)
const thisProportionTotal_in = ref(0)
const nextProportionTotal_in = ref(0)
const lastProportionText_in = ref('上月')
const thisProportionText_in = ref('本月')
const nextProportionText_in = ref('下月')


async function monthProportion(lastMonth, thisMonth, nextMonth) {
  try {
    const response = await axios.post(path + goW003.name + monthProportion.name, {
      GoW003_fNume_number: [fromData.f_name, fromData.number],
      GoW003_setDateRangeLast: setDateRange(lastMonth),
      GoW003_setDateRangeThis: setDateRange(thisMonth),
      GoW003_setDateRangeNext: setDateRange(nextMonth),
    })
    let respList12 = response.data[0]
    let respList2 = response.data[1]
    calculateTotal('ex', 'L12', respList12[0], last12Total_ex, last12TotalText_ex, lastMonth)
    calculateTotal('ex', 'L12', respList12[1], this12Total_ex, this12TotalText_ex, thisMonth)
    calculateTotal('ex', 'L12', respList12[2], next12Total_ex, next12TotalText_ex, nextMonth)
    calculateTotal('in', 'L12', respList12[0], last12Total_in, last12TotalText_in, lastMonth)
    calculateTotal('in', 'L12', respList12[1], this12Total_in, this12TotalText_in, thisMonth)
    calculateTotal('in', 'L12', respList12[2], next12Total_in, next12TotalText_in, nextMonth)
    calculateTotal('', 'L2', respList2[0], last2Total, last2TotalText, lastMonth)
    calculateTotal('', 'L2', respList2[1], this2Total, this2TotalText, thisMonth)
    calculateTotal('', 'L2', respList2[2], next2Total, next2TotalText, nextMonth)
    calculateProportionTotal(lastMonth, thisMonth, nextMonth)
  } catch (error) {
    console.error('monthProportion Error:', error);
  }
}

const calculateTotal = (ExOrIn, tableName, respList, totalElement, textElement, month) => {
  let total = 0
  for (let respListElement of respList) {
    switch (tableName) {
      case 'L12':
        if (ExOrIn === 'ex') {
          total += +respListElement.expense
        } else if (ExOrIn === 'in') {
          total += +respListElement.income
        }
        break
      case 'L2':
        total += +respListElement.total
        break
    }
  }
  totalElement.value = total
  textElement.value = String(+Array.from(new Set(setDateRange(month))).join(', ').split('-')[1]) + '月'
}

const lastColor = ref('')
const thisColor = ref('')
const nextColor = ref('')
const last_positive_or_negative = ref('')
const this_positive_or_negative = ref('')
const next_positive_or_negative = ref('')
const calculateProportionTotal = (lastMonth, thisMonth, nextMonth) => {
  lastProportionTotal_in.value = +(((last2Total.value + last12Total_ex.value) / last12Total_in.value) * 100).toFixed(0)
  thisProportionTotal_in.value = +(((this2Total.value + this12Total_ex.value) / this12Total_in.value) * 100).toFixed(0)
  nextProportionTotal_in.value = +(((next2Total.value + next12Total_ex.value) / next12Total_in.value) * 100).toFixed(0)
  lastProportionText_in.value = getUniqueArr(lastMonth, lastProportionTotal_in, thisProportionTotal_in, nextProportionTotal_in)
  thisProportionText_in.value = getUniqueArr(thisMonth, lastProportionTotal_in, thisProportionTotal_in, nextProportionTotal_in)
  nextProportionText_in.value = getUniqueArr(nextMonth, lastProportionTotal_in, thisProportionTotal_in, nextProportionTotal_in)
  updateValues(lastProportionTotal_in, lastColor, last_positive_or_negative);
  updateValues(thisProportionTotal_in, thisColor, this_positive_or_negative);
  updateValues(nextProportionTotal_in, nextColor, next_positive_or_negative);
}

const getUniqueArr = (month, lastProportionTotal_in, thisProportionTotal_in, nextProportionTotal_in) => {
  let elements = [lastProportionTotal_in, thisProportionTotal_in, nextProportionTotal_in];
  for (let element of elements) {
    if (isNaN(element.value)) {
      element.value = 0;
    }
  }
  return String(+Array.from(new Set(setDateRange(month))).join(', ').split('-')[1]) + '月'
}

const updateValues = (totalValue, colorElement, positiveNegativeElement) => {
  let value = +totalValue.value
  if (value > 100) {
    colorElement.value = 'red'
    positiveNegativeElement.value = String(100 - value) + '％'
  } else {
    if (value !== 0) {
      colorElement.value = 'green'
      positiveNegativeElement.value = String(100 - value) + '％'
    } else {
      colorElement.value = ''
      positiveNegativeElement.value = ''
    }
  }
}


</script>

<template>
  <el-container>
    <el-header>{{ W003 }}
      <el-row>
        <el-button-group>
          <el-button @click="thisMonth('lastMonth')">上月</el-button>
          <el-button @click="thisMonth('thisMonth')">本月</el-button>
          <el-button @click="thisMonth('nextMonth')">下月</el-button>
        </el-button-group>
      </el-row>
    </el-header>
    <el-container>
      <el-main>
        <el-row>
          <el-space wrap>
            <el-card shadow="never">
              <el-descriptions
                  direction="vertical"
                  title="總務系統"
                  extra="支出"
              >
                <el-descriptions-item min-width="200px">
                  <el-statistic :title="last2TotalText" :value="last2Total"/>
                  <el-statistic :title="this2TotalText" :value="this2Total"/>
                  <el-statistic :title="next2TotalText" :value="next2Total"/>
                </el-descriptions-item>
              </el-descriptions>
            </el-card>
            <el-card shadow="never">
              <el-descriptions
                  direction="vertical"
                  title="記帳系統"
                  extra="支出"
              >
                <el-descriptions-item min-width="200px">
                  <el-statistic :title="last12TotalText_ex" :value="last12Total_ex"/>
                  <el-statistic :title="this12TotalText_ex" :value="this12Total_ex"/>
                  <el-statistic :title="next12TotalText_ex" :value="next12Total_ex"/>
                </el-descriptions-item>
              </el-descriptions>
            </el-card>
            <el-card shadow="never">
              <el-descriptions
                  direction="vertical"
                  title="記帳系統"
                  extra="收入"
              >
                <el-descriptions-item min-width="200px">
                  <el-statistic :title="last12TotalText_in" :value="last12Total_in"/>
                  <el-statistic :title="this12TotalText_in" :value="this12Total_in"/>
                  <el-statistic :title="next12TotalText_in" :value="next12Total_in"/>
                </el-descriptions-item>
              </el-descriptions>
            </el-card>
            <el-card shadow="never">
              <el-descriptions
                  direction="vertical"
                  title="佔收入％"
                  extra="營收、費用、淨利"
              >
                <el-descriptions-item min-width="200px">
                  <el-statistic :title="lastProportionText_in" :value="lastProportionTotal_in">
                    <template #suffix>％&emsp;<span :class="lastColor">{{ last_positive_or_negative }}</span></template>
                  </el-statistic>
                  <el-statistic :title="thisProportionText_in" :value="thisProportionTotal_in">
                    <template #suffix>％&emsp;<span :class="thisColor">{{ this_positive_or_negative }}</span></template>
                  </el-statistic>
                  <el-statistic :title="nextProportionText_in" :value="nextProportionTotal_in">
                    <template #suffix>％&emsp;<span :class="nextColor">{{ next_positive_or_negative }}</span></template>
                  </el-statistic>
                </el-descriptions-item>
              </el-descriptions>
            </el-card>
          </el-space>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.green {
  color: var(--el-color-success);
}

.red {
  color: var(--el-color-error);
}
</style>