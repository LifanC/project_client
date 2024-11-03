<script setup>
import axios from "axios";
import {toFindCookie} from "@/components/componentsJs/cookie";

axios.defaults.baseURL = 'http://localhost:8080'
const frontEnd = 'http://localhost:5173'
const path = window.location.pathname + '/'

const fromData = reactive({
  accountNumber: '',
  password: '',
})

const formRef = ref(null)
const fromDataW001 = reactive({
  accountNumber: '',
  password: '',
  money: '',
  type: '',
})

if (toFindCookie() === undefined) {
  location.href = frontEnd
} else {
  let findCookie = toFindCookie().split('|')
  fromData.accountNumber = findCookie[0]
  fromData.password = findCookie[1]
  fromDataW001.accountNumber = findCookie[0]
  fromDataW001.password = findCookie[1]
}

const W001 = ref('')
goW001()

async function goW001() {
  try {
    const response = await axios.get(path + goW001.name)
    W001.value = response.data
    PubSub.publish('W001', W001.value)
  } catch (error) {
    console.error('goW001 Error:', error)
  }
}

const fileList = ref([]);
const text = ref('');
const textOnly = ref('');
const textQuery = ref('查詢，顯示大於輸入金額的該種類資料');

const beforeRemove = (file) => {
  fileList.value = []
}

const submitUpload = async () => {
  text.value = ''
  if (fileList.value.length > 0) {
    fromData.fileList = fileList.value[0].raw
    fromData.fileName = fileList.value[0].name
    try {
      const response = await axios({
        method: 'post',
        url: path + submitUpload.name,
        data: fromData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      let data = response.data
      let messages = data
          .replace(/^\[\[|\]\]$/g, '')  // 去除最外層的中括號
          .split(/\], \[/)              // 按照 '], [' 分割
          .map(item => item.replace(/(^\[|\]$)/g, ''));  // 去除每個元素的括號
      let result = messages.join("<br>");
      ElMessageBox.confirm(
          result,
          '批次新增',
          {
            confirmButtonText: '新增',
            cancelButtonText: '取消',
            type: 'warning',
            dangerouslyUseHTMLString: true
          }
      )
          .then(async () => {
            try {
              const responseOk = await axios({
                method: 'post',
                url: path + submitUpload.name + "Ok",
                data: fromData,
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              });
              text.value = responseOk.data
            } catch (error) {
              // console.error('submitFormOk Error:', error)
            }
          })
          .catch(() => {
          })
    } catch (error) {
      // console.error('goW001 Error:', error.response.data)
      let messages = error.response.data
          .replace(/^\[\[|\]\]$/g, '')  // 去除最外層的中括號
          .split(/\], \[/)              // 按照 '], [' 分割
          .map(item => item.replace(/(^\[|\]$)/g, ''));  // 去除每個元素的括號
      let result = messages.join("<br>");
      ElMessageBox.alert(result, '錯誤訊息', {
        confirmButtonText: '確定',
        type: 'error',
        dangerouslyUseHTMLString: true
      });
    }
  }
}

const rules = computed(() => {
  return {
    money: [{required: true, message: '金額必填'}, {type: 'number', message: '金額必填是數字'},],
    type: [{required: true, message: '種類必填'},]
  };
});

const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      try {
        const response = await axios({
          method: 'post',
          url: path + submitForm.name,
          data: fromDataW001,
        });
        let data = response.data
        ElMessageBox.confirm(
            '種類為' + fromDataW001.type + data,
            '新增',
            {
              confirmButtonText: '新增',
              cancelButtonText: '取消',
              type: 'warning',
            }
        )
            .then(async () => {
              try {
                const response = await axios({
                  method: 'post',
                  url: path + submitForm.name + "Ok",
                  data: fromDataW001,
                });
                textOnly.value = response.data
              } catch (error) {
                // console.error('submitFormOk Error:', error)
              }
            })
            .catch(() => {
              fromDataW001.money = ''
              fromDataW001.type = ''
            })
      } catch (error) {
        // console.error('submitForm Error:', error)
      }
    }
  })
}

