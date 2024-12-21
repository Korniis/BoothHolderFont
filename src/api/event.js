import request from "@/utils/request.js"


export const EvevtGetService = ()=>{

    return request.get('/Event');
}
export const MyEvevtGetService = ()=>{

  return request.post('/Event');
}
