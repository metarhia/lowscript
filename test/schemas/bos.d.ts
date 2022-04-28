interface Account {
  accountId: number;
  login: string;
  password: string;
}

interface Availability {
  confirmed: boolean;
}

interface Balance {
  amount: number;
}

interface Carrier {
  carrierId: number;
  name: string;
}

interface Product {
  productId: number;
  name: string;
  description: string;
  amount: number;
  price: number;
  weight: number;
}

interface Order {
  orderId: number;
  productId: number;
  buyerId: number;
  carrierId: number;
  amount: number;
  total: number;
  created: string;
}

interface Package {
  packageId: number;
  orderId: number;
  weight: number;
  created: string;
}

interface Payment {
  paymentId: number;
  orderId: number;
  amount: number;
  transaction: string;
  date: string;
}

interface Refund {
  refundId: number;
  orderId: number;
  amount: number;
  transaction: string;
  date: string;
}

interface Reservation {
  reservationId: number;
  productId: number;
  amount: number;
  active: boolean;
  created: string;
}

interface Return {
  returnId: number;
  productId: number;
  amount: number;
  created: string;
}

interface Session {
  sessionId: number;
  accountId: number;
  token: string;
  ip: string;
  data: string;
}

interface Shipment {
  shipmentId: number;
  packageId: number;
  carrierId: number;
  waybill: string;
  date: string;
}
