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

export const getCodeService = (email)=>{
  const params = new URLSearchParams();
      params.append("email",email)
    return request.get('/user/SendRegisterCode',{params})
}

export const updateUserPicService = (pic)=>{
    const params = new URLSearchParams();
    for(let key in pic){
        params.append(key,pic[key]);
    }
    return request.patch('/user/updatePic',params)
}

export const updatePwdService = (repwd)=>{
    const params = new URLSearchParams();
    for(let key in repwd){
        params.append(key,repwd[key]);
    }
    return request.patch('/user/updatePwd',params)
}

export const delUserService = (id)=>{
    const params = new URLSearchParams();
    for(let key in id){
        params.append(key,id[key]);
    }
    return request.delete('/user/del',params)
}
