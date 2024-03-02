
import * as jwt from 'jsonwebtoken';

export  function verifyToken(token){
    let error:boolean=false
    let message:string=""
    let  payload:any=null
	try {
		payload = jwt.verify(token, process.env.JWTKEY)

	} catch (e) {
        error=true
        message="Unknow error occured"
		if (e instanceof jwt.JsonWebTokenError) {
            message=e.message
		}
	}
   return {message,error,payload}
}