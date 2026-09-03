export interface SweetBoxOrderItem {
  type: 'sweet-box';
  productId: string;
  name: string;
  boxes: number;
  minBoxes: number;
}

export interface SavoryExperienceOrderItem {
  type: 'savory-experience';
  productId: string;
  name: string;
  guests: number;
  minGuests: number;
}

export type OrderItem = SweetBoxOrderItem | SavoryExperienceOrderItem;

export interface OrderCustomer {
  name: string;
  eventDate: string;
  comments: string;
}

export interface Order {
  customer: OrderCustomer;
  items: OrderItem[];
}
