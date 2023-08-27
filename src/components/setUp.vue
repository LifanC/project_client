<script setup>

const tableData = ref([])
const tableCsvData = ref([])
const tableDataList = ref([])

const csv = ref()

const csvTF = ref()
const selectCsv = ref('')
const selectCsvData = ref([])

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


</script>

<template>
  <el-container class="layout-container-demo">
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
        <el-text v-if="csvTF" type="success">{{ csv }}</el-text>
        <el-text v-else type="danger">{{ csv }}</el-text>
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