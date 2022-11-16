import { Shoppinglist } from "./shoppinglist.model";
import { User } from "./user.model";

export interface IShoppinglistEntry {
    id: number,
    name: string,
    status: string,
    shopping_list: Shoppinglist,
    creator: User
}
   
export class ShoppinglistEntry implements IShoppinglistEntry{
    constructor(
        public id: number,
        public name: string,
        public status: string,
        public shopping_list: Shoppinglist, 
        public creator: User 
    ){}
}