<script setup>
const datePicker = ref([])
const defaultDateRange = ref([]);
watch(defaultDateRange, (newValue) => {
  datePicker.value = newValue;
});
const expense = ref(0)
const income = ref(0)
const totalAmount = ref(0)

setDefaultDateRange()

function setDefaultDateRange() {
  const currentDate = new Date()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  defaultDateRange.value = [firstDayOfMonth, lastDayOfMonth]
}


function calendar(A) {
  let date = A
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  return `${year}/${month}/${day}`
}

const CHdate = ref(new Date())
const insTypeValue = ref('')

const radioItems = ref([
  {label: '收入', value: '1'},
  {label: '食材', value: '2'},
  {label: '人力', value: '3'}
])

function insType() {
  let TF = false
  radioItems.value.forEach(element => {
    TF = element.label !== insTypeValue.value;
  })
  if (insTypeValue.value) {
    if (TF) {
      radioItems.value.push(
          {label: insTypeValue.value, value: (radioItems.value.length + 1).toString()}
      )
    }
  }
  insTypeValue.value = ''
}

function insTypeClear() {
  radioItems.value.splice(3, 1)
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

function showNull0() {
  show0.value = fromData.inputMoney <= 0
}

function showNull() {
  show.value = fromData.details === '';
}

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
      fetch('http://localhost:8080/index/ins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: fromData
        })
      })
          .then((response) => {
            return response.json()
          })
          .then((result) => {
            tableData.value = result
            fromData.inputMoney = 0
            fromData.details = ''
            expense.value = 0
            income.value = 0
            totalAmount.value = 0
          })
      setTimeout(() => {
        fetch('http://localhost:8080/index/finA', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            date: fromData.date
          })
        })
            .then((response) => {
              return response.json()
            })
            .then((result) => {
              tableDataData.value = result
            })
      }, 500)
    }
  }
}

function fin() {
  if (CHdate.value === null) {
    CHdate.value = new Date()
  }
  fromData.date = calendar(CHdate.value)
  if (CHdate.value === null) {
    CHdate.value = new Date()
  }
  if (fromData.date !== null) {
    fetch('http://localhost:8080/index/fin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        date: fromData.date
      })
    })
        .then((response) => {
          return response.json()
        })
        .then((result) => {
          tableData.value = result
          fromData.inputMoney = 0
          fromData.details = ''
          expense.value = 0
          income.value = 0
          totalAmount.value = 0
          fromData.expense_and_income_number = 'A'
        })
    fetch('http://localhost:8080/index/finA', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        date: fromData.date
      })
    })
        .then((response) => {
          return response.json()
        })
        .then((result) => {
          tableDataData.value = result
        })
  }
}

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
}

function calendarTwoDay(A) {
  let date = A
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  return `${year}/${month}/${day}`
}

const dateRange = ref([])

function find() {
  tableDataData.value = []
  if (datePicker.value === null) {
    datePicker.value = defaultDateRange.value
  }
  dateRange.value = []
  dateRange.value.push(
      calendarTwoDay(datePicker.value[0]),
      calendarTwoDay(datePicker.value[1])
  )
  if (dateRange.value.length !== 0) {
    fetch('http://localhost:8080/index/find', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dateRange: dateRange.value
      })
    })
        .then((response) => {
          return response.json()
        })
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
        })
  }

}

const multipleSelection = ref()
const handleSelectionChange = (val) => {
  multipleSelection.value = val

  if (multipleSelection.value.length !== 0) {
    fetch('http://localhost:8080/index/findA', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        multipleSelection: multipleSelection.value
      })
    })
        .then((response) => {
          return response.json()
        })
        .then((result) => {
          tableDataData.value = result
        })
  }
}

function confirmEvent(row) {
  fetch('http://localhost:8080/index/del', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      a_id: row.a_id,
      date: row.date,
      expense_and_income_number: row.expense_and_income_number,
      inputMoney: row.inputMoney
    })
  })
      .then((response) => {
        return response.json()
      })
      .then((result) => {
        tableDataData.value = result
      })
  setTimeout(() => {
    fetch('http://localhost:8080/index/fin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        date: row.date
      })
    })
        .then((response) => {
          return response.json()
        })
        .then((result) => {
          tableData.value = result
        })
  }, 500)
}

const dialogFormVisible = ref(false)
const tableDateSet = ref([])
const setInputMoney = ref(0)
const setDetails = ref('')
const showSet = ref(false)
const showSetDetails = ref(false)

