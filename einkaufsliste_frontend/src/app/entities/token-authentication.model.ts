export interface ITokenAuthentication {
    token: string,
    backend: string,
    grant_type: string
}
   
export class TokenAuthentication implements ITokenAuthentication{
    constructor(
        public token: string,
        public backend: string,
        public grant_type: string
    ){}
}