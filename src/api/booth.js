import request from "@/utils/request.js"


export const BoothGetService = (queryParams)=>{

  const params = new URLSearchParams();
  for(let key in queryParams){
      params.append(key,queryParams[key]);
  }
    return request.get('/Booth/GetList',{params:params});
}
export const BoothCreateService = (boothdata)=>{

    return request.post('/booth/CreateBooth',boothdata);
}


export const BoothUpdateService = (boothdata)=>{

  return request.post('/booth/updateBooth',boothdata);
}
  export const boothDetailsService = (id)=>{
    return request.get(`/Booth/get/${id}`)

}
export const TypeGetService = ()=>{
  return request.get("BrandType/get")

}
export const delboothService = (id)=>{
    const params = new URLSearchParams();

        params.append('id',id);

    return request.delete('/Booth/DeleteBooth',{params})
}