const resetForm = (formEl) => {
  textOnly.value = ''
  if (!formEl) return
  formEl.resetFields()
}

const options = ref(
    [
      {value: 'A', label: '食物'},
      {value: 'B', label: '飲品'},
      {value: 'C', label: '交通'},
      {value: 'D', label: '消費'},
      {value: 'E', label: '娛樂'},
      {value: 'F', label: '居家'},
      {value: 'G', label: '3C'},
      {value: 'H', label: '醫藥'},
      {value: 'I', label: '早餐'},
      {value: 'J', label: '中餐'},
      {value: 'K', label: '晚餐'},
      {value: 'L', label: '電費'},
      {value: 'M', label: '水費'},
      {value: 'N', label: '網路費'},
      {value: 'O', label: '電話費'},
      {value: 'P', label: '掛號費'},
      {value: 'Q', label: '伏冒熱飲'},
      {value: 'R', label: '加油'},
      {value: 'S', label: '機油'},
      {value: 'T', label: '齒輪油'},
      {value: 'U', label: '罰單'},
      {value: 'V', label: '捷運'},
      {value: 'W', label: '宵夜'},
      {value: 'X', label: '紅包'},
      {value: 'Y', label: '其他'},
      {value: 'Z', label: '收入'}
    ]
)

const tableW001 = ref([]);
const w001TableColumn = ref([
  {'number': '編號'},
  {'money': '金額'},
  {'type': '類別'},
  {'update_time': '更新日期'}
])
const queryForm = (formEl) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      try {
        const response = await axios({
          method: 'post',
          url: path + queryForm.name,
          data: fromDataW001,
        });
        tableW001.value = response.data[0]
      } catch (error) {
        // console.error('queryForm Error:', error)
      }
    } else {
      fromDataW001.money = 1
      if (!fromDataW001.type) {
        fromDataW001.type = 'A'
      }
    }
  });
}

</script>

<template>
  <el-container>
    <el-header>{{ W001 }}</el-header>
    <el-container>
      <el-main>
        <el-text>金額、種類</el-text>
        <el-row>
          <el-upload
              v-model:file-list="fileList"
              :before-remove="beforeRemove"
              :limit="1"
              :auto-upload="false"
          >
            <template #trigger>
              <el-button type="primary">選擇資料</el-button>
            </template>
            <template #tip>
              <br>
              <el-text>限制1個文件</el-text>
            </template>
            <el-button type="success" @click="submitUpload">
              批次新增
            </el-button>
          </el-upload>
        </el-row>
        <el-text>{{ text }}</el-text>
        <el-row>
          <el-form
              ref="formRef"
              style="max-width: 500px"
              :model="fromDataW001"
              :rules="rules"
              label-width="auto"
          >
            <!--"金額", "種類", "編號"-->
            <el-form-item
                label="金額"
                prop="money"
            >
              <el-input
                  v-model.number="fromDataW001.money"
                  type="text"
                  autocomplete="off"
                  @input="fromDataW001.money = (fromDataW001.money <= 0) ? 1 : fromDataW001.money"
              />
            </el-form-item>
            <el-form-item
                label="種類"
                prop="type"
            >
              <el-select
                  v-model="fromDataW001.type"
                  placeholder=" "
                  style="width: 240px"
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
            <el-text>{{ textQuery }}</el-text>
            <el-form-item>
              <el-button-group>
                <el-button type="primary" @click="submitForm(formRef)">新增</el-button>
                <el-button @click="resetForm(formRef)">清除</el-button>
                <el-button type="info" @click="queryForm(formRef)">查詢</el-button>
              </el-button-group>
            </el-form-item>
          </el-form>
        </el-row>
        <el-text>{{ textOnly }}</el-text>
        <p>主要資料</p>
        <el-row>
          <el-table
              :data="tableW001"
              border
              style="width: 1000px; height: 500px;"
              empty-text="無資料"
              show-summary
              sum-text="合計"
          >
            <el-table-column
                v-for="i in w001TableColumn"
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