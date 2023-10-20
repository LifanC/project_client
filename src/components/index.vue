<script setup>

import {getApi, postApi} from "@/components/js/api";
import PubSub from "pubsub-js";
import {setDefaultDateRange, calendar} from "@/components/componentsJs/index"
import {toFindCookie} from "@/components/js/cookie"

const datePicker = ref([])
const defaultDateRange = ref([]);

defaultDateRange.value = setDefaultDateRange()
datePicker.value = setDefaultDateRange()

const expense = ref(0)
const income = ref(0)
const totalAmount = ref(0)
const userNameValue = ref()

userNameValue.value = toFindCookie()

const CHdate = ref(new Date())
const insTypeValue = ref('')

const radioItems = ref([
  {label: '收入', value: '1'},
  {label: '食物', value: '2'},
  {label: '交通', value: '3'},
  {label: '消費', value: '4'},
  {label: '3C', value: '5'},
  {label: '其他', value: '6'}
])

/**
 * <h3>新增其他種類的方法</h3>
 */
function insType() {
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
}

/**
 * <h3>清除其他種類的方法</h3>
 */
function insTypeClear() {
  if (radioItems.value.length > 6) {
    radioItems.value.splice(-1, 1)
  }
}

const radio_group_value = ref('2')

const fromData = reactive({
  date: '',
  expense_and_income_number: 'A',
  inputMoney: 0,
  details: '',
  radio_group_value: '2',
  radioItems: '',
})

const tableData = ref([])
const tableDataData = ref([])
const show = ref(false)
const show0 = ref(false)

/**
 * <h3>金額請勿小於 0 或等於 0</h3>
 */
function showNull0() {
  show0.value = fromData.inputMoney <= 0
}

/**
 * <h3>請輸入支出或收入的內容</h3>
 */
function showNull() {
  show.value = fromData.details === '';
}

/**
 * <h3>index新增功能</h3>
 */
function ins() {
  if (CHdate.value === null) {
    CHdate.value = new Date()
  }
  fromData.date = calendar(CHdate.value)
  if (fromData.inputMoney === null || setInputMoney.value < 0) {
    fromData.inputMoney = 0
  }
  show0.value = fromData.inputMoney <= 0;
  show.value = fromData.details === '';
  if (radio_group_value.value === '1' && fromData.expense_and_income_number === 'A') {
    radio_group_value.value = '2'
    fromData.inputMoney = 0
    fromData.details = ''
    ElNotification.error({
      title: '注意',
      dangerouslyUseHTMLString: true,
      message: '<strong>' +
          '<span style="color: blue; font-size: 20px;">選擇支出</span>' +
          ' <br>' +
          ' <span style="color: crimson; font-size: 20px;">種類&emsp;請勿點選</span>' +
          '<span style="color: blue; font-size: 24px;">收入</span>' +
          '</strong>',
      position: 'top-left',
      duration: 10000,
    })
  } else {
    if (fromData.date !== null && fromData.inputMoney > 0 && fromData.details !== '') {
      fromData.radio_group_value = radio_group_value.value
      fromData.radioItems = radioItems.value[Number(radio_group_value.value) - 1].label
      //index新增功能 回傳Table B 的值
      postApi('http://localhost:8080/index/ins', fromData)
          .then((result) => {
            tableData.value = result
            fromData.inputMoney = 0
            fromData.details = ''
            expense.value = 0
            income.value = 0
            totalAmount.value = 0
          })
      setTimeout(() => {
        //index查詢資料庫Table A的值
        postApi('http://localhost:8080/index/finA', fromData.date)
            .then((result) => {
              tableDataData.value = result
              printIreportMessage1.value = ''
              printIreportMessage2.value = ''
            })
      }, 500)
    }
  }
}

/**
 * <h3>index單一查詢功能</h3>
 */
function fin() {
  if (CHdate.value === null) {
    CHdate.value = new Date()
  }
  fromData.date = calendar(CHdate.value)
  if (CHdate.value === null) {
    CHdate.value = new Date()
  }
  if (fromData.date !== null) {
    //index查詢資料庫Table B的值
    postApi('http://localhost:8080/index/fin', fromData.date)
        .then((result) => {
          tableData.value = result
          fromData.expense_and_income_number = 'A'
          printIreportMessage1.value = ''
          printIreportMessage2.value = ''
        })
    //index查詢資料庫Table A的值
    postApi('http://localhost:8080/index/finA', fromData.date)
        .then((result) => {
          tableDataData.value = result
          printIreportMessage1.value = ''
          printIreportMessage2.value = ''
        })
  }
}

