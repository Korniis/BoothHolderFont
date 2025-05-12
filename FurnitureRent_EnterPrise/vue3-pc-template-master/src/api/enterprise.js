import request from "@/utils/request.js"

export const GetApplicationsService = (queryParams) => {

  const params = new URLSearchParams();
  for (let key in queryParams) {
    if (queryParams[key] != null && queryParams[key] !== '') {
      params.append(key, queryParams[key]);
    }
  }
  return request.get('/EnterpriseAppliction/GetEnterpriseApplication', { params });
}
export const RemarkService = (remarkdata)=>{


   return request.post('/EnterpriseAppliction/RemarkApplication',remarkdata);


}

