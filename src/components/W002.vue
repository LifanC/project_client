<script setup>

import axios from "axios";
import {toFindCookie} from "@/components/componentsJs/cookie";
import {dateConversionYMDhms} from "@/components/componentsJs/ConvertPadding";

axios.defaults.baseURL = 'http://localhost:8080'
const frontEnd = 'http://localhost:5173'
const path = window.location.pathname + '/'
const W002 = ref('')

goW002()

async function goW002() {
  try {
    const response = await axios.get(path + goW002.name)
    W002.value = response.data
  } catch (error) {
    console.error('goW002 Error:', error);
  }
}

const fromData = reactive({
  id: '',
  f_name: '',
  number: '',
  a_value: '',
  b_value: '',
  // 分類
  c_value: '',
  // Ex
  d_value: '',
  // 備註
  e_value: '',
  // 數量
  f_value: '',
  // 金額
  g_value: '',
  new_date: new Date(),
})

const permissions_tf = ref(true)

if (toFindCookie() === undefined) {
  location.href = frontEnd
} else {
  fromData.a_value = toFindCookie().substring(0, 3)
  fromData.b_value = (dateConversionYMDhms(false)
      .replace(/\D/g, '')
      .substring(8, 0)) + '000001'
  fromData.f_name = toFindCookie().substring(0, 1)
  fromData.number = toFindCookie().substring(1, 3)
  let tempPermissions = toFindCookie().substring(3, 4)
  switch (tempPermissions) {
    case 'A':
      permissions_tf.value = true
      break
    case 'B':
      permissions_tf.value = false
      break
    default :
      permissions_tf.value = false
      break
  }
  W002UrlDefault()
}

const all_totle_w001_exp = ref(0)
const all_totle_w001_inc = ref(0)
const tableW0012 = ref([]);
const W001_table_column2 = ref([
  {'new_date_Format': '日期'},
  {'expense': '支出'},
  {'income': '收入'},
  {'totle_money': '總金額'}
])
const all_totle_w002 = ref(0)

function W002UrlDefault() {
  axios.get(path + W002UrlDefault.name, {
    params: {
      f_name: fromData.f_name,
      number: fromData.number
    }
  })
      .then((response) => {
        tableW002.value = response.data[0]
        all_totle_w002.value = 0
        for (let num in tableW002.value) {
          all_totle_w002.value += +tableW002.value[num].total
        }
      })
      .catch(error => {
        console.error('W002UrlDefault Error:', error);
      });
  axios.get('/W001/W001UrlDefault', {
    params: {
      f_name: fromData.f_name,
      number: fromData.number
    }
  })
      .then((response) => {
        tableW0012.value = response.data[1]
        all_totle_w001_exp.value = 0
        all_totle_w001_inc.value = 0
        for (let num in tableW0012.value) {
          all_totle_w001_exp.value += +tableW0012.value[num].expense
          all_totle_w001_inc.value += +tableW0012.value[num].income
        }
      })
      .catch(error => {
        console.error('W001UrlDefault Error:', error);
      });
}

const typeSelects = ref([
  {label: '固定', value: 'A'},
  {label: '消耗', value: 'B'},
  {label: '其他', value: 'C'}
])
const productCategory = ref('')

const selectProductCategory = (selectValue) => {
  fromData.c_value = selectValue || typeSelects.value[typeSelects.value.length - 1].value
  productCategory.value = fromData.c_value
}

const tableW002 = ref([])
const W002_table_column = ref([
  {'m_code': '編號'},
  {'remark': '備註'},
  {'quantity': '數量'},
  {'amount': '金額'},
  {'total': '總金額'},
  {'new_date_Format': '日期'}
])

const h_totle = ref('')
const calc = () => {
  fromData.f_value = Math.max(+fromData.f_value, 0) || ''
  fromData.g_value = Math.max(+fromData.g_value, 0) || ''
  h_totle.value = fromData.f_value && fromData.g_value ? String(fromData.f_value * fromData.g_value) : ''
}

