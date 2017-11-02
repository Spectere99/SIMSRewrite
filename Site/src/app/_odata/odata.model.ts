export enum RequestTypes {
    get,
    post,
    put,
    delete,
    patch,
    head,
    options
}

export interface IUrlOptions {
    restOfUrl: string;
}
