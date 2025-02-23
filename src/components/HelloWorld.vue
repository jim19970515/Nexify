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
const temp = ref(false)
const tempData = reactive({
  Name:'',
  DateOfBirth:'2022-03-30',
  Salary:null,
  Address:'',
})

/*儲存新資料 上傳新資料*/
const updateData = ref([])
const addData = () =>{
  if(!tempData.Name || tempData.DateOfBirth == '2022-03-30' || !tempData.Salary || !tempData.Address){
    errorMessage.value = '請填完所有資料'
  }else{
    errorMessage.value =''
    updateData.value = JSON.parse(JSON.stringify(arrayData.value));
    updateData.value.push({...tempData})
    updateFn()
    tempData.Name = '';
    tempData.DateOfBirth = '2022-03-30';
    tempData.Salary = null;
    tempData.Address = '';
  }
}   
/*上傳新資料*/
const updateFn = async()=>{
  try {
    await axios.post('http://nexifytw.mynetgear.com:45000/api/Record/SaveRecord',updateData.value)
    getData()
  } catch (error) {
    console.error('資料儲存失敗', error);
    errorMessage.value = "資料儲存失敗，請稍後再試。";
  }
}
</script>
<template>
  <div class="flex justify-center items-center bg-gray-400 h-screen sm:px-0 px-4">
    <div class="w-full sm:w-[60%] sm:p-8 p-4 sm:mx-0 rounded-2xl bg-white">
      <div class="flex justify-between mb-4">
        <button class="px-4 py-2 rounded-sm bg-blue-700 hover:bg-blue-800 active:bg-blue-700 text-white" @click="temp=!temp">Add</button>
        <button class="px-4 py-2 rounded-sm bg-green-700 hover:bg-green-800 active:bg-green-900 text-white" @click="addData">Save</button>
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
          <tr v-if="temp" class="border-b border-b-gray-300">
            <td class="w-1/4"><input class="border my-1 w-36 pl-2 ml-2" type="text" v-model.trim="tempData.Name"></td>
            <td class="w-1/4"><input class="border my-1 w-36 ml-2" type="date" value="2022-03-30" v-model="tempData.DateOfBirth"></td>
            <td class="w-1/4">
              <input type="range" min="0" max="100000" value="50000" v-model.number="tempData.Salary">
            </td>
            <td class="w-1/4"> <input class="border my-1 pl-2 ml-2" type="text" v-model.trim="tempData.Address"></td>
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
