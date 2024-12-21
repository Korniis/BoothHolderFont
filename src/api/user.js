import request from "@/utils/request.js"

export const userRegisterService = (registerData)=>{

    return request.post('/user/register',registerData);
}



export const userLoginService = (registerData)=>{

    return request.post('/User/Login',registerData);
}






export const userInfoService = ()=>{
    return request.get('/user/userInfo')
}
export const userMoreInfoService = ()=>{
  return request.get('/user/userMoreInfo')
}

export const getCodeService = (email)=>{
  const params = new URLSearchParams();
      params.append("email",email)
    return request.get('/user/SendRegisterCode',{params})
}

export const updateUserPicService = (avatarurl)=>{

    return request.post('/user/setavatar',avatarurl)
}
export const updateUserInfoService = (from)=>{

  return request.post('/user/UpdateUser',from)
}

export const updatePwdService = (repwd)=>{
    const params = new URLSearchParams();
    for(let key in repwd){
        params.append(key,repwd[key]);
    }
    return request.patch('/user/updatePwd',params)
}

export const delUserService = (id)=>{

    return request.delete('/user/del',id)
}
export const addEvevtService = (id)=>{
  const params = new URLSearchParams();

      params.append("EvevtId",id);

      return request.post(`/user/AddEvent?${params.toString()}`);
}
