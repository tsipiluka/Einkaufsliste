export interface IUserLogin {
    email: string,
    password: string,
}
   
export class UserLogin implements IUserLogin{
    constructor(
        public email: string,
        public password: string,
    ){}
}