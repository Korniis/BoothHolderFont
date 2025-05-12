
const routes = [

  {
    path: '/user',
    name: 'user',
    meta: {
        title: '用户管理'
    },
    children: [{
        path: 'userEdit',
        name: 'userEdit',
        meta: {
            title: '用户编辑',
        }
    },
    {
        path: 'userAproval',
        name: 'userAproval',
        meta: {
            title: '用户申请'
        }
    }
    ]
},
    {
        path: '/formTemplate',
        name: 'formTemplate',
        meta: {
            title: '投诉处理'
        },
        children: [{
            path: 'formTemplate1',
            name: 'formTemplate1',
            meta: {
                title: '投诉信息',
            }
        },
      
        ]
    },


]

// 模拟获取动态路由数据
export function getDynamicRoutes(){
    return new Promise((resolve) => {
        resolve(routes)
    })
}
