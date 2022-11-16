import { User } from "./user.model";

export interface IShoppinglist {
    id: number,
    name: string,
    description: string,
    owner: User
}
   
export class Shoppinglist implements IShoppinglist{
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public owner: User
    ){}
}