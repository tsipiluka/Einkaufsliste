export interface GoogleUserInfo {
    info: {
        sub: string,
        name: string,
        given_name: string,
        family_name: string,
        picture: string,
        email: string,
        email_verified: boolean,
        locale: string
    }
}
   

export class GoogleUserInfo implements GoogleUserInfo{
    constructor(
        public info: {
            sub: string,
            name: string,
            given_name: string,
            family_name: string,
            picture: string,
            email: string,
            email_verified: boolean,
            locale: string
        }
    ){}
}
  