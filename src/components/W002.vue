<script setup>

import axios from "axios";
import {toFindCookie} from "@/components/componentsJs/cookie";

const rearEnd = 'http://localhost:8080'
const frontEnd = 'http://localhost:5173'
const path = window.location.pathname + '/';
const W002 = ref('')

goW002()

function goW002() {
  axios.get(rearEnd + path + goW002.name)
      .then((response) => {
        W002.value = response.data
      })
}

const W002Show = ref([])

goW002Show()

function goW002Show() {
  axios.get(rearEnd + path + goW002Show.name)
      .then((response) => {
        W002Show.value = response.data
      })
}

if (toFindCookie() === undefined) {
  location.href = frontEnd
}

const calendar = ref(null)
const selectDate = (val) => {
  if (!calendar.value) return
  calendar.value.selectDate(val)
}
const calendarValue = ref(null)
const handleDateChange = () => {
  let date = calendarValue.value
  if (date) {
    let year = String(date.getFullYear())
    let month = String(date.getMonth() + 1).padStart(2, '0')
    let day = String(date.getDate()).padStart(2, '0')
    headDate.value = `${year}-${month}-${day}`
  }
}

const headDate = ref(dateChange())

function dateChange() {
  let date = new Date()
  let year = String(date.getFullYear())
  let month = String(date.getMonth() + 1).padStart(2, '0')
  let day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const fromData = reactive({
  input7000En: '',
  input7000Cn: '',
  inputTOEICEn: '',
  inputTOEICCn: '',
  singleWordVal: '',
})

const clear = () => {
  fromData.input7000En = ''
  fromData.input7000Cn = ''
  fromData.inputTOEICEn = ''
  fromData.inputTOEICCn = ''
  fromData.singleWordVal = ''
  input7000.value = ''
  inputTOEIC.value = ''
  goW002Show()
}

const input7000 = ref('')
const inputTOEIC = ref('')

const singleWord = (singleWordVal) => {
  let patternStr = /^[a-zA-Z]+$/
  let YesOrNo = false
  if (patternStr.test(fromData.input7000En)) {
    YesOrNo = true
    fromData.singleWordVal = singleWordVal
  }
  if (patternStr.test(fromData.inputTOEICEn)) {
    YesOrNo = true
    fromData.singleWordVal = singleWordVal
  }
  if (YesOrNo) {
    axios.post(rearEnd + path + singleWord.name, {
      GoW002: fromData
    })
        .then((response) => {
          switchSingleWordVal(singleWordVal, response.data)
          goW002Show()
        })
  } else {
    switchSingleWordVal(singleWordVal, '')
  }
}

const switchSingleWordVal = (singleWordVal, responseData) => {
  switch (singleWordVal) {
    case '7000Word':
      fromData.input7000En = ''
      fromData.input7000Cn = ''
      input7000.value = responseData
      break
    case 'TOEICWord':
      fromData.inputTOEICEn = ''
      fromData.inputTOEICCn = ''
      inputTOEIC.value = responseData
      break
  }
}

</script>

<template>
  <el-container>
    <el-header>{{ W002 }}</el-header>
    <el-container>
      <el-aside width="600px">
        <el-calendar
            ref="calendar"
            v-model="calendarValue"
            @click="handleDateChange"
        >
          <template #header="{ date }">
            <span>{{ date }}</span>
            <span>{{ headDate }}</span>
            <el-button-group>
              <el-button size="small" @click="selectDate('prev-year')">
                前一年
              </el-button>
              <el-button size="small" @click="selectDate('prev-month')">
                前一個月
              </el-button>
              <el-button size="small" @click="selectDate('today')">
                今日
              </el-button>
              <el-button size="small" @click="selectDate('next-month')">
                下個月
              </el-button>
              <el-button size="small" @click="selectDate('next-year')">
                明年
              </el-button>
            </el-button-group>
          </template>
          <template #date-cell="{ data }">
            {{ data.day.split('-').slice(1).join('/') }}
            {{ data.isSelected ? '✔️' : '' }}
          </template>
        </el-calendar>
      </el-aside>
      <el-main>
        <el-button link type="primary" @click="clear">還原畫面</el-button>
        <el-row>
          <el-descriptions
              title="死神單字"
              direction="vertical"
              :column="2"
          >
            <el-descriptions-item label="7000單字" width="200px">
              <el-input
                  v-model="fromData.input7000En"
                  style="width: 100%"
              >
                <template #suffix>英文</template>
              </el-input>
              <el-input
                  v-model="fromData.input7000Cn"
                  style="width: 100%"
              >
                <template #suffix>中文</template>
              </el-input>
              <el-button style="width: 100%" @click="singleWord('7000Word')">存檔</el-button>
              {{ input7000 }}
            </el-descriptions-item>
            <el-descriptions-item label="TOEIC" width="200px">
              <el-input
                  v-model="fromData.inputTOEICEn"
                  style="width: 100%"
              >
                <template #suffix>英文</template>
              </el-input>
              <el-input
                  v-model="fromData.inputTOEICCn"
                  style="width: 100%"
              >
                <template #suffix>中文</template>
              </el-input>
              <el-button style="width: 100%" @click="singleWord('TOEICWord')">存檔</el-button>
              {{ inputTOEIC }}
            </el-descriptions-item>
          </el-descriptions>
        </el-row>
        <el-table
            :data="W002Show"
            height="300px"
            border
            style="width: 200px"
            v-if="W002Show.length > 0"
        >
          <el-table-column
              label="英文"
              prop="input_EN"
          />
          <el-table-column
              label="中文"
              prop="input_CN"
          />
        </el-table>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>

</style>