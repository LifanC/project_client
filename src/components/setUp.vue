<script setup>

import {getApi, postApi} from "@/components/js/api";
import PubSub from "pubsub-js";
import {toFindCookie, clearCookie} from "@/components/js/cookie";

const tableData = ref([])
const tableCsvData = ref([])
const tableDataList = ref([])

const csv = ref()

const csvTF = ref()
const selectCsv = ref('')
const selectCsvData = ref([])
const userNameValue = ref()

userNameValue.value = toFindCookie()

function getCsv() {
  getApi('http://localhost:8080/setUp/readCsv')
      .then((result) => {
        selectCsv.value = result[0]
        selectCsvData.value = result
      })
}

const csvCount = ref(0)
const newtableCsvData = ref([])

function getCsvData() {
  if (selectCsv.value !== '') {
    postApi('http://localhost:8080/setUp/readCsvData', selectCsv.value)
        .then((result) => {
          newtableCsvData.value = []
          if (result[0] === 'error') {
            csv.value = result[1]
            tableCsvData.value = []
            csvTF.value = false
          } else {
            csv.value = '成功載入文件 (UTF-8)'
            tableCsvData.value = result[0]
            csvTF.value = true
            tableCsvData.value.forEach((e) => {
              let newObject = {};
              newObject[0] = '';
              for (let key in e) {
                if (e.hasOwnProperty(key)) {
                  newObject[parseInt(key) + 1] = e[key];
                }
              }
              newtableCsvData.value.push(newObject)
            })
            let count = 0
            for (let key in newtableCsvData.value[0]) {
              count++
            }
            csvCount.value = count - 1
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
  if ('文件上傳成功' === response) {
    type.value = 'success'
  } else {
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
    <el-container>
      <el-aside width="200px">
        <div style="height: 300px;padding-top: 50px">
          <el-steps direction="vertical" :active="1">
            <el-step title="Step 1" description="查詢csv資料"/>
            <el-step title="Step 2" description="可以上傳文件"/>
            <el-step title="Step 3" description=""/>
          </el-steps>
        </div>
      </el-aside>
      <el-main>
        <el-row>
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
          </el-form-item>
          &emsp;
          <el-form-item>
            <el-space wrap>
              <el-card shadow="always">
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
              </el-card>
            </el-space>
          </el-form-item>
        </el-row>
        <el-form-item>
          <el-text v-if="csvTF" type="warning">{{ csv }}</el-text>
          <el-text v-else type="danger">{{ csv }}</el-text>
        </el-form-item>
        <el-form-item>
          <el-table
              :data="newtableCsvData"
              height="400px" border
              style="width: 1000px"
          >
            <el-table-column
                v-for="i in csvCount"
                :label="`(${i})`.toString()"
                :prop="i.toString()"
            />
          </el-table>
        </el-form-item>
      </el-main>
    </el-container>
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