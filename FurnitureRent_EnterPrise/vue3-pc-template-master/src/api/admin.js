import request from "@/utils/request.js"

export const AdminInfoService = (queryParams)=>{
  const params = new URLSearchParams();
  for(let key in queryParams){
      params.append(key,queryParams[key]);
  }
  return request.get('/Admin/UserInfo');

}