function openDialog(row) {
  dialogFormVisible.value = true
  setInputMoney.value = row.inputMoney
  setDetails.value = row.details
  tableDateSet.value = []
  let t = {
    a_id: row.a_id,
    date: row.date,
    expense_and_income_name: row.expense_and_income_name,
    expense_and_income_number: row.expense_and_income_number,
    inputMoney: row.inputMoney,
    details: row.details
  }
  tableDateSet.value.push(t)
}

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
    fetch('http://localhost:8080/index/enter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        a_id: tableDateSet.value[0].a_id,
        date: tableDateSet.value[0].date,
        details: tableDateSet.value[0].details,
        expense_and_income_number: tableDateSet.value[0].expense_and_income_number,
        setInputMoney: setInputMoney.value,
        inputMoney: tableDateSet.value[0].inputMoney
      })
    })
        .then((response) => {
          return response.json()
        })
        .then((result) => {
          tableDataData.value = result
          dialogFormVisible.value = false
        })
    setTimeout(() => {
      fetch('http://localhost:8080/index/fin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: tableDateSet.value[0].date
        })
      })
          .then((response) => {
            return response.json()
          })
          .then((result) => {
            tableData.value = result
          })
    }, 500)
  }
}

const disabledTF = ref(false)

function radioInC() {
  radio_group_value.value = '1'
  disabledTF.value = true
}

function radioEX() {
  radio_group_value.value = '2'
  disabledTF.value = false
}

</script>

<template>
  <el-container class="layout-container-demo">
    <el-header style="text-align: left; font-size: 12px; margin-top: 1%">
      <div class="toolbar">
        <el-avatar :size="100">
          <img src="@/components/img.png" alt="IMG">
        </el-avatar>
        &emsp;
        <el-text style="color: white"><p>Luke Chen's 記帳表</p></el-text>
      </div>
    </el-header>
    <el-divider/>
    <el-main>
      <el-row>
        <el-form v-model="fromData">
          <el-form-item>
            <el-date-picker
                v-model="CHdate"
                type="date"
            />
            &emsp;
            <el-button plain type="primary" @click="fin">查詢</el-button>
          </el-form-item>

          <el-divider/>
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
              <el-radio label="A" border @click="radioEX">支出</el-radio>
              <el-radio label="B" border @click="radioInC">收入</el-radio>
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
        &emsp;
        <el-form-item>
          <el-button plain type="primary" @click="ins">新增</el-button>
          <el-button plain type="danger" @click="clear">清除</el-button>
        </el-form-item>
        &emsp;
        <el-table
            :data="tableData"
            @selection-change="handleSelectionChange"
            height="400px" border
            style="width: 900px"
            v-if="tableData.length > 0"
        >
          <el-table-column type="selection" width="55px"/>
          <el-table-column
              prop="date"
              label="日期"
          />
          <el-table-column
              prop="expense"
              label="支出"
          />
          <el-table-column
              prop="income"
              label="收入"
          />
          <el-table-column
              prop="totleMoney"
              label="總金額"
          />
        </el-table>
        <el-empty v-else description=" "/>
      </el-row>
      <el-divider/>
      <el-row>
        <el-form-item>
          <el-date-picker
              v-model="datePicker"
              type="daterange"
              range-separator="~"
              start-placeholder="Start"
              end-placeholder="End"
          />
        </el-form-item>
        &emsp;
        <el-form-item>
          <el-button plain type="primary" @click="find">查詢</el-button>
        </el-form-item>
        &emsp;
        <el-form-item>
          <el-text size="large" type="warning">總支出 ➠ <span style="color: cornflowerblue;">{{ expense }}</span> ＄
          </el-text>
        </el-form-item>
        &emsp;
        <el-form-item>
          <el-text size="large" type="warning">總收入 ➠ <span style="color: cornflowerblue;">{{ income }}</span> ＄
          </el-text>
        </el-form-item>
        &emsp;
        <el-form-item>
          <el-text size="large" type="warning">總金額 ➠ <span style="color: cornflowerblue;">{{ totalAmount }}</span> ＄
          </el-text>
        </el-form-item>
      </el-row>
      <el-text size="large" type="danger">支出、收入 ➠ 內容明細</el-text>
      <el-table
          :data="tableDataData"
          height="400px" border
          style="width: 1000px"
          v-if="tableDataData.length > 0">
        <el-table-column
            label="功能"
            width="150px"
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
            prop="date"
            label="日期"
        />
        <el-table-column
            prop="expense_and_income_name"
            label="選擇"
        />
        <el-table-column
            prop="inputMoney"
            label="金額"
        />
        <el-table-column
            prop="details"
            label="內容"
        />
      </el-table>
      <el-empty v-else description=" "/>
    </el-main>
  </el-container>
  <el-dialog v-model="dialogFormVisible" title="修改資料" width="500px">
    <el-button plain type="primary" @click="enter">確定</el-button>
    <el-table
        :data="tableDateSet"
        height="60px" border
        style="width: 1000px">
      <el-table-column
          prop="date"
          label="日期"
          width="75px"
      />
      <el-table-column
          prop="expense_and_income_name"
          label="選擇"
          width="45px"
      />
      <el-table-column
          prop="inputMoney"
          label="金額"
      />
      <el-table-column
          prop="details"
          label="內容"
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