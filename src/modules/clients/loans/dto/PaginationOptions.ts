import { Repository } from "typeorm";
import { PaginationQuery } from "./PaginationQuery";
import { Request } from "express";

export interface PaginationOptions<T> {
    repository: Repository<T>;
    req: Request;
    route: string;
    query: PaginationQuery;
    order?: object;
    relations?: string[];
    condition?: any;
    params?:any
}