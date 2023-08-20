<script setup>

const tableData = ref([])
const tableDataList = ref([])

function getTable() {
  fetch('http://localhost:8080/setUp/getTable', {
    method: 'GET',
  })
      .then((response) => {
        return response.json()
      })
      .then((result) => {
        tableData.value = result
      })
}

function getCsv() {
  fetch('http://localhost:8080/setUp/readCsv', {
    method: 'GET',
  })
  .then((response) => {
    return response.json()
  })
  .then((result) => {
    console.log('result',result)
  })
}


PubSub.subscribe('A2', function (msg, data) {
  getTable()
  getCsv()
})

</script>

<template>
  <el-container class="layout-container-demo">
    <el-header style="text-align: left; font-size: 12px; margin-top: 1%">
      <div class="toolbar">
        <el-avatar :size="100">
          <img src="@/components/img.png" alt="IMG">
        </el-avatar>
        &emsp;
        <el-text style="color: white"><p>Luke Chen's 設定</p></el-text>
      </div>
    </el-header>
    <el-divider/>
    <el-main>
      <el-form-item>
        <el-text type="primary">載入文件 fileOne.csv</el-text>
      </el-form-item>

      <el-form-item>
        <el-table
            :data="tableData"
            height="400px" border
            style="width: 250px"
        >
          <el-table-column
              prop="tableName"
              label="Table名稱"
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