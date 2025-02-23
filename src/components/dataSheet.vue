<script setup>
import axios from 'axios'
import { ref,reactive } from 'vue'
import dayjs from 'dayjs'

/*取得後端資料*/
const arrayData = ref([])
const errorMessage = ref("");
const getData = async()=>{
  try{
    const {data} = await axios.get('http://nexifytw.mynetgear.com:45000/api/Record/GetRecords')
    const dayJsData =data.Data.map(item =>({
      ...item,
      DateOfBirth:dayjs(item.DateOfBirth).format('YYYY-MM-DD')
    }))
    arrayData.value = dayJsData
  }catch(error){
    console.log('取得資料時發生錯誤',error);
    errorMessage.value = "取得資料時發生錯誤，請稍後再試";
    
  }
}
/*資料輸入區*/
const defaultDate = ref([]) //空陣列存放tempData
const tempData = ({
  Name:'',
  DateOfBirth:'',
  Salary:50000,
  Address:'',
})

const addData = ()=>{
  if(arrayData.value.length == 0){
    errorMessage.value = '請先撈取資料'
  }else{
    errorMessage.value =''
    defaultDate.value.push(JSON.parse(JSON.stringify(tempData)))
  }
  }
/*上傳新資料*/
const updataFn = async()=>{
  try {
    for(let item of defaultDate.value){
    if(item.Name !== '' && item.Address !== ''){
      errorMessage.value=''
      arrayData.value = arrayData.value.concat(JSON.parse(JSON.stringify(defaultDate.value)))
      defaultDate.value = []
      console.log(arrayData.value);
    }else{
      errorMessage.value = '請填完所有資料'
    }
    await axios.post('http://nexifytw.mynetgear.com:45000/api/Record/SaveRecords',arrayData.value)
    getData()
  }
  } catch (error) {
    console.error('資料儲存失敗', error);
    errorMessage.value = "資料儲存失敗，請稍後再試。";
  }
}
</script>
<template>
  <div class="flex justify-center items-center bg-gray-400 h-screen sm:px-0 px-4">
    <div class="w-full sm:w-[60%] min-h-[50%] sm:p-8 p-4 sm:mx-0 rounded-2xl bg-white">
      <div class="flex justify-between mb-4 overflow-auto">
        <button class="px-4 py-2 rounded-sm bg-blue-700 hover:bg-blue-800 active:bg-blue-700 text-white" @click="addData">Add</button>
        <button class="px-4 py-2 rounded-sm bg-green-700 hover:bg-green-800 active:bg-green-900 text-white" @click="updataFn">Save</button>
        <button class="px-4 py-2 rounded-sm bg-red-700 hover:bg-red-800 active:bg-red-900 text-white" @click="getData">Update</button>
      </div>
      <div class="overflow-auto">
        <table class="text-left w-full">
        <thead class="border-b border-b-gray-300 font-extrabold text-gray-600">
          <tr>
            <th class="pb-2 pl-2 w-1/4">Name</th>
            <th class="pb-2 pl-2 w-1/4">Birthday</th>
            <th class="pb-2 pl-2 w-1/4">Salary</th>
            <th class="pb-2 pl-2 w-1/4">Address</th>
          </tr>
        </thead>
        <tbody>
          <tr  class="border-b border-b-gray-300" v-for="(item,index) in defaultDate" :key="index">
            <td class="w-1/4"><input class="border my-1 w-36 pl-2 ml-2" type="text" v-model.trim="item.Name"></td>
            <td class="w-1/4"><input class="border my-1 w-36 ml-2" type="date" v-model="item.DateOfBirth"></td>
            <td class="w-1/4">
              <input type="range" min="0" max="100000" value="50000" v-model.number="item.Salary">
            </td>
            <td class="w-1/4"> <input class="border my-1 pl-2 ml-2" type="text" v-model.trim="item.Address"></td>
          </tr>
          <tr class="border-b border-b-gray-300" v-for="(item,index) in arrayData" :key="index">
            <td class="w-1/4"><input class="border my-1 w-36 pl-2 ml-2" type="text" v-model.trim="item.Name"></td>
            <td class="w-1/4"><input class="border my-1 w-36 ml-2" type="date" v-model="item.DateOfBirth"></td>
            <td class="w-1/4">
              <input type="range" min="0" max="100000" v-model.number="item.Salary">
            </td>
            <td class="w-1/4"><input class="border my-1 pl-2 ml-2" type="text" v-model.trim="item.Address"></td>
          </tr>
        </tbody>
      </table>
      </div>
      <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<style scoped>
</style>