/**
 * <h3>index清除input值的功能</h3>
 */
function clear() {
  fromData.expense_and_income_number = 'A'
  fromData.inputMoney = 0
  fromData.details = ''
  tableData.value = []
  tableDataData.value = []
  expense.value = 0
  income.value = 0
  totalAmount.value = 0
  CHdate.value = new Date()
  show.value = false
  show0.value = false
  radio_group_value.value = '2'
  printIreportMessage1.value = ''
  printIreportMessage2.value = ''
}

/**
 * <h3>index Start~End日期查詢功能</h3>
 */
function find() {
  tableDataData.value = []
  if (datePicker.value === null) {
    datePicker.value = defaultDateRange.value
  }
  if (0 !== datePicker.value.length) {
    //index查詢資料庫Table B的值
    postApi('http://localhost:8080/index/find', datePicker.value)
        .then((result) => {
          tableData.value = result
          let ex = 0
          for (let key in result) {
            ex += result[key].expense
          }
          expense.value = ex
          let inc = 0
          for (let key in result) {
            inc += result[key].income
          }
          income.value = inc
          let tot = 0
          for (let key in result) {
            tot += result[key].totleMoney
          }
          totalAmount.value = tot
          printIreportMessage1.value = ''
          printIreportMessage2.value = ''
        })
  }

}

const multipleSelection = ref()
const disabledTF = ref(true)
/**
 * <h3>index 選擇多框選項A</h3>
 * @param val
 */
const handleSelectionChange = (val) => {
  reportTF.value = false;
  multipleSelection.value = val
  if (multipleSelection.value.length !== 0) {
    disabledTF.value = false
    //index查詢資料庫Table A的值
    postApi('http://localhost:8080/index/findA', multipleSelection.value)
        .then((result) => {
          tableDataData.value = result
          printIreportMessage1.value = ''
          printIreportMessage2.value = ''
        })
  } else {
    disabledTF.value = true
  }
}

/**
 * <h3>index選擇日期 刪除功能</h3>
 */
function confirmEvent(row) {
  //index刪除功能
  postApi('http://localhost:8080/index/del', {
    a_id: row.a_id,
    date: row.date,
    expense_and_income_number: row.expense_and_income_number,
    inputMoney: row.inputMoney
  })
      .then((result) => {
        tableDataData.value = result
        printIreportMessage1.value = ''
        printIreportMessage2.value = ''
      })
  setTimeout(() => {
    //index查詢資料庫Table B的值
    postApi('http://localhost:8080/index/fin', row.date)
        .then((result) => {
          tableData.value = result
          printIreportMessage1.value = ''
          printIreportMessage2.value = ''
        })
  }, 500)
}

const dialogFormVisible = ref(false)
const tableDateSet = ref([])
const newtableDateSet = ref([])
const setInputMoney = ref(0)
const setDetails = ref('')
const showSet = ref(false)
const showSetDetails = ref(false)

function openDialog(row) {
  dialogFormVisible.value = true
  setInputMoney.value = row.inputMoney
  setDetails.value = row.details
  tableDateSet.value = []
  let od = {
    a_id: row.a_id,
    date: row.date,
    expense_and_income_name: row.expense_and_income_name,
    expense_and_income_number: row.expense_and_income_number,
    inputMoney: row.inputMoney,
    details: row.details
  }
  tableDateSet.value.push(od)
}

/**
 * <h3>index修改資料明細功能</h3>
 */
function enter() {
  showSet.value = setInputMoney.value <= 0;
  showSetDetails.value = setDetails.value === '';
  if (setInputMoney.value === null || setInputMoney.value < 0) {
    setInputMoney.value = 0
  }
  if (!showSet.value && !showSetDetails.value) {
    tableDateSet.value.forEach(e => {
      e.details = setDetails.value
    })
    //index修改資料明細功能 回傳資料庫Table A的值
    postApi('http://localhost:8080/index/enter', {
      a_id: tableDateSet.value[0].a_id,
      date: tableDateSet.value[0].date,
      details: tableDateSet.value[0].details,
      expense_and_income_number: tableDateSet.value[0].expense_and_income_number,
      setInputMoney: setInputMoney.value,
      inputMoney: tableDateSet.value[0].inputMoney
    })
        .then((result) => {
          tableDataData.value = result
          dialogFormVisible.value = false
          printIreportMessage1.value = ''
          printIreportMessage2.value = ''
        })
    setTimeout(() => {
      //index查詢資料庫Table B的值
      postApi('http://localhost:8080/index/fin', tableDateSet.value[0].date)
          .then((result) => {
            tableData.value = result
            printIreportMessage1.value = ''
            printIreportMessage2.value = ''
          })
    }, 500)
  }
}

