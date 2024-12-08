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

const typeFromData = reactive({
  accountNumber: '',
  typeName: '',
})

const formRef = ref(null)
const fromDataW001 = reactive({
  accountNumber: '',
  password: '',
  money: '',
  type: '',
  number: '',
  update_date: '',
})

if (toFindCookie() === undefined) {
  location.href = frontEnd
} else {
  let findCookie = toFindCookie().split('|')
  fromData.accountNumber = findCookie[0]
  fromData.password = findCookie[1]
  fromDataW001.accountNumber = findCookie[0]
  fromDataW001.password = findCookie[1]
  typeFromData.accountNumber = findCookie[0]
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

const typeFormRef = ref(null)
const typeRules = computed(() => {
  return {
    typeName: [{required: true, message: '必填'},]
  };
});

const tableTypeW001 = ref([])
const w001TableTypeColumn = ref([
  {'typeNameNumber': '編號'},
  {'typeName': '名稱'}
])

const typeMethod = (val, formEl) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      switch (val) {
        case 1:
          try {
            const response = await axios({
              method: 'post',
              url: path + typeMethod.name + val,
              data: typeFromData,
            });
            let data = response.data
            tableTypeW001.value = data[0]
          } catch (error) {
            console.error(val, typeMethod.name + val + ' Error:', error.response.data)
          }
          break
        case 2:
          try {
            const response = await axios({
              method: 'post',
              url: path + typeMethod.name + val,
              data: typeFromData,
            });
            let data = response.data
            tableTypeW001.value = data[0]
          } catch (error) {
            console.error(val, typeMethod.name + val + ' Error:', error.response.data)
          }
          break
      }
    } else {
      try {
        const response = await axios({
          method: 'post',
          url: path + typeMethod.name,
          data: typeFromData,
        });
        let data = response.data
        tableTypeW001.value = data[0]
      } catch (error) {
        console.error(val, 'typeMethod Error:', error.response.data)
      }
    }
  })
}

const removeTrim = () => {
  if (!/^[a-zA-Z0-9\u4e00-\u9fa5]*$/.test(typeFromData.typeName)) {
    typeFromData.typeName = typeFromData.typeName.slice(0, -1)
  }
}

const eventDeleteType = async (val) => {
  ElMessageBox.confirm(
      '<b>確定要刪除</b>' +
      '<br>編號:&ensp;' + val.typeNameNumber + '&ensp;' + val.typeName +
      '<br>此分類與所有數據嗎？',
      '刪除',
      {
        confirmButtonText: '刪除',
        cancelButtonText: '取消',
        type: 'error',
        dangerouslyUseHTMLString: true,
      }
  )
      .then(async () => {
        typeFromData.typeName = val.typeName
        try {
          const response = await axios({
            method: 'post',
            url: path + eventDeleteType.name,
            data: typeFromData,
          });
          let data = response.data
          tableTypeW001.value = data[0]
          tableW001.value = data[1]
          fromDataW001.type = ''
        } catch (error) {
          console.error(val, 'eventDeleteType Error:', error.response.data)
        }
      })
      .catch(() => {
      })
}

const resetFormType = (formEl) => {
  tableTypeW001.value = []
  if (!formEl) return
  formEl.resetFields()
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
    money: [{required: true, message: '金額必填'}, {type: 'number', message: '金額必填是數字'},]
  };
});

const typePlaceholder = ref(' ')

const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      if (!fromDataW001.update_date) {
        fromDataW001.update_date = new Date();
      }
      if (fromDataW001.type === ''
          || fromDataW001.type === undefined
          || fromDataW001.type === null) {
        typePlaceholder.value = '未選擇'
        return
      }
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
              dangerouslyUseHTMLString: true
            }
        )
            .then(async () => {
              try {
                const response = await axios({
                  method: 'post',
                  url: path + submitForm.name + "Ok",
                  data: fromDataW001,
                });
                let data = response.data
                textOnly.value = data[0].body
                tableW001.value = data[1]
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
  tableW001.value = []
  fromDataW001.update_date = '';
  textOnly.value = ''
  typePlaceholder.value = ' '
  if (!formEl) return
  formEl.resetFields()
}

const options = ref([])

async function w001type() {
  options.value = []
  try {
    const response = await axios({
      method: 'post',
      url: path + w001type.name,
      data: typeFromData,
    });
    let data = response.data
    for (let i = 0; i < data.length; i++) {
      options.value.push(
          {value: response.data[i].typeNameNumber, label: response.data[i].typeName}
      )
    }
  } catch (error) {
    console.error('w001type Error:', error)
  }
}

const tableW001 = ref([]);
const w001TableColumn = ref([
  {'number': '編號'},
  {'money': '金額'},
  {'type': '類別'},
  {'typeName': '類別名稱'},
  {'update_date': '日期'}
])
const queryForm = (formEl) => {
  typePlaceholder.value = ' '
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
        console.error('queryForm Error:', error)
      }
    } else {
      fromDataW001.money = 1
    }
  });
}

