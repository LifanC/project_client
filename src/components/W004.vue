<script setup>

import axios from "axios";
import {toFindCookie} from "@/components/componentsJs/cookie";
import {dateConversionYMDhms} from "@/components/componentsJs/ConvertPadding";

axios.defaults.baseURL = 'http://localhost:8080'
const frontEnd = 'http://localhost:5173'
const path = window.location.pathname + '/'
const W004 = ref('')

goW004()

async function goW004() {
  try {
    const response = await axios.get(path + goW004.name)
    W004.value = response.data
  } catch (error) {
    console.error('goW004 Error:', error);
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
  W004UrlDefault()
}

// 以下是貨幣代碼對應的中文名稱：
const currencies = [
  {value: "TWD", label: "新台幣",},
  {value: "AED", label: "阿聯酋迪拉姆",},
  {value: "AFN", label: "阿富汗尼",},
  {value: "ALL", label: "阿爾巴尼亞列克",},
  {value: "AMD", label: "亞美尼亞德拉姆",},
  {value: "ANG", label: "荷屬安地列斯盾",},
  {value: "AOA", label: "安哥拉寬扎",},
  {value: "ARS", label: "阿根廷披索",},
  {value: "AUD", label: "澳元",},
  {value: "AWG", label: "阿魯巴盾",},
  {value: "AZN", label: "亞塞拜疆馬納特",},
  {value: "BAM", label: "波斯尼亞-黑塞哥維那可轉換馬克",},
  {value: "BBD", label: "巴巴多斯元",},
  {value: "BDT", label: "孟加拉塔卡",},
  {value: "BGN", label: "保加利亞列弗",},
  {value: "BHD", label: "巴林第納爾",},
  {value: "BIF", label: "布隆迪法郎",},
  {value: "BMD", label: "百慕大元",},
  {value: "BND", label: "文萊元",},
  {value: "BOB", label: "玻利維亞諾",},
  {value: "BRL", label: "巴西雷亞爾",},
  {value: "BSD", label: "巴哈馬元",},
  {value: "BTN", label: "不丹努扎姆",},
  {value: "BWP", label: "博茨瓦納普拉",},
  {value: "BYN", label: "白俄羅斯盧布",},
  {value: "BZD", label: "伯利茲元",},
  {value: "CAD", label: "加拿大元",},
  {value: "CDF", label: "剛果法郎",},
  {value: "CHF", label: "瑞士法郎",},
  {value: "CLP", label: "智利比索",},
  {value: "CNY", label: "人民幣",},
  {value: "COP", label: "哥倫比亞披索",},
  {value: "CRC", label: "哥斯大黎加科朗",},
  {value: "CUP", label: "古巴比索",},
  {value: "CVE", label: "佛得角埃斯庫多",},
  {value: "CZK", label: "捷克克朗",},
  {value: "DJF", label: "吉布提法郎",},
  {value: "DKK", label: "丹麥克朗",},
  {value: "DOP", label: "多明尼加披索",},
  {value: "DZD", label: "阿爾及利亞第納爾",},
  {value: "EGP", label: "埃及鎊",},
  {value: "ERN", label: "厄立特里亞納克法",},
  {value: "ETB", label: "衣索比亞比爾",},
  {value: "EUR", label: "歐元",},
  {value: "FJD", label: "斐濟元",},
  {value: "FKP", label: "福克蘭群島鎊",},
  {value: "FOK", label: "法羅群島克朗",},
  {value: "GBP", label: "英鎊",},
  {value: "GEL", label: "格魯吉亞拉里",},
  {value: "GGP", label: "根西島鎊",},
  {value: "GHS", label: "迦納塞地",},
  {value: "GIP", label: "直布羅陀鎊",},
  {value: "GMD", label: "甘比亞達拉西",},
  {value: "GNF", label: "幾內亞法郎",},
  {value: "GTQ", label: "危地馬拉格查爾",},
  {value: "GYD", label: "圭亞那元",},
  {value: "HKD", label: "港元",},
  {value: "HNL", label: "洪都拉斯倫皮拉",},
  {value: "HRK", label: "克羅地亞庫納",},
  {value: "HTG", label: "海地古德",},
  {value: "HUF", label: "匈牙利福林",},
  {value: "IDR", label: "印度尼西亞盾",},
  {value: "ILS", label: "以色列新謝克爾",},
  {value: "IMP", label: "馬恩島鎊",},
  {value: "INR", label: "印度盧比",},
  {value: "IQD", label: "伊拉克第納爾",},
  {value: "IRR", label: "伊朗里亞爾",},
  {value: "ISK", label: "冰島克朗",},
  {value: "JEP", label: "澤西島鎊",},
  {value: "JMD", label: "牙買加元",},
  {value: "JOD", label: "約旦第納爾",},
  {value: "JPY", label: "日圓",},
  {value: "KES", label: "肯尼亞先令",},
  {value: "KGS", label: "吉爾吉斯索姆",},
  {value: "KHR", label: "柬埔寨瑞爾",},
  {value: "KID", label: "基里巴斯元",},
  {value: "KMF", label: "科摩羅法郎",},
  {value: "KRW", label: "韓圜",},
  {value: "KWD", label: "科威特第納爾",},
  {value: "KYD", label: "開曼群島元",},
  {value: "KZT", label: "哈薩克斯坦坦吉",},
  {value: "LAK", label: "寮國基普",},
  {value: "LBP", label: "黎巴嫩鎊",},
  {value: "LKR", label: "斯里蘭卡盧比",},
  {value: "LRD", label: "利比里亞元",},
  {value: "LSL", label: "賴索托洛蒂",},
  {value: "LYD", label: "利比亞第納爾",},
  {value: "MAD", label: "摩洛哥迪拉姆",},
  {value: "MDL", label: "摩爾多瓦列伊",},
  {value: "MGA", label: "馬達加斯加阿里亞里",},
  {value: "MKD", label: "馬其頓第納爾",},
  {value: "MMK", label: "緬甸元",},
  {value: "MNT", label: "蒙古圖格里克",},
  {value: "MOP", label: "澳門元",},
  {value: "MRU", label: "茅利塔尼亞烏吉亞",},
  {value: "MUR", label: "毛里裘斯盧比",},
  {value: "MVR", label: "馬爾地夫盧非亞",},
  {value: "MWK", label: "馬拉維克瓦查",},
  {value: "MXN", label: "墨西哥披索",},
  {value: "MYR", label: "馬來西亞令吉",},
  {value: "MZN", label: "莫桑比克梅蒂卡爾",},
  {value: "NAD", label: "納米比亞元",},
  {value: "NGN", label: "尼日利亞奈拉",},
  {value: "NIO", label: "尼加拉瓜科多巴",},
  {value: "NOK", label: "挪威克朗",},
  {value: "NPR", label: "尼泊爾盧比",},
  {value: "NZD", label: "紐西蘭元",},
  {value: "OMR", label: "阿曼里亞爾",},
  {value: "PAB", label: "巴拿馬巴波亞",},
  {value: "PEN", label: "秘魯索爾",},
  {value: "PGK", label: "巴布亞新幾內亞基那",},
  {value: "PHP", label: "菲律賓披索",},
  {value: "PKR", label: "巴基斯坦盧比",},
  {value: "PLN", label: "波蘭茲羅提",},
  {value: "PYG", label: "巴拉圭瓜拉尼",},
  {value: "QAR", label: "卡塔爾里亞爾",},
  {value: "RON", label: "羅馬尼亞列伊",},
  {value: "RSD", label: "塞爾維亞第納爾",},
  {value: "RUB", label: "俄羅斯盧布",},
  {value: "RWF", label: "盧旺達法郎",},
  {value: "SAR", label: "沙烏地阿拉伯里亞爾",},
  {value: "SBD", label: "索羅門群島元",},
  {value: "SCR", label: "塞舌爾盧比",},
  {value: "SDG", label: "蘇丹鎊",},
  {value: "SEK", label: "瑞典克朗",},
  {value: "SGD", label: "新加坡元",},
  {value: "SHP", label: "聖赫勒拿鎊",},
  {value: "SLE", label: "塞拉利昂利昂",},
  {value: "SLL", label: "塞拉利昂利昂",},
  {value: "SOS", label: "索馬里先令",},
  {value: "SRD", label: "蘇里南元",},
  {value: "SSP", label: "南蘇丹鎊",},
  {value: "STN", label: "聖多美和普林西比多布拉",},
  {value: "SYP", label: "敘利亞鎊",},
  {value: "SZL", label: "斯威士蘭里朗吉尼",},
  {value: "THB", label: "泰銖",},
  {value: "TJS", label: "塔吉克索莫尼",},
  {value: "TMT", label: "土庫曼馬納特",},
  {value: "TND", label: "突尼斯第納爾",},
  {value: "TOP", label: "湯加潘加",},
  {value: "TRY", label: "土耳其里拉",},
  {value: "TTD", label: "千里達和多巴哥元",},
  {value: "TVD", label: "土瓦卢元",},
  {value: "TZS", label: "坦桑尼亞先令",},
  {value: "UAH", label: "烏克蘭格里夫納",},
  {value: "UGX", label: "烏干達先令",},
  {value: "USD", label: "美元",},
  {value: "UYU", label: "烏拉圭披索",},
  {value: "UZS", label: "烏茲別克索姆",},
  {value: "VES", label: "委內瑞拉玻利瓦爾",},
  {value: "VND", label: "越南盾",},
  {value: "VUV", label: "瓦努阿圖瓦圖",},
  {value: "WST", label: "薩摩亞塔拉",},
  {value: "XAF", label: "中非法郎",},
  {value: "XCD", label: "東加勒比元",},
  {value: "XDR", label: "特殊提款權",},
  {value: "XOF", label: "西非法郎",},
  {value: "XPF", label: "太平洋法郎",},
  {value: "YER", label: "也門里亞爾",},
  {value: "ZAR", label: "南非蘭特",},
  {value: "ZMW", label: "尚比亞克瓦查",},
  {value: "ZWL", label: "辛巴威元",}
]

const firstSelect = ref('TWD')
const currenciesSelect = ref([])
const tableW004_currency = ref([])
const W004_table_column_currency = ref([
  {'label': '貨幣名稱'},
  {'value': '貨幣代號'},
  {'currency': '金額'}
])
const rates = ref({})

function W004UrlDefault() {
  onMounted(async () => {
    await first_rates(null)
  })
}

const first_rates = async () => {
  try {
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/' + firstSelect.value)
    rates.value = response.data.rates
    ratesChangeCheck()
  } catch (error) {
    console.error('first_rates Error:', error);
  }
}

// 定義貨幣和匯率的映射物件
const exchangeRates = ref({})
const ratesChangeCheck = () => {
  let currencyCodes = currenciesSelect.value.map(currency => currency)
  let currencyRates = currencyCodes.map(currency => rates.value[currency])

  for (let i = 0; i < currencyCodes.length; i++) {
    exchangeRates.value[currencyCodes[i]] = currencyRates[i]
  }

  let updatedCurrencies = currencies.map(currency => {
    let exchangeRate = exchangeRates.value[currency.value]
    return {...currency, currency: exchangeRate}
  });

  let labels = currencyCodes.map(value => {
    return updatedCurrencies.find(curr => curr.value === value)
  })
  tableW004_currency.value = labels
  a.value = ''
  b.value = ''
  c.value = ''
}

const a = ref()
const b = ref()
const c = ref()
const value_a = ref('')

const calculate = () => {
  let number = a.value * b.value
  c.value = Math.round(number * 100) / 100
}

const select = (row) => {
  value_a.value = row.value
  a.value = row.currency
  calculate()
}

const selectInput = () => {
  calculate()
}

</script>

<template>
  <el-container>
    <el-header>{{ W004 }}</el-header>
    <el-container>
      <el-aside width="700px">
        <el-form-item>
          <el-select
              style="width:600px"
              v-model="firstSelect"
              filterable
              @change="first_rates"
          >
            <el-option
                v-for="item in currencies"
                :key="item.value"
                :label="`${item.label} - ${item.value}`"
                :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
              <span style=" float: right;
                          color: var(--el-text-color-secondary);
                          font-size: 13px;"
              >{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
              style="width:600px"
              v-model="currenciesSelect"
              multiple
              placeholder="輸入換算貨幣代號"
              :max-collapse-tags="currencies.length"
              filterable
              clearable
              @change="ratesChangeCheck"
          >
            <el-option
                v-for="item in currencies"
                :key="item.value"
                :label="item.value"
                :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
              <span style=" float: right;
                          color: var(--el-text-color-secondary);
                          font-size: 13px;"
              >{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-table
            :data="tableW004_currency"
            border
            style="width: 600px"
            empty-text="無資料"
        >
          <el-table-column
              label="功能"
              width="100%"
          >
            <template #default="scope">
              <el-button
                  @click.prevent="select(scope.row)"
              >選擇
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
              v-for="i in W004_table_column_currency"
              :label="String(i[Object.keys(i)[0]])"
              :prop="String(Object.keys(i))"
          />
        </el-table>
        <el-row>
          <el-form-item>
            <el-input
                v-model.number="a"
                disabled
            >
              <template #prepend>{{ value_a }}</template>
            </el-input>
          </el-form-item>
        </el-row>
        <br>
        <el-row>
          <el-form-item>
            <el-input
                v-model.number="b"
                @input="selectInput"
                style="width: 100%"
            >
              <template #prepend>{{ firstSelect }}</template>
            </el-input>
          </el-form-item>
          <el-text>&emsp;換多少&emsp;</el-text>
          <el-form-item>
            <el-input
                v-model.number="c"
                disabled
                style="width: 100%"
            >
              <template #prepend>{{ value_a }}</template>
            </el-input>
          </el-form-item>
        </el-row>
      </el-aside>
      <el-main>
        *
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>

</style>