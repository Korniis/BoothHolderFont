import request from "@/utils/request.js"

export const submitReservationApi = (resdata)=>{


  return request.post('/Enterprise/RequestReservation',resdata)
}
export const getReservationInfo = ()=>{


  return request.get('Reservation/GetReservationInfo')
}
export const RemoveReservation = ()=>{


  return request.post('Enterprise/RemoveReservation')
}

