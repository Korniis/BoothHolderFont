import request from "@/utils/request.js"

export const EnterpriseLoginService = (logindata)=>{


    return request.post('/Enterprise/Login',logindata);
}