/**
 * <h3>收入</h3>
 */
function radioInC() {
  radio_group_value.value = '1'
  disabledTF.value = true
}

/**
 * <h3>支出</h3>
 */
function radioEX() {
  radio_group_value.value = '2'
  disabledTF.value = false
}

const B = ref([
  {'date': '日期'},
  {'expense': '支出'},
  {'income': '收入'},
  {'totleMoney': '總金額'}
])

const A = ref([
  {'date': '日期'},
  {'expense_and_income_name': '選擇'},
  {'inputMoney': '金額'},
  {'details': '內容'}
])

const printIreportMessage1 = ref('')
const printIreportMessage2 = ref('')
const typeColor = ref('')
const reportTF = ref(true)

/**
 * <h3>index列印報表</h3>
 */
function printIreport() {
  if (multipleSelection.value) {
    //index查詢資料庫Table B的值
      postApi('http://localhost:8080/index/printIreport', multipleSelection.value)
          .then((result) => {
            if (result === 'err') {
              printIreportMessage1.value = '失敗'
              printIreportMessage2.value = ''
              typeColor.value = 'danger'
              tableData.value = []
            } else {
              printIreportMessage1.value = '成功'
              typeColor.value = 'success'
              printIreportMessage2.value = result[0]
              printIreportData()
            }
          })
  }
}

const p_ire_data = ref([])
printIreportData()

/**
 * <h3>index畫面顯示報表名稱</h3>
 */
function printIreportData() {
  getApi('http://localhost:8080/index/printIreportData?fileName=reportBpdf')
      .then((result) => {
        p_ire_data.value = result
      })
}

/**
 * <h3>index查詢報表路徑位置</h3>
 */
function printPath() {
  getApi('http://localhost:8080/index/printPath?fileName=reportBpdf')
      .then((result) => {
        printIreportMessage2.value = result
      })
}


</script>

