export interface IShoppingplace {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export class Shoppingplace implements IShoppingplace {
  constructor(public id: number, public name: string, public address: string, public latitude: number, public longitude: number) {}
}
