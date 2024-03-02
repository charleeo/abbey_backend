import fs from "fs"
import path from "path"


export async function logData(req,res){
    let  logPath = 'logs'    
    fs.access(logPath, err => {
      err? fs.promises.mkdir(logPath):""
    })

    let  extension = '.txt'
    let file =  "log-"+ getDate()
    const fullPath = `${logPath}/${file}${extension}`    
    let exist= await checkIfFileExists(fullPath)
    let requestBody = JSON.stringify(req.body)
    let requestHeaders = "XXXXXXXXXXXXxxxxxxxxxxxx"
    let route = `${req.protocol}://${req.get('host')}${req.originalUrl}`
    let responseBody = JSON.stringify(res.locals)
    const method = req.method
    const IP = req.ip
    const data ={requestHeaders,route,requestBody,responseBody,method,IPAddress:IP}
    if(exist){
      await fs.promises.appendFile(fullPath,JSON.stringify(data,null))
    }else{
      await fs.promises.writeFile(fullPath,JSON.stringify(data,null))
    }
  }


  export async function checkIfFileExists(fullPath) {
    let exist= true
    try {
      await fs.promises.access(fullPath)
    } catch (error) {
      exist=false
      if(error.code=="ENOENT"){
        await fs.promises.writeFile(fullPath,"")
      }
    }
    return exist
  }

 export const getDate=()=>{
    let date_ob = new Date();
    let day = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    const date  = `${year}-${month}-${day}`
    return date
  }