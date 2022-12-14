export interface IUserLogin {
    grant_type: string,
    username: string,
    password: string
}
   
export class UserLogin implements IUserLogin{
    constructor(
        public grant_type: string,
        public username: string,
        public password: string
    ){}
}

