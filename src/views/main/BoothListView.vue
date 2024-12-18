<template>
    <div class="select">

    <el-form :model="queryParams" ref="queryForm" label-width="120px">

      <!-- 摊位名称, 位置, 品牌类型 水平排列 -->
      <el-row>
        <el-col :span="5">
          <el-form-item label="摊位名称">
            <el-input v-model="queryParams.boothName" placeholder="请输入摊位名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="位置">
            <el-input v-model="queryParams.location" placeholder="请输入位置"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="品牌类型">
            <el-select
            clearable
      v-model="queryParams.brandType"
      placeholder="Select"
      size="large"
      style="width: 240px"
    >
      <el-option
        v-for="type in types"
        :key="type.id"
        :label="type.brandTypeName"
        :value="type.id"
      />
    </el-select>
          </el-form-item>
        </el-col>
      </el-row>


    <el-row :gutter="1">
      <!-- 价格范围 水平排列 -->
      <el-form-item  label="价格范围">

          <el-col :span="9">
            <el-input-number v-model="queryParams.minPrice" :min="0" placeholder="最小价格" style="width: 100%"></el-input-number>
          </el-col>
          <el-col  :span="1" ></el-col> <!-- 给两个输入框之间留个间隔 -->
          <el-col :span="9">
            <el-input-number v-model="queryParams.maxPrice" :min="queryParams.MinPrice" placeholder="最大价格" style="width: 100%"></el-input-number>
          </el-col>

      </el-form-item>

      <!-- 租赁起始和结束日期 水平排列 -->
      <el-form-item  label="租赁日期">

          <el-col  :span="9">
            <el-date-picker
              v-model="queryParams.rentalStartDate"
              type="date"
              placeholder="起始日期"
              style="width: 100%">
            </el-date-picker>
          </el-col>
          <el-col :span="1"></el-col> <!-- 给两个日期选择器之间留个间隔 -->
          <el-col :span="9">
            <el-date-picker
              v-model="queryParams.rentalEndDate"
              type="date"
              placeholder="结束日期"
              style="width: 100%">
            </el-date-picker>
          </el-col>

      </el-form-item>
    </el-row>

<el-row>
      <!-- 排序 -->
      <el-form-item label="排序">
        <el-checkbox v-model="queryParams.isDesc">降序</el-checkbox>
      </el-form-item>
  <!-- 是否可用 -->
  <el-form-item label="只看可用">
        <el-switch v-model="queryParams.isAvailable"></el-switch>
      </el-form-item>

    </el-row>
      <!-- 提交按钮 -->
      <el-form-item>
        <el-button type="primary" @click="getBooths">查询</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>

    </div>
    <div class="booth-container">
    <!-- 空状态 -->
    <el-empty v-if="booths.length === 0" description="暂无数据" />
    <!-- 卡片展示 -->
    <div v-else class="booth-grid">
      <el-card
        v-for="booth in booths"
        :key="booth.id"
        class="booth-card"
        :style="{ borderColor: booth.themeColor || '#ddd' }"
        @click="boothDetails(booth)">
    <!-- Card Image -->
    <div class="booth-image">
        <img :src="booth.photo || booth.mediaUrl" :alt="booth.boothName" class="booth-photo" />
      </div>

      <!-- Card Body -->
      <div class="booth-body">
        <h3 class="booth-name">{{ booth.boothName }}</h3>
        <p class="booth-description">{{ booth.description }}</p>
        <div class="booth-details">
          <span class="booth-price">{{ booth.dailyRate }}每日</span>
          <span class="booth-location">{{ booth.location }}</span>
        </div>
        <span class="booth-location">{{ booth.availableDate }}</span>

        <!-- Learn More Link -->
      </div>
      </el-card>
    </div>
    <div style="display: flex;justify-content: center;"   >
      <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize"
            layout="  prev, pager, next,total" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />


  </div>
  </div>
  </template>


  <script setup>
import { BoothGetService, TypeGetService } from '@/api/booth';
import router from '@/router';
import { onMounted, ref } from 'vue';

  //分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(105)//总条数
const pageSize = ref(12)//每页条数
const booths = ref([{}])
const types= ref([])
const queryParams =ref({
        boothName: '',
        location: '',
        brandType: '',
        isAvailable: false,
        isDesc: false,
        minPrice: null,
        maxPrice: null,
        rentalStartDate: null,
        rentalEndDate: null,


    })



const onSizeChange = (size) => {
    pageSize.value = size
    getBooths()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
    getBooths()
}
 const getBooths= async()=>{
  let params = {
        pageIndex: pageNum.value-1,
        pageSize: pageSize.value,

    }
    // 动态加入 queryParams 中不为 null 或空的字段
    Object.keys(queryParams.value).forEach(key => {
    let value = queryParams.value[key];

    // 处理 BrandType 为 null 或 undefined 的情况
    if (key === 'brandType' && (value === undefined || value === null)) {
      value = ''; // 清空选择时的默认值
    }

    if (value !== null && value !== '') {
      // 如果是日期字段，转换为 ISO 格式
      if (key === 'rentalStartDate' || key === 'rentalEndDate') {
        params[key] = new Date(value).toISOString();
      } else {
        params[key] = value;
      }
    }
  });
    const res = await BoothGetService(params);

    if(res)
    {
      booths.value = res.data.page
      total.value = res.data.total


    }

 }
 const getTypes =async() =>{
  const res = await TypeGetService();

  if(res)
    {
    types.value=res.data


    }


 }
 const resetForm=()=>{
  queryParams.value ={
        BoothName: '',
        Location: '',
        BrandType: '',
        IsAvailable: false,
        IsDesc: false,
        MinPrice: null,
        MaxPrice: null,
        RentalStartDate: null,
        RentalEndDate: null,


    }
    getBooths();

 }
 const boothDetails = (item)=>{
  router.push({path:'/booth/details',query:{
    id:item.id,
  }})}

  onMounted(()=>{
    getBooths()
    getTypes()

  })
  </script>
  <style>
@import url(../../assets/css/homepage.css);
.select {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.el-form {
  margin: 0;
}
</style>
