<script setup>

import axios from "axios";
import {toFindCookie} from "@/components/componentsJs/cookie";

axios.defaults.baseURL = 'http://localhost:8080'
const frontEnd = 'http://localhost:5173'
const path = window.location.pathname + '/'
const W005 = ref('')

goW005()

async function goW005() {
  try {
    const response = await axios.get(path + goW005.name)
    W005.value = response.data
  } catch (error) {
    console.error('goW005 Error:', error);
  }
}

const fromData = reactive({
  f_name: '',
  number: '',
})

const permissions_tf = ref(true)
const checkList = ref([])
const checkList2 = ref('any')

if (toFindCookie() === undefined) {
  location.href = frontEnd
} else {
  fromData.f_name = toFindCookie().substring(0, 1)
  fromData.number = toFindCookie().substring(1, 3)
  let tempPermissions = toFindCookie().substring(3, 4)
  permissions_tf.value = tempPermissions === 'A';
}

const amountCalc = () => {
  fromData.amount = Math.max(1, Math.min(fromData.amount, 10))
}

const url = ref('https://v2.jokeapi.dev/joke/Any')
const url2 = ref('')
const apiUrl = (val) => {
  url.value = 'https://v2.jokeapi.dev/joke/' +
      (val.length === 0 ? 'Any' : val.filter(item => item !== 'Any').join() || 'Any');
}

const category = ref()
const lang = ref()
const amount = ref(1)
const joke = ref([])
const setup_delivery = ref([])
const URL = ref('')
const apiUrlSelect = async () => {
  joke.value = [];
  setup_delivery.value = [];
  url2.value = (checkList2.value === 'any') ? '' : '?type=' + checkList2.value;
  let amountLink = (url2.value === '') ? '?amount=' : '&amount=';
  let urlApi = (amount.value === 1) ?
      url.value + url2.value : url.value + url2.value + amountLink + amount.value
  URL.value = urlApi;
  try {
    const response = await axios.get(urlApi);
    const data = response.data;
    const updateValues = (type, i, setup, delivery, single) => {
      if (type === 'single') {
        joke.value.push({label: `(${i})`, value: single});
      } else {
        setup_delivery.value.push({label: `(${i})`, value: setup});
        setup_delivery.value.push({label: '', value: delivery});
      }
    };

    if (amount.value === 1) {
      amount.value = 1;
      category.value = data.category;
      lang.value = data.lang;
      updateValues(data.type, 1, data.setup, data.delivery, data.joke);
    } else {
      const categorys = new Set();
      const langs = new Set();

      let singleCount = 0;
      let twopartCount = 0;
      data.jokes.forEach((joke, index) => {
        categorys.add(joke.category);
        langs.add(joke.lang);
        if (joke.type === 'single') {
          singleCount++;
          updateValues(joke.type, singleCount, joke.setup, joke.delivery, joke.joke);
        } else {
          twopartCount++;
          updateValues(joke.type, twopartCount, joke.setup, joke.delivery, joke.joke);
        }
      });

      category.value = Array.from(categorys).join('、');
      lang.value = Array.from(langs).join('、');
    }
  } catch (error) {
    console.error('apiUrl Error:', error);
  }
}

</script>

<template>
  <el-container>
    <el-header>{{ W005 }}</el-header>
    <el-container>
      <el-main>
        <el-row>
          <el-text>數量 :&emsp;</el-text>
          <el-input
              style="width: 80px"
              type="number"
              :min="1"
              :max="10"
              v-model.number="amount"
              @input="amountCalc()"
          />
          <el-checkbox-group
              v-model="checkList"
              @change="apiUrl"
          >
            <el-checkbox-button label="Programming" value="Programming" border/>
            <el-checkbox-button label="Miscellaneous" value="Miscellaneous" border/>
            <el-checkbox-button label="Dark" value="Dark" border/>
            <el-checkbox-button label="Pun" value="Pun" border/>
            <el-checkbox-button label="Spooky" value="Spooky" border/>
            <el-checkbox-button label="Christmas" value="Christmas" border/>
          </el-checkbox-group>
        </el-row>
        <el-row>
          <el-radio-group v-model="checkList2">
            <el-radio-button label="any" value="any" />
            <el-radio-button label="single" value="single" />
            <el-radio-button label="twopart" value="twopart" />
          </el-radio-group>
        </el-row>
        {{ URL }}
        <br>
        <el-button @click="apiUrlSelect">查詢</el-button>
        <el-text><p>類別：{{ category }}</p></el-text>
        <el-text><p>語言：{{ lang }}</p></el-text>
        <el-text><p>數量：{{ amount }}</p></el-text>
        <h4>笑話</h4>
        <p v-for="j in joke">{{ j.label }}&emsp;{{ j.value }}</p>
        <p v-for="sd in setup_delivery">{{ sd.label }}&emsp;{{ sd.value }}</p>
      </el-main>
    </el-container>
  </el-container>

</template>

<style scoped>

</style>