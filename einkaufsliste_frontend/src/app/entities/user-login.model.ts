export interface IUserLogin {
    client_id: string,
    client_secret: string,
    grant_type: string,
    username: string,
    password: string
}
   
export class UserLogin implements IUserLogin{
    constructor(
        public client_id: string,
        public client_secret: string,
        public grant_type: string,
        public username: string,
        public password: string
    ){}
}

