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

const beforeRemove = (file) => {
  text.value = ''
  fileList.value = []
}

const submitUpload = async () => {
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
      text.value = response.data
    } catch (error) {
      // console.error('goW001 Error:', error)
      text.value = error.response.data
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
            'Warning',
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
  if (!formEl) return
  formEl.resetFields()
}

const options = ref(
    [
      { value: 'A', label: 'A' },
      { value: 'B', label: 'B' },
      { value: 'C', label: 'C' },
      { value: 'D', label: 'D' },
      { value: 'E', label: 'E' },
      { value: 'F', label: 'F' },
      { value: 'G', label: 'G' },
      { value: 'H', label: 'H' },
      { value: 'I', label: 'I' },
      { value: 'J', label: 'J' },
      { value: 'K', label: 'K' },
      { value: 'L', label: 'L' },
      { value: 'M', label: 'M' },
      { value: 'N', label: 'N' },
      { value: 'O', label: 'O' },
      { value: 'P', label: 'P' },
      { value: 'Q', label: 'Q' },
      { value: 'R', label: 'R' },
      { value: 'S', label: 'S' },
      { value: 'T', label: 'T' },
      { value: 'U', label: 'U' },
      { value: 'V', label: 'V' },
      { value: 'W', label: 'W' },
      { value: 'X', label: 'X' },
      { value: 'Y', label: 'Y' },
      { value: 'Z', label: 'Z' }
    ]
)

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
              上傳到伺服器
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
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button-group>
                <el-button type="primary" @click="submitForm(formRef)">新增</el-button>
                <el-button @click="resetForm(formRef)">清除</el-button>
              </el-button-group>
            </el-form-item>
          </el-form>
        </el-row>
        <el-text>{{ textOnly }}</el-text>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>

</style>