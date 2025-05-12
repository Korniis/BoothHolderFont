import request from "@/utils/request.js";

export const GetUserDataService = (queryForm) => {
  // 将 queryForm 转换为查询参数
  const params = {};
  for (let key in queryForm) {
    if (queryForm[key] !== null && queryForm[key] !== undefined && queryForm[key] !== "") {
      // 处理数组类型的参数（如 roleNames）
      if (Array.isArray(queryForm[key]) && queryForm[key].length > 0) {
        params[key] = queryForm[key].join(","); // 将数组转换为逗号分隔的字符串
      } else {
        params[key] = queryForm[key];
      }
    }
  }

  return request.get("/User/GetList", { params });
};
