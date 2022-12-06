export interface IShoppingplace {
  name: string;
  formatted_address: string;
}

export class Shoppingplace implements IShoppingplace {
  constructor(public name: string, public formatted_address: string) {}
}