const modifyTF = ref(true)
const hint = ref('')
const W002Url = (restfulApi_type) => {
  hint.value = ''
  if (fromData.new_date === null) {
    fromData.new_date = new Date()
  }
  if (restfulApi_type !== 'Query') {
    let patternNum = /^\d+$/
    if ([
      fromData.c_value,
      fromData.d_value,
      fromData.e_value,
      fromData.f_value,
      fromData.g_value
    ].some(value => value === '')) {
      return
    }
    if (!patternNum.test(fromData.d_value)) return
  }
  switch (restfulApi_type) {
    case 'Add' :
      axios.post(path + goW002.name + 'Search', {
        GoW002: fromData
      })
          .then((response) => {
            if (response.data) {
              hint.value = 'Success'
              axios.post(path + goW002.name + restfulApi_type, {
                GoW002: fromData
              })
                  .then((response) => {
                    tableW002.value = response.data[0]
                    reductionFromData()
                    h_totle.value = ''
                    productCategory.value = ''
                    all_totle_w002.value = 0
                    productCategory.value = ''
                    for (let num in tableW002.value) {
                      all_totle_w002.value += +tableW002.value[num].total
                    }
                  })
                  .catch(error => {
                    console.error('Add Error:', error);
                  });
            } else {
              hint.value = '編號重複，請換其他編號'
            }
          })

      break
    case 'Modify' :
      axios.put(path + goW002.name + restfulApi_type, {
        GoW002: fromData
      })
          .then((response) => {
            tableW002.value = response.data[0]
            reductionFromData()
            h_totle.value = ''
            all_totle_w002.value = 0
            productCategory.value = ''
            for (let num in tableW002.value) {
              all_totle_w002.value += +tableW002.value[num].total
            }
          })
          .catch(error => {
            console.error('Modify Error:', error);
          });
      break
    case 'Query' :
      axios.post(path + goW002.name + restfulApi_type, {
        GoW002: fromData
      })
          .then((response) => {
            tableW002.value = response.data[0]
            reductionFromData()
            h_totle.value = ''
            productCategory.value = ''
            all_totle_w002.value = 0
            productCategory.value = ''
            for (let num in tableW002.value) {
              all_totle_w002.value += +tableW002.value[num].total
            }
          })
          .catch(error => {
            console.error('Add Error:', error);
          });
      break
  }
}

const modify = (row) => {
  let {id, m_code, remark, quantity, amount, new_date} = row
  let [a_value, b_value, c_value, d_value] = [
    m_code.substring(0, 3),
    m_code.substring(3, 17),
    m_code.substring(17, 18),
    m_code.substring(18, 21)
  ];
  modifyTF.value = false;
  fromData.id = String(id);
  fromData.a_value = a_value
  fromData.b_value = b_value
  fromData.c_value = c_value
  fromData.d_value = d_value
  fromData.e_value = remark
  fromData.f_value = quantity
  fromData.g_value = amount
  h_totle.value = String(quantity * amount)
  productCategory.value = c_value;
  fromData.new_date = new_date
}


const confirmEventDelete = (row) => {
  axios.delete(path + confirmEventDelete.name, {
    params: {
      id: row.id,
      f_name: row.m_code.substring(0, 1),
      number: row.m_code.substring(1, 3)
    }
  })
      .then((response) => {
        tableW002.value = response.data[0]
        reductionFromData()
        h_totle.value = ''
        all_totle_w002.value = 0
        productCategory.value = ''
        for (let num in tableW002.value) {
          all_totle_w002.value += +tableW002.value[num].total
        }
      })
      .catch(error => {
        console.error('confirmEventDelete Error:', error);
      });
}

const reductionFromData = () => {
  let fieldsToReset = ['c_value', 'd_value', 'e_value', 'f_value', 'g_value'];
  for (let field of fieldsToReset) {
    fromData[field] = '';
  }
}

</script>

