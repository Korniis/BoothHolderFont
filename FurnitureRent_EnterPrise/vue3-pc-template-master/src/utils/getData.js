
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
    // {
    //     path: '/formTemplate',
    //     name: 'formTemplate',
    //     meta: {
    //         title: '表单示例'
    //     },
    //     children: [{
    //         path: 'formTemplate1',
    //         name: 'formTemplate1',
    //         meta: {
    //             title: '示例1',
    //         }
    //     },
    //     {
    //         path: 'formTemplate2',
    //         name: 'formTemplate2',
    //         meta: {
    //             title: '示例2'
    //         }
    //     }
    //     ]
    // },
    // {
    //     path: '/tableTemplate',
    //     name: 'tableTemplate',
    //     meta: {
    //         title: '表格示例'
    //     },
    //     children: [{
    //         path: 'tableTemplate1',
    //         name: 'tableTemplate1',
    //         meta: {
    //             title: '示例1',
    //         }
    //     },
    //     {
    //         path: 'tableTemplate2',
    //         name: 'tableTemplate2',
    //         meta: {
    //             title: '示例2',
    //         }
    //     }
    //     ]
    // }

]

// 模拟获取动态路由数据
export function getDynamicRoutes(){
    return new Promise((resolve) => {
        resolve(routes)
    })
}
