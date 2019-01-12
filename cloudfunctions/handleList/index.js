const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100
exports.main = async (event, context) => {
  let {dbName,method,id,pageSize,page} = event 
  const assembly = db.collection(dbName)

  if (method === 'get'){
    const countResult = await assembly.count()
    const total = countResult.total
    pageSize || (pageSize = 10)
    page || (page = 1)
    // 计算需分几次取
    const batchTimes = Math.ceil(total / pageSize)
    if (page >= batchTimes){
      page = batchTimes
    }
    const data = await assembly.skip((page - 1) * pageSize).limit(pageSize).get()
    return {
      data,
      total,
      page,
      errMsg: data.errMsg
    }
  } else if (method === 'delete') {
    const errMessage = await assembly.doc(id).remove()
    return {
      errMsg: errMessage.errMsg
    }
  }
}