const modify = (val) => {
  ElMessageBox.confirm(
      '編號:' + val.number + '<br>金額:' + val.money + '<br>類別:' + val.typeName
      + '<br><label>修改金額</label><input type="number" id="exMoney" value=1 min="1"/>',
      '更新',
      {
        confirmButtonText: '更新',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true,
      }
  )
      .then(async () => {
        let element = document.querySelector("#exMoney");
        if (element.value) {
          if (element.value < 1) {
            element.value = 1
          }
        } else {
          element.value = 1
        }
        let fromW001 = {
          'accountNumber' : fromDataW001.accountNumber,
          'password' : fromDataW001.password,
          'money' : Number(element.value),
          'number' : val.number,
          'type' : val.type,
        }
        try {
          const response = await axios({
            method: 'post',
            url: path + modify.name,
            data: fromW001,
          });
          tableW001.value = response.data[0]
        } catch (error) {
          console.error('modify Error:', error)
        }
      })
      .catch(() => {
      })
}

const eventDelete = (val) => {
  ElMessageBox.confirm(
      '編號:' + val.number + '<br>金額:' + val.money + '<br>類別:' + val.typeName,
      '刪除',
      {
        confirmButtonText: '刪除',
        cancelButtonText: '取消',
        type: 'error',
        dangerouslyUseHTMLString: true,
      }
  )
      .then(async () => {
        let fromW001 = {
          'accountNumber' : fromDataW001.accountNumber,
          'password' : fromDataW001.password,
          'number' : val.number,
          'type' : val.type,
          'money' : val.money,
        }
        try {
          const response = await axios({
            method: 'post',
            url: path + eventDelete.name,
            data: fromW001,
          });
          tableW001.value = response.data[0]
        } catch (error) {
          console.error('eventDelete Error:', error)
        }
      })
      .catch(() => {
      })
}

</script>

<template>
  <el-container>
    <el-header>{{ W001 }}</el-header>
    <el-container>
      <el-aside width="300px">
        <el-form
            ref="typeFormRef"
            style="max-width: 500px"
            :model="typeFromData"
            :rules="typeRules"
            label-width="auto"
        >
          <el-form-item
              label="種類"
              prop="typeName"
          >
            <el-input
                v-model="typeFromData.typeName"
                placeholder=" "
                filterable
                clearable
                @input="removeTrim"
            />
          </el-form-item>
        </el-form>
        <el-button-group>
          <el-button text @click="typeMethod(1, typeFormRef)">新增</el-button>
          <el-button text @click="typeMethod(2, typeFormRef)">查詢</el-button>
          <el-button text @click="resetFormType(typeFormRef)">清除</el-button>
        </el-button-group>
        <el-table
            :data="tableTypeW001"
            border
            style="width: 500px; height: 770px;"
            empty-text="無資料"
        >
          <el-table-column
              label="功能"
              width="100%"
          >
            <template #default="scope">
              <el-button-group>
                <el-button
                    @click.prevent="eventDeleteType(scope.row)"
                >刪除
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
          <el-table-column
              v-for="i in w001TableTypeColumn"
              :label="i[Object.keys(i)[0]].toString()"
              :prop="Object.keys(i).toString()"
          />
        </el-table>
      </el-aside>
      <el-main>
        <el-row>
          <el-upload
              v-model:file-list="fileList"
              :before-remove="beforeRemove"
              :limit="1"
              :auto-upload="false"
          >
            <template #trigger>
              <el-button
                  plain
                  style="width: 150px"
                  type="primary"
              >選擇資料
              </el-button>
            </template>
            <template #tip>
              <br>
              <el-text>限制1個文件</el-text>
            </template>
          </el-upload>
          <el-button
              plain
              style="width: 100px"
              type="success"
              @click="submitUpload"
          >
            批次新增
          </el-button>
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
                  :placeholder="typePlaceholder"
                  style="width: 240px"
                  filterable
                  clearable
                  @click="w001type"
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
            <el-form-item>
              <el-date-picker
                  v-model="fromDataW001.update_date"
                  type="date"
              />
            </el-form-item>
            <el-text>{{ textQuery }}</el-text>
            <el-form-item>
              <el-button-group>
                <el-button
                    plain
                    type="primary"
                    @click="submitForm(formRef)"
                >新增
                </el-button>
                <el-button
                    plain
                    type="success"
                    @click="queryForm(formRef)"
                >查詢
                </el-button>
                <el-button
                    plain
                    type="warning"
                    @click="resetForm(formRef)"
                >清除
                </el-button>
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
          >
            <el-table-column
                label="功能"
                width="150%"
            >
              <template #default="scope">
                <el-button-group>
                  <el-button
                      @click.prevent="modify(scope.row)"
                  >更新
                  </el-button>
                  <el-button
                      @click.prevent="eventDelete(scope.row)"
                  >刪除
                  </el-button>
                </el-button-group>
              </template>
            </el-table-column>
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
