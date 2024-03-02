import { Injectable } from "@nestjs/common";


export function responseStructure(status:boolean,message:string,data,statusCode:number=200):any {
    return {
        data,
        message,
        status,
        statusCode
    }
}