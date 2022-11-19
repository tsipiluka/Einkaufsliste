import { Shoppinglist } from "./shoppinglist.model";
import { User } from "./user.model";

export interface IShoppinglistEntry {
    id: number| undefined,
    name: string| undefined,
    status: string| undefined,
    assignee: User| undefined,
    shopping_list: Shoppinglist| undefined,
    creator: User| undefined
}
   
export class ShoppinglistEntry implements IShoppinglistEntry{
    constructor(
        public id: number| undefined,
        public name: string| undefined,
        public status: string| undefined,
        public assignee: User| undefined,
        public shopping_list: Shoppinglist| undefined, 
        public creator: User | undefined
    ){}
}