<template>
  <el-container>
    <el-header>{{ W002 }}</el-header>
    <el-container>
      <el-aside width="330px">
        <el-text type="danger" v-if="all_totle_w001_inc - all_totle_w001_exp - all_totle_w002 < 0">
          <b>目前總支出已超過總收入，請注意!!</b>&emsp;
          {{ all_totle_w001_inc - all_totle_w001_exp - all_totle_w002 }}
        </el-text>
        <el-text><p>範例 : L0720240218000001A001</p></el-text>
        <el-form v-model="fromData" :disabled="permissions_tf">
          <el-form-item>
            <el-select
                v-model="productCategory"
                filterable
                placeholder="分類"
                clearable
                style="width: 330px"
                @change="selectProductCategory"
            >
              <el-option v-for="typeSelect in typeSelects"
                         :key="typeSelect.value"
                         :label="typeSelect.label"
                         :value="typeSelect.value"
              />
            </el-select>
            <el-input
                style="width: 50px"
                readonly
                maxlength="1"
                v-model="fromData.a_value"
                disabled
            />
            <el-input
                style="width: 155px"
                readonly
                maxlength="14"
                v-model="fromData.b_value"
                disabled
            />
            <el-input
                style="width: 35px"
                readonly
                maxlength="1"
                v-model="fromData.c_value"
                disabled
            />
            <el-input
                style="width: 90px"
                maxlength="3"
                v-model="fromData.d_value"
                placeholder="Ex : 001"
            />
            <el-input
                style="width: 335px"
                :rows="2"
                type="textarea"
                placeholder="備註"
                v-model="fromData.e_value"
            />
            <el-input
                style="width: 120px"
                type="number"
                placeholder="數量"
                v-model.number="fromData.f_value"
                @input="calc"
            />
            <el-input
                style="width: 210px"
                type="number"
                placeholder="金額"
                v-model.number="fromData.g_value"
                @input="calc"
            />
            <el-input
                style="width: 330px"
                readonly
                disabled
                type="number"
                placeholder="總金額"
                :value="h_totle"
            />
            <el-date-picker
                v-model="fromData.new_date"
                type="date"
                style="width: 330px"
            />
            <el-button-group>
              <el-button
                  style="width: 110px"
                  @click="W002Url('Add')"
              >新增
              </el-button>
              <el-button
                  :disabled="modifyTF"
                  style="width: 110px"
                  @click="W002Url('Modify')"
              >修改
              </el-button>
              <el-button
                  style="width: 110px"
                  @click="W002Url('Query')"
              >查詢
              </el-button>
            </el-button-group>
            <el-text>{{ hint }}</el-text>
          </el-form-item>
        </el-form>
      </el-aside>
      <el-main>
        <el-row>
          <el-table
              :data="tableW002"
              border
              height="250px"
              style="width: 1300px"
              empty-text="無資料"
              show-summary="show-summary"
              sum-text="支出合計"
          >
            <el-table-column
                label="功能"
                width="150%"
            >
              <template #default="scope">
                <el-button-group>
                  <el-button
                      :disabled="permissions_tf"
                      @click.prevent="modify(scope.row)"
                  >修改
                  </el-button>
                  <el-popconfirm
                      width="220"
                      confirm-button-text="確定"
                      cancel-button-text="取消"
                      title="確定要刪除嗎?"
                      @confirm="confirmEventDelete(scope.row)"
                  >
                    <template #reference>
                      <el-button
                          :disabled="permissions_tf"
                      >刪除
                      </el-button>
                    </template>
                  </el-popconfirm>
                </el-button-group>
              </template>
            </el-table-column>
            <el-table-column
                v-for="i in W002_table_column"
                :label="i[Object.keys(i)[0]].toString()"
                :prop="Object.keys(i).toString()"
            />
          </el-table>
        </el-row>
        <el-row>
          <el-table
              :data="tableW0012"
              height="250px" border
              style="width: 1000px"
              empty-text="無資料"
              show-summary
              sum-text="合計"
          >
            <el-table-column
                v-for="i in W001_table_column2"
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