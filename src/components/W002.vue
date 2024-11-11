<script setup>
import axios from "axios";
import {toFindCookie} from "@/components/componentsJs/cookie";
import {optionsLists} from "@/components/componentsJs/common";

axios.defaults.baseURL = 'http://localhost:8080'
const frontEnd = 'http://localhost:5173'
const path = window.location.pathname + '/'

const fromData = reactive({
  accountNumber: '',
  password: '',
})

const fromDataW002 = reactive({
  accountNumber: '',
  password: '',
  type: '',
})

if (toFindCookie() === undefined) {
  location.href = frontEnd
} else {
  let findCookie = toFindCookie().split('|')
  fromData.accountNumber = findCookie[0]
  fromData.password = findCookie[1]
  fromDataW002.accountNumber = findCookie[0]
  fromDataW002.password = findCookie[1]
}

const W002 = ref('')
goW002()

async function goW002() {
  try {
    const response = await axios.get(path + goW002.name)
    W002.value = response.data
    PubSub.publish('W002', W002.value)
    fromDataW002.type = 'A'
    selectData()
  } catch (error) {
    console.error('goW002 Error:', error)
  }
}

const options = ref(optionsLists())

const tableW002 = ref([]);
const w002TableColumn = ref([
  {'dataNumber': '編號'},
  {'accountNumber': '帳號'},
  {'count': '數量'},
  {'sum': '加總'},
  {'avg': '平均'}
])
const tableW002x = ref([]);
const w002TableColumnx = ref([
  {'number': '編號'},
  {'money': '金額'},
  {'update_time': '新增日期'},
  {'update_cd': ''}
])
const tableW002h = ref([]);
const w002TableColumnh = ref([
  {'number': '編號'},
  {'money': '金額'},
  {'update_time': '異動日期'},
  {'update_cd': ''}
])

async function selectData() {
  try {
    const response = await axios({
      method: 'post',
      url: path + selectData.name,
      data: fromDataW002,
    });
    tableW002.value = response.data[0]
  } catch (error) {
    // console.error('selectData Error:', error)
  }
  try {
    const response = await axios({
      method: 'post',
      url: path + selectData.name + 'x',
      data: fromDataW002,
    });
    tableW002x.value = response.data[0]
  } catch (error) {
    // console.error('selectDatax Error:', error)
  }
  try {
    const response = await axios({
      method: 'post',
      url: path + selectData.name + 'h',
      data: fromDataW002,
    });
    tableW002h.value = response.data[0]
  } catch (error) {
    // console.error('selectDatah Error:', error)
  }

}

</script>

<template>
  <el-container>
    <el-header>{{ W002 }}</el-header>
    <el-container>
      <el-main>
        <el-row>
          <el-form
              ref="formRef"
              style="max-width: 500px"
              :model="fromDataW002"
              label-width="auto"
          >
            <el-form-item
                label="種類"
                prop="type"
            >
              <el-select
                  v-model="fromDataW002.type"
                  placeholder=" "
                  style="width: 240px"
                  @change="selectData"
              >
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                  <span style="float: left">{{ item.label }}</span>
                  <span
                      style="
                      float: right;
                      color: var(--el-text-color-secondary);
                      font-size: 13px;
                    ">
                    {{ item.value }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-row>
        <el-row>
          <el-table
              :data="tableW002"
              border
              style="width: 1000px; height: 80px;"
              empty-text="無資料"
          >
            <el-table-column
                v-for="i in w002TableColumn"
                :label="i[Object.keys(i)[0]].toString()"
                :prop="Object.keys(i).toString()"
            />
          </el-table>
        </el-row>
        <el-text>主要資料</el-text>
        <el-row>
          <el-table
              :data="tableW002x"
              border
              style="width: 1000px; height: 250px;"
              empty-text="無資料"
              show-summary
              sum-text="合計"
          >
            <el-table-column
                v-for="i in w002TableColumnx"
                :label="i[Object.keys(i)[0]].toString()"
                :prop="Object.keys(i).toString()"
            />
          </el-table>
        </el-row>
        <el-text>異動資料</el-text>
        <el-row>
          <el-table
              :data="tableW002h"
              border
              style="width: 1000px; height: 250px;"
              empty-text="無資料"
          >
            <el-table-column
                v-for="i in w002TableColumnh"
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