<template>
  <el-container class="layout-container-demo">
    <p>{{ userNameValue }}</p>
    <el-header style="text-align: left; font-size: 12px; margin-top: 1%">
      <div class="toolbar">
        <el-avatar :size="100">
          <img src="@/components/img/img.png" alt="IMG">
        </el-avatar>
        &emsp;
        <el-text style="color: white"><p>Luke Chen's 記帳表</p></el-text>
        <div>
          &emsp;
          <el-text size="large" type="warning">總支出 ➠ <span style="color: cornflowerblue;">
            {{ expense.toLocaleString('en-US', {style: 'currency', currency: 'USD'}).replace(/\.00$/, '') }}
          </span>
          </el-text>
          &emsp;
          <el-text size="large" type="warning">總收入 ➠ <span style="color: cornflowerblue;">
            {{ income.toLocaleString('en-US', {style: 'currency', currency: 'USD'}).replace(/\.00$/, '') }}
          </span>
          </el-text>
          &emsp;
          <el-text size="large" type="warning">總金額 ➠ <span style="color: cornflowerblue;">
            {{ totalAmount.toLocaleString('en-US', {style: 'currency', currency: 'USD'}).replace(/\.00$/, '') }}
          </span>
          </el-text>
        </div>
      </div>
    </el-header>
    <el-container>
      <el-aside width="350px">
        <div style="height: 300px;padding-top: 50px">
          <el-steps direction="vertical" :active="1">
            <el-step title="Step 1" description="先查詢幾月到幾月的資料"/>
            <el-step title="Step 2" description="點選日期"/>
            <el-step title="Step 3" description="修改資料、刪除資料"/>
            <el-step title="Step 4" description="新增資料"/>
          </el-steps>
        </div>
        <el-divider/>
        <el-button plain type="primary" size="large"
                   :disabled="disabledTF"
                   @click="printIreport">列印報表
        </el-button>
        &emsp;
        <el-text :type="typeColor">{{ printIreportMessage1 }}</el-text>
        <br><br>
        <el-button plain type="warning" size="small"
                   @click="printPath">查詢報表路徑
        </el-button>
        <el-card>
          <el-text v-for="i in p_ire_data">編號 : {{ i }}<br></el-text>
        </el-card>
      </el-aside>
      <el-main>
        <el-row>
          <el-space wrap>
            <el-card shadow="always">
              <el-form v-model="fromData">
                <el-form-item label="新增其他種類">
                  <el-input v-model="insTypeValue" type="text" size="small" style="width: 250px;height: 100%"
                            placeholder="可不填"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button plain type="primary" size="small"
                             @click="insType">新增暫存種類
                  </el-button>
                  <el-button plain type="danger" size="small"
                             @click="insTypeClear">清除暫存種類
                  </el-button>
                </el-form-item>
                <el-divider/>
                <el-form-item label="種類">
                  <el-radio-group v-model="radio_group_value">
                    <el-radio-button
                        v-for="radioItem in radioItems"
                        :key="radioItem.value"
                        :label="radioItem.value"
                        :disabled="disabledTF"
                        size="small"
                    >{{ radioItem.label }}
                    </el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="選擇">
                  <el-radio-group v-model="fromData.expense_and_income_number">
                    <el-radio size="small" label="A" border @click="radioEX">支出</el-radio>
                    <el-radio size="small" label="B" border @click="radioInC">收入</el-radio>
                  </el-radio-group>
                </el-form-item>
                <div v-show="show0" style="color: red">金額請勿小於 0 或等於 0</div>
                <el-form-item label="金額">
                  <el-input-number
                      @blur="showNull0"
                      v-model.number="fromData.inputMoney"
                  />
                </el-form-item>
                <div v-show="show" style="color: red">請輸入支出或收入的內容</div>
                <el-form-item label="支出、收入內容">
                  <el-input
                      @input="showNull"
                      v-model="fromData.details" type="textarea" style="width: 100%;height: 100%"/>
                </el-form-item>
              </el-form>
              <el-form-item label="日期">
                <el-date-picker
                    v-model="CHdate"
                    type="date"
                />
                &emsp;
                <el-button plain type="default" @click="fin">查詢</el-button>
              </el-form-item>
              <el-form-item>
                <el-button plain type="primary" @click="ins">新增</el-button>
                <el-button plain type="danger" @click="clear">清除</el-button>
              </el-form-item>
            </el-card>
          </el-space>
          <el-table
              :data="tableData"
              @selection-change="handleSelectionChange"
              height="500px" border
              style="width: 900px"
              v-if="tableData.length > 0"
          >
            <el-table-column type="selection" width="55px"/>
            <el-table-column
                v-for="i in B"
                :label="i[Object.keys(i)[0]].toString()"
                :prop="Object.keys(i).toString()"
            />
          </el-table>
        </el-row>
        <el-divider/>
        ➠
        <el-text type="warning">{{ printIreportMessage2 }}</el-text>
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
            <el-button plain type="primary" @click="find">查詢</el-button>
          </el-form-item>
        </el-row>
        <el-row>
          <el-table
              :data="tableDataData"
              height="500px" border
              style="width: 1000px"
              v-if="tableDataData.length > 0">
            <el-table-column
                label="功能"
                width="200px"
            >
              <template #default="scope">
                <el-button
                    link
                    type="primary"
                    @click.prevent="openDialog(scope.row)"
                >修改金額
                </el-button>
                <el-popconfirm
                    width="220"
                    confirm-button-text="確定"
                    cancel-button-text="取消"
                    title="確定要刪除嗎?"
                    @confirm="confirmEvent(scope.row)"
                >
                  <template #reference>
                    <el-button link type="primary">刪除資料</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
            <el-table-column
                v-for="i in A"
                :label="i[Object.keys(i)[0]].toString()"
                :prop="Object.keys(i).toString()"
            />
          </el-table>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
  <el-dialog v-model="dialogFormVisible" title="修改資料" width="800px">
    <el-button plain type="primary" @click="enter">確定</el-button>
    <br><br>
    <el-table
        :data="tableDateSet"
        border
        height="160px"
        style="width: 1000px">
      <el-table-column
          v-for="i in A"
          :label="i[Object.keys(i)[0]].toString()"
          :prop="Object.keys(i).toString()"
      />
    </el-table>
    <el-divider/>
    <div v-show="showSet" style="color: red">金額請勿小於 0 或等於 0</div>
    <el-form-item label="金額">
      <el-input-number
          type="number"
          v-model.number="setInputMoney"
      />
    </el-form-item>
    <div v-show="showSetDetails" style="color: red">請輸入支出或收入的內容</div>
    <el-form-item label="內容">
      <el-input
          type="textarea"
          style="width: 100%;height: 100%"
          v-model="setDetails"
      />
    </el-form-item>
  </el-dialog>
</template>

<style scoped>
.demo-calendar {
  height: 100%;
  width: 700px;
}

.layout-container-demo .el-header {
  background-color: black;
}

.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  height: 100%;
  right: 20px;
}

.custom-width {
  width: 250px;
}
</style>