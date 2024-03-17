<script setup>

import axios from "axios";
import {toFindCookie} from "@/components/componentsJs/cookie";
import {setDateRange} from "@/components/componentsJs/W001";
import {fourSeasonsYMDhms} from "@/components/componentsJs/ConvertPadding";
import {ArrowLeftBold,ArrowRightBold} from "@element-plus/icons-vue";

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

const last2Total = ref(0)
const this2Total = ref(0)
const next2Total = ref(0)
const last2TotalText = ref('上月')
const this2TotalText = ref('當月')
const next2TotalText = ref('下月')
const last12Total_ex = ref(0)
const this12Total_ex = ref(0)
const next12Total_ex = ref(0)
const last12TotalText_ex = ref('上月')
const this12TotalText_ex = ref('當月')
const next12TotalText_ex = ref('下月')
const last12Total_in = ref(0)
const this12Total_in = ref(0)
const next12Total_in = ref(0)
const last12TotalText_in = ref('上月')
const this12TotalText_in = ref('當月')
const next12TotalText_in = ref('下月')
const lastProportionTotal_in = ref(0)
const thisProportionTotal_in = ref(0)
const nextProportionTotal_in = ref(0)
const lastProportionText_in = ref('上月')
const thisProportionText_in = ref('當月')
const nextProportionText_in = ref('下月')

const lastProportionTotalTF = ref(false)
const thisProportionTotalTF = ref(false)
const nextProportionTotalTF = ref(false)
const lpt = ref(0)
const tpt = ref(0)
const npt = ref(0)

const list2Total = ref(0)
const list12Total_ex = ref(0)
const list12Total_in = ref(0)
const listProportionTotal_in = ref(0)
const list2TotalText = ref('當季')
const list12TotalText_ex = ref('當季')
const list12TotalText_in = ref('當季')
const listProportionText_in = ref('當季')

const list_pt = ref(0)
const listProportionTotalTF = ref(false)

const lastList2Total = ref(0)
const lastList12Total_ex = ref(0)
const lastList12Total_in = ref(0)

const seasonTotal = ref(0)

const thisMoM_W002 = ref(0)
const thisMoM_W0012_ex = ref(0)
const thisMoM_W0012_in = ref(0)
const thisMoM = ref(0)

function W003UrlDefault() {
  monthProportion(-1, 0, 1)
  onMounted(async () => {
    await seasonProportion(null)
  })
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

/*
* YoY、QoQ、MoM 計算公式
* 年增率（YoY , Year on Year）= 年營收成長率 =（當年營收 – 去年營收）÷ 去年營收 x 100%
* 季增率（QoQ , Quarter on Quarter）= 季營收成長率 =（當季營收 – 上季營收）÷ 上季營收 x 100%
* 月增率（MoM , Month on Month）= 月營收成長率 =（當月營收 – 上月營收）÷ 上月營收 x 100%
* */
const MoM = () => {
  calculateMoM(this2Total.value, last2Total.value, thisMoM_W002);
  calculateMoM(this12Total_ex.value, last12Total_ex.value, thisMoM_W0012_ex);
  calculateMoM(this12Total_in.value, last12Total_in.value, thisMoM_W0012_in);
  let lastTotal = Math.min(101, lastProportionTotal_in.value)
  let thisTotal = Math.min(101, thisProportionTotal_in.value)
  if (lastTotal > 100) {
    lastTotal = 0
  }
  if (thisTotal > 100) {
    thisTotal = 0
  }
  thisMoM.value = (thisTotal - lastTotal < 0) ? 0 : (thisTotal - lastTotal < 100) ? thisTotal - lastTotal : 100
}

const calculateMoM = (totalValue, lastTotalValue, outputElement) => {
  if (lastTotalValue === 0 && totalValue === 0) {
    outputElement.value = 0
  } else if (lastTotalValue === 0) {
    outputElement.value = 100
  } else if (totalValue === 0) {
    outputElement.value = 0
  } else {
    let outputValue = +((totalValue - lastTotalValue) / lastTotalValue).toFixed(2)
    outputElement.value = Math.min(100, Math.max(0, outputValue))
  }
}

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
    MoM()
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
  if (textElement != null && month != null) {
    textElement.value = String(+Array.from(new Set(setDateRange(month))).join(', ').split('-')[1]) + '月'
  }
}

