<template>
  <div class="home-content">
    <div class="home-top">
      <web-data :customStyle="{backgroundColor:'#ffde7d' }"></web-data>
      <div class="home-carousel">
        <el-carousel style="  min-width: 700px; min-height: 400px;" stindicator-position="outside">
          <el-carousel-item style="  min-width: 700px; min-height: 400px;" v-for="imageUrl in imageUrls" :key="imageUrl">
            <el-image style="width: 100%; height: 100%;" fit="fill" :src="imageUrl">
            </el-image>
          </el-carousel-item>
        </el-carousel>
    </div>
    <user-data></user-data>
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
        <img :src="booth.photo || booth.mediaUrl" alt="booth.boothName" class="booth-photo" />
      </div>

      <!-- Card Body -->
      <div class="booth-body">
        <h3 class="booth-name">{{ booth.boothName }}</h3>
        <p class="booth-description">{{ booth.description }}</p>
        <div class="booth-details">
          <span class="booth-price">{{ booth.dailyRate }}每日</span>
          <span class="booth-location">{{ booth.location }}</span>
        </div>
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

  </div>
</template>
<script setup>
import { onMounted,  ref} from 'vue';
import WebData from '@/components/WebData.vue';
import UserData from '@/components/UserData.vue';
import {BoothGetService} from '@/api/booth.js';
import router from '@/router';


//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(105)//总条数
const pageSize = ref(12)//每页条数

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
    const res = await BoothGetService(params);

    if(res)
    {
      booths.value = res.data.page
      total.value = res.data.total


    }

 }
 const boothDetails = (item)=>{
  router.push({path:'/booth/details',query:{
    id:item.id,
  }})}
const imageUrls = ref([
  'https://www.jimei.cn/uploadimgfile/evaluation/fzc8HlRBZxNd.jpg',
  'https://pic.vjshi.com/2019-04-29/b09e5df032cfb9e5587501e4e68078b3/online/puzzle.jpg?x-oss-process=style/w1440_h2880',
  'https://www1.pchouse.com.cn/sheji/datu/2014010803.jpg',
  'https://tupian.xhjj.com/file/upload/202312/29/123208744199.jpg',
]);
const booths = ref([{}])

onMounted(()=>{

  getBooths();

})

</script>
<style scoped>
@import url(../../assets/css/homepage.css);

</style>
