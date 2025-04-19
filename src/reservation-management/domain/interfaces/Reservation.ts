export interface Reservation {
  id?: number;
  date: string;
  time: string;
  numberOfPeople: number;
  customerId: number;
  tableId: number;
  customer?: {
    id: number;
    name: string;
  };
  table?: {
    id: number;
    tableNumber: string | number;
  };
}