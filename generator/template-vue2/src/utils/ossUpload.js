import { getOssUploadSecurityTokenApi, getOssUploadPathApi } from '@/api/common'
import OSS from 'ali-oss'
import store from '@/store'

let getClient = () => new Promise(async (resolve, reject) => {
  Promise.all([getOssUploadPathApi(), getOssUploadSecurityTokenApi()]).then(results => {
    const pathRes = results[0]
    const tokenRes = results[1]
    if (!pathRes.ok || !tokenRes.ok) {
      reject()
      return
    }
    const path = pathRes.content

    const client = new OSS({
      // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
      region: `${process.env.VUE_APP_OSS_REGION}`,
      // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
      accessKeyId: tokenRes.content.accessKeyId,
      accessKeySecret: tokenRes.content.accessKeySecret,
      // 从STS服务获取的安全令牌（SecurityToken）。
      stsToken: tokenRes.content.securityToken,
      // 填写Bucket名称。
      bucket: `${process.env.VUE_APP_OSS_BUCKET}`
    });

    resolve({
      client,
      path
    })
  })
})

// 上传
export function ossUpload(data) {
  return new Promise(async (resolve, reject) => {
    getClient().then(res => {
      let client = res.client
      let path = res.path
      let fileName = data.file.name
      let extension = fileName.substring(fileName.lastIndexOf('.'))
      let userInfo = store.state.user.userInfo

      const headers = {
        'Cache-Control': 'no-cache',
        'Content-Disposition': `inline; filename="${encodeURIComponent(fileName)}"`,
        'Content-Encoding': 'UTF-8',
        // 'Expires': 'Wed, 08 Jul 2022 16:57:01 GMT',
        'x-oss-storage-class': 'Standard',
        'x-oss-object-acl': 'private',
        // 'x-oss-tagging': 'Tag1=1&Tag2=2',
        'x-oss-forbid-overwrite': 'true'
      };

      try {
        // 填写Object完整路径。Object完整路径中不能包含Bucket名称。
        // 您可以通过自定义文件名（例如exampleobject.txt）或文件完整路径（例如exampledir/exampleobject.txt）的形式实现将数据上传到当前Bucket或Bucket中的指定目录。
        // data对象可以自定义为file对象、Blob数据或者OSS Buffer。
        client.put(path + extension, data.file, { headers }).then((res, err) => {
          // 填写Object完整路径。Object完整路径中不能包含Bucket名称。文件URL的有效时长默认为1800秒，即30分钟。
          let url = client.signatureUrl(res.name, { expires: 7200 });
          let fileData = {
            name: data.file.name,
            cloudFileName: res.name,
            fileSize: data.file.size,
            originFileName: data.file.name,
            uploadBy: userInfo.id,
            uploadByName: userInfo.chineseName,
            uploadTime: new Date().getTime(),
            url: url
          }
          resolve(fileData)
        }).catch(err => {
          console.log(err);
          // reject(err)
        });
      } catch (err) {
        this.$message.error('系统异常，请联系管理人员！')
        reject(err)
        console.log(err);
      }
    }).catch(err => {
      console.log(err);
      reject(err)
    });
  })

}


// 生成下载链接
export function ossDownloadFileUrl(data) {
  return new Promise(async (resolve, reject) => {
    getClient().then(res => {
      let client = res.client
      let url = client.signatureUrl(data.cloudFileName);
      resolve(url)
    }).catch(err => {
      console.log(err);
      reject(err)
    });
  })
}
