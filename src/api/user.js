import request from "@/utils/request.js"

export const userRegisterService = (registerData)=>{
    const params = new URLSearchParams();
    for(let key in registerData){
        params.append(key,registerData[key]);
    }
    return request.post('/user/register',params);
}

export const userLoginService = (registerData)=>{

    return request.post('/User/Login',registerData);
}

export const userInfoService = ()=>{
    return request.get('/user/userInfo')
}

export const updateUserService = (UserModel)=>{
    const params = new URLSearchParams();
    for(let key in UserModel){
        params.append(key,UserModel[key]);
    }
    return request.put('/user/update',params)
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
