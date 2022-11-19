export interface IUserRegistration {
    email: string,
    username: string,
    password: string,
}
   
export class UserRegistration implements IUserRegistration{
    constructor(
        public email: string,
        public username: string,
        public password: string,
    ){}
}