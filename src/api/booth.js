import request from "@/utils/request.js"


export const BoothGetService = (queryParams)=>{

  const params = new URLSearchParams();
  for(let key in queryParams){
      params.append(key,queryParams[key]);
  }
    return request.get('/Booth/GetList',{params:params});
}
