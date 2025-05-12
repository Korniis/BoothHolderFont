import request from "@/utils/request.js"

export const AdminLoginService = (logindata)=>{


    return request.post('/Admin/Login',logindata);
}
