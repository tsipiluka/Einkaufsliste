export interface IUser {
    id: number | undefined,
    email: string| undefined,
    username: string| undefined,
    first_name: string| undefined,
    start_date: Date| undefined,
    about: string| undefined
}
   
export class User implements IUser{
    constructor(
        public id: number| undefined,
        public email: string| undefined,
        public username: string| undefined,
        public first_name: string| undefined,
        public start_date: Date| undefined,
        public about: string| undefined
    ){}
}