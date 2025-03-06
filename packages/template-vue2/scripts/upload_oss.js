var co = require('co')
var OSS = require('ali-oss') //  阿里云oss模块
var fs = require('fs') //  文件模块
var path = require('path')
//  ---------------------------使用说明----------------------------
//  获取命令行传入参数(第0个参数是node 第1个参数是js文件 第2个文件是本地文件夹路径 第3个是oss相对目录)
//  命令格式举例： node  scripts/upload_oss.js  ../../static/  /static/
var env = process.argv[2]
var localPath = process.argv[3]
var remotePath = process.argv[4]
if (localPath == null || remotePath == null) {
  throw new Error('缺少目录参数！')
  return
}
localPath = path.resolve(localPath) //  本地目录
if (!fs.existsSync(localPath)) {
  throw new Error('本地目录' + localPath + '不存在！')
  return
}
//  上传列表
var fileDic = new Array()
//  阿里云OSS配置
const config = {
  dev: {
    //  region: 'oss-cn-shanghai',
    //  accessKeyId: 'LTAIyCJ53NGVCeRL',
    //  accessKeySecret: 'Pg9Ly5ovhh1o31PHFuhAcuVmXnNd4G',
    //  bucket: 'etitans-ams-dev'
  },
  stage: {
    //  region: 'oss-cn-shanghai',
    //  accessKeyId: 'LTAIyCJ53NGVCeRL',
    //  accessKeySecret: 'Pg9Ly5ovhh1o31PHFuhAcuVmXnNd4G',
    //  bucket: 'etitans-ams-stage-sh'
  },
  prod: {
    region: 'oss-cn-shanghai',
    accessKeyId: '',
    accessKeySecret: '',
    bucket: ''
  }
}

var client = new OSS(config[env])
console.log('---------上传OSS---------')
console.log('【Step1】 分析目录')
console.log('==============remotePath:' + remotePath)
readDir(localPath)

function readDir(filePath) {
  filePath = path.resolve(filePath)
  // 遍历文件目录
  var pa = fs.readdirSync(filePath)
  pa.forEach(function(filename, index) {
    var file = path.join(filePath, filename)
    var info = fs.statSync(file)
    // 目录
    if (info.isDirectory()) {
      readDir(file)
    } else {
      urlPath = remotePath + path.relative(localPath, file).replace(/\\/g, '/')
      fileDic[file] = urlPath
      console.log('add file：' + file)
    }
  })
}

console.log(config[env])
console.log(fileDic)
console.log('【Step2】 上传文件')
console.log(fileDic)
co(function * () {
    for (var localDir in fileDic) {
      var result = yield client.put(fileDic[localDir], localDir)
      console.log('upload from \'' + localDir + '\' to \'' + fileDic[localDir] + '\'')
    }
    console.log('【Step3】 完成')
  }
).catch(function(err) {
    throw new Error(err)
  }
)
