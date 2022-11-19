export interface ITokenAuthentication {
    token: string,
    backend: string,
    grant_type: string,
    client_id: string,
    client_secret: string
}
   
export class TokenAuthentication implements ITokenAuthentication{
    constructor(
        public token: string,
        public backend: string,
        public grant_type: string,
        public client_id: string,
        public client_secret: string
    ){}
}