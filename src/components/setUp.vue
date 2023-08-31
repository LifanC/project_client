<script setup>

const tableData = ref([])
const tableCsvData = ref([])
const tableDataList = ref([])

const csv = ref()

const csvTF = ref()
const selectCsv = ref('')
const selectCsvData = ref([])
const userNameValue = ref()

const cookies = document.cookie.split("; ");
for (const cookie of cookies) {
  const [name, value] = cookie.split("=");
  if (name === "userName") {
    userNameValue.value = value
  }
}

function getCsv() {
  fetch('http://localhost:8080/setUp/readCsv', {
    method: 'GET',
  })
      .then((response) => {
        return response.json()
      })
      .then((result) => {
        selectCsv.value = result[0]
        selectCsvData.value = result
      })
}

function getCsvData() {
  if (selectCsv.value !== '') {
    fetch('http://localhost:8080/setUp/readCsvData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        selectCsv: selectCsv.value
      })
    })
        .then((response) => {
          return response.json()
        })
        .then((result) => {
          if (result[0] === 'error') {
            csv.value = result[1]
            tableCsvData.value = []
            csvTF.value = false
          } else {
            csv.value = '成功載入文件 (UTF-8)'
            tableCsvData.value = result[0]
            csvTF.value = true
          }
        })
  }
}

getCsv()
setTimeout(() => {
  getCsvData()
}, 500)

const textMessage = ref('')
const textMessageName = ref('')
const type = ref('')
function handleSuccess(response, file) {
  getCsv()
  if('文件上傳成功' === response){
    type.value = 'success'
  }else{
    type.value = 'danger'
  }
  textMessageName.value = file.name
  textMessage.value = response
}
function beforeUpload(file) {
  const allowedType = 'text/csv';
  if (file.type !== allowedType) {
    ElMessage.error("只能上傳 CSV 文件");
    return false;
  }
  return true;
}


</script>

<template>
  <el-container class="layout-container-demo">
    {{ userNameValue }}
    <el-header
        style="text-align: left;
        font-size: 12px; margin-top: 1%"
    />
    <el-main>
      <el-form-item>
        <el-select v-model="selectCsv" class="m-2" placeholder="Select CSV">
          <el-option
              v-for="item in selectCsvData"
              :key="item"
              :label="item"
              :value="item"
              @click="getCsvData"
          />
        </el-select>
        &emsp;
        <el-text type="primary">D:\project3.0\file_csv\&emsp;文件載入 (UTF-8)</el-text>
        <el-divider/>
        <el-text v-if="csvTF" type="primary">{{ csv }}</el-text>
        <el-text v-else type="danger">{{ csv }}</el-text>
      </el-form-item>
      <el-form-item>
        <el-upload
            action="http://localhost:8080/setUp/fileUpload"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
            :limit="1"
        >
          <el-button size="small" type="primary">上傳文件</el-button>
          <template #tip>
            <div class="el-upload__tip">
              只能上傳 CSV 文件
            </div>
          </template>
          &emsp;
          <el-text type="primary">{{ textMessageName }}</el-text>
          &emsp;
          <el-text :type="type">{{ textMessage }}</el-text>
        </el-upload>
        <el-text>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</el-text>
      </el-form-item>
      <el-form-item>
        <el-table
            :data="tableCsvData"
            height="400px" border
            style="width: 1000px"
        >
          <el-table-column
              label="(1)"
              prop="0"
          />
          <el-table-column
              label="(2)"
              prop="1"
          />
          <el-table-column
              label="(3)"
              prop="2"
          />
          <el-table-column
              label="(4)"
              prop="3"
          />
          <el-table-column
              label="(5)"
              prop="4"
          />
          <el-table-column
              label="(6)"
              prop="5"
          />
        </el-table>
      </el-form-item>
    </el-main>
  </el-container>
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