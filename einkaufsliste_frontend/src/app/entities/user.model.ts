export interface IUser {
    id: number,
    email: string,
    username: string,
    first_name: string,
    start_date: Date,
    about: string
}
   
export class User implements IUser{
    constructor(
        public id: number,
        public email: string,
        public username: string,
        public first_name: string,
        public start_date: Date,
        public about: string
    ){}
}