const calculateProportionTotal = (lastMonth, thisMonth, nextMonth) => {
  lastProportionTotal_in.value = +(((last2Total.value + last12Total_ex.value) / last12Total_in.value) * 100).toFixed(0)
  thisProportionTotal_in.value = +(((this2Total.value + this12Total_ex.value) / this12Total_in.value) * 100).toFixed(0)
  nextProportionTotal_in.value = +(((next2Total.value + next12Total_ex.value) / next12Total_in.value) * 100).toFixed(0)
  lastProportionText_in.value = getUniqueArr(lastMonth, lastProportionTotal_in, thisProportionTotal_in, nextProportionTotal_in)
  thisProportionText_in.value = getUniqueArr(thisMonth, lastProportionTotal_in, thisProportionTotal_in, nextProportionTotal_in)
  nextProportionText_in.value = getUniqueArr(nextMonth, lastProportionTotal_in, thisProportionTotal_in, nextProportionTotal_in)
  checkAndSetProportionValue(lastProportionTotal_in.value, lastProportionTotalTF, lpt)
  checkAndSetProportionValue(thisProportionTotal_in.value, thisProportionTotalTF, tpt)
  checkAndSetProportionValue(nextProportionTotal_in.value, nextProportionTotalTF, npt)
}

const getUniqueArr = (month, lastProportionTotal_in, thisProportionTotal_in, nextProportionTotal_in) => {
  let elements = [lastProportionTotal_in, thisProportionTotal_in, nextProportionTotal_in]
  for (let element of elements) {
    if (isNaN(element.value)) {
      element.value = 0
    }
  }
  return String(+Array.from(new Set(setDateRange(month))).join(', ').split('-')[1]) + '月'
}

const checkAndSetProportionValue = (inputValue, toggleElement, outputElement) => {
  if (inputValue > 100) {
    toggleElement.value = true
    outputElement.value = 100 - inputValue
  } else {
    toggleElement.value = false
  }
}

// 設定每個季節的月份範圍
const seasons = {
  'spring': [1, 3],
  'summer': [4, 6],
  'autumn': [7, 9],
  'winter': [10, 12]
}

const monthToSeason = {
  1: 'spring', 2: 'spring', 3: 'spring',
  4: 'summer', 5: 'summer', 6: 'summer',
  7: 'autumn', 8: 'autumn', 9: 'autumn',
  10: 'winter', 11: 'winter', 12: 'winter'
}

async function seasonProportion(data) {
  list12Total_in.value = list12Total_ex.value = list2Total.value = 0
  lastList12Total_in.value = lastList12Total_ex.value = lastList2Total.value = 0
  // 年初日期（01月初~03月底）春<br>
  // 年初日期（04月初~06月底）夏<br>
  // 年初日期（07月初~09月底）秋<br>
  // 年初日期（10月初~12月底）冬<br>
  let tempData
  if (data == null) {
    let currentDateMonth = new Date().getMonth() + 1
    tempData = monthToSeason[currentDateMonth]
  } else {
    tempData = data
  }
  let temp
  switch (tempData) {
    case 'spring':
      // 第一個季不用算
      break
    case 'summer':
      temp = seasons['spring']
      break
    case 'autumn':
      temp = seasons['summer']
      break
    case 'winter':
      temp = seasons['autumn']
      break
  }
  try {
    const response = await axios.post(path + goW003.name + seasonProportion.name, {
      GoW003_fNume_number: [fromData.f_name, fromData.number],
      GoW003_fourSeasons: fourSeasonsYMDhms(seasons[tempData])
    })
    let respList12 = response.data[0]
    let respList2 = response.data[1]
    calculateTotal('ex', 'L12', respList12[0], list12Total_ex, null, null)
    calculateTotal('in', 'L12', respList12[0], list12Total_in, null, null)
    calculateTotal('', 'L2', respList2[0], list2Total, null, null)
    let months = seasons[tempData].join(' ~ ') + '月'
    list2TotalText.value = list12TotalText_ex.value = list12TotalText_in.value = listProportionText_in.value = months
    let totals = +(((list2Total.value + list12Total_ex.value) / list12Total_in.value) * 100).toFixed(0)
    listProportionTotal_in.value = isNaN(totals) ? 0 : totals
    checkAndSetProportionValue(listProportionTotal_in.value, listProportionTotalTF, list_pt)
  } catch (error) {
    console.error('seasonProportion Error:', error);
  }
  if (tempData !== 'spring') {
    try {
      const response = await axios.post(path + goW003.name + seasonProportion.name, {
        GoW003_fNume_number: [fromData.f_name, fromData.number],
        GoW003_fourSeasons: fourSeasonsYMDhms(temp)
      })
      let respList12 = response.data[0]
      let respList2 = response.data[1]
      calculateTotal('ex', 'L12', respList12[0], lastList12Total_ex, null, null)
      calculateTotal('in', 'L12', respList12[0], lastList12Total_in, null, null)
      calculateTotal('', 'L2', respList2[0], lastList2Total, null, null)
    } catch (error) {
      console.error('seasonProportion Error:', error);
    }
  }

  let current_season = list12Total_in.value - list12Total_ex.value + list2Total.value
  let last_season = lastList12Total_in.value - lastList12Total_ex.value + lastList2Total.value
  seasonTotal.value = 0
  if (current_season === 0 && last_season === 0) {
    seasonTotal.value = 0
  } else if (current_season === 0) {
    seasonTotal.value = 0
  } else if (last_season === 0) {
    seasonTotal.value = 100
  } else {
    seasonTotal.value = Math.round(+((current_season - last_season) / last_season).toFixed(2))
  }
}

</script>

<template>
  <el-container>
    <el-header>{{ W003 }}</el-header>
    <el-container>
      <el-main>
        <el-row>
          <el-button-group>
            <el-button @click="thisMonth('lastMonth')" :icon="ArrowLeftBold"/>
            <el-button @click="thisMonth('thisMonth')">當月</el-button>
            <el-button @click="thisMonth('nextMonth')" :icon="ArrowRightBold"/>
          </el-button-group>
        </el-row>
        <el-space
            direction="vertical"
            alignment="flex-start"
        >
          <el-row>
            <el-space
                wrap
                alignment="flex-start"
            >
              <el-card shadow="never" body-style="min-width: 200px">
                <el-descriptions
                    direction="vertical"
                    title="總務系統"
                    extra="支出"
                >
                  <el-descriptions-item>
                    <el-statistic :title="last2TotalText" :value="last2Total"/>
                    <el-statistic :title="this2TotalText" :value="this2Total"/>
                    <el-statistic :title="next2TotalText" :value="next2Total"/>
                  </el-descriptions-item>
                </el-descriptions>
              </el-card>
              <el-card shadow="never" body-style="min-width: 200px">
                <el-descriptions
                    direction="vertical"
                    title="記帳系統"
                    extra="支出"
                >
                  <el-descriptions-item>
                    <el-statistic :title="last12TotalText_ex" :value="last12Total_ex"/>
                    <el-statistic :title="this12TotalText_ex" :value="this12Total_ex"/>
                    <el-statistic :title="next12TotalText_ex" :value="next12Total_ex"/>
                  </el-descriptions-item>
                </el-descriptions>
              </el-card>
              <el-card shadow="never" body-style="min-width: 200px">
                <el-descriptions
                    direction="vertical"
                    title="記帳系統"
                    extra="收入"
                >
                  <el-descriptions-item>
                    <el-statistic :title="last12TotalText_in" :value="last12Total_in"/>
                    <el-statistic :title="this12TotalText_in" :value="this12Total_in"/>
                    <el-statistic :title="next12TotalText_in" :value="next12Total_in"/>
                  </el-descriptions-item>
                </el-descriptions>
              </el-card>
              <el-card shadow="never" body-style="min-width: 200px">
                <el-descriptions
                    direction="vertical"
                    title="佔收入％"
                    extra="營收、費用、淨利"
                >
                  <el-descriptions-item>
                    <el-statistic :title="lastProportionText_in" :value="lastProportionTotal_in">
                      <template #suffix>％</template>
                    </el-statistic>
                    <span v-if="lastProportionTotalTF">超過佔比&emsp;{{ lpt }}％</span>
                    <el-statistic :title="thisProportionText_in" :value="thisProportionTotal_in">
                      <template #suffix>％</template>
                    </el-statistic>
                    <span v-if="thisProportionTotalTF">超過佔比&emsp;{{ tpt }}％</span>
                    <el-statistic :title="nextProportionText_in" :value="nextProportionTotal_in">
                      <template #suffix>％</template>
                    </el-statistic>
                    <span v-if="nextProportionTotalTF">超過佔比&emsp;{{ npt }}％</span>
                  </el-descriptions-item>
                </el-descriptions>
              </el-card>
            </el-space>
          </el-row>
          <el-row>
            <el-space wrap>
              <el-card shadow="never" body-style="min-width: 200px">
                <el-descriptions
                    direction="vertical"
                    title="總務支出成長率/月"
                    :extra="this2TotalText"
                >
                  <el-descriptions-item>
                    <el-progress type="circle" :percentage="thisMoM_W002"/>
                  </el-descriptions-item>
                </el-descriptions>
              </el-card>
              <el-card shadow="never" body-style="min-width: 200px">
                <el-descriptions
                    direction="vertical"
                    title="記帳支出成長率/月"
                    :extra="this12TotalText_ex"
                >
                  <el-descriptions-item>
                    <el-progress type="circle" :percentage="thisMoM_W0012_ex"/>
                  </el-descriptions-item>
                </el-descriptions>
              </el-card>
              <el-card shadow="never" body-style="min-width: 200px">
                <el-descriptions
                    direction="vertical"
                    title="記帳收入成長率/月"
                    :extra="this12TotalText_in"
                >
                  <el-descriptions-item>
                    <el-progress type="circle" :percentage="thisMoM_W0012_in"/>
                  </el-descriptions-item>
                </el-descriptions>
              </el-card>
              <el-card shadow="never" body-style="min-width: 200px">
                <el-descriptions
                    direction="vertical"
                    title="佔收入％成長率/月"
                    :extra="thisProportionText_in"
                >
                  <el-descriptions-item>
                    <el-progress type="circle" :percentage="thisMoM"/>
                  </el-descriptions-item>
                </el-descriptions>
              </el-card>
            </el-space>
          </el-row>
        </el-space>
        <el-row>
          <el-button-group>
            <el-button @click="seasonProportion('spring')">春季</el-button>
            <el-button @click="seasonProportion('summer')">夏季</el-button>
            <el-button @click="seasonProportion('autumn')">秋季</el-button>
            <el-button @click="seasonProportion('winter')">冬季</el-button>
          </el-button-group>
        </el-row>
        <el-space
            direction="vertical"
            alignment="flex-start"
        >
          <el-row>
            <el-space
                wrap
                alignment="flex-start"
            >
              <el-card shadow="never" body-style="min-width: 200px">
                <el-descriptions
                    direction="vertical"
                    title="總務系統"
                    extra="支出"
                >
                  <el-descriptions-item>
                    <el-statistic :title="list2TotalText" :value="list2Total"/>
                  </el-descriptions-item>
                </el-descriptions>
              </el-card>
              <el-card shadow="never" body-style="min-width: 200px">
                <el-descriptions
                    direction="vertical"
                    title="記帳系統"
                    extra="支出"
                >
                  <el-descriptions-item>
                    <el-statistic :title="list12TotalText_ex" :value="list12Total_ex"/>
                  </el-descriptions-item>
                </el-descriptions>
              </el-card>
              <el-card shadow="never" body-style="min-width: 200px">
                <el-descriptions
                    direction="vertical"
                    title="記帳系統"
                    extra="收入"
                >
                  <el-descriptions-item>
                    <el-statistic :title="list12TotalText_in" :value="list12Total_in"/>
                  </el-descriptions-item>
                </el-descriptions>
              </el-card>
              <el-card shadow="never" body-style="min-width: 200px">
                <el-descriptions
                    direction="vertical"
                    title="佔收入％"
                    extra="營收、費用、淨利"
                >
                  <el-descriptions-item>
                    <el-statistic :title="listProportionText_in" :value="listProportionTotal_in">
                      <template #suffix>％</template>
                    </el-statistic>
                    <span v-if="listProportionTotalTF">超過佔比&emsp;{{ list_pt }}％</span>
                    <el-statistic title="成長率/季" :value="seasonTotal">
                      <template #suffix>％</template>
                    </el-statistic>
                  </el-descriptions-item>
                </el-descriptions>
              </el-card>
            </el-space>
          </el-row>
        </el-space>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>

</style>