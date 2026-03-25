// Type declarations for Razorpay SDK
// Since @types/razorpay may not be available or compatible

declare module "razorpay" {
  interface RazorpayOptions {
    key_id: string;
    key_secret: string;
  }

  interface OrderCreateOptions {
    amount: number;
    currency: string;
    receipt: string;
    notes?: Record<string, unknown>;
  }

  interface Order {
    id: string;
    entity: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
    created_at: number;
    notes?: Record<string, unknown>;
  }

  interface RefundCreateOptions {
    amount?: number;
    speed?: string;
    notes?: Record<string, unknown>;
  }

  interface Refund {
    id: string;
    entity: string;
    amount: number;
    currency: string;
    payment_id: string;
    status: string;
    created_at: number;
  }

  interface Orders {
    create(options: OrderCreateOptions): Promise<Order>;
    retrieve(id: string): Promise<Order>;
  }

  interface Payments {
    retrieve(id: string): Promise<Payment>;
    refund(paymentId: string, options?: RefundCreateOptions): Promise<Refund>;
  }

  interface Payment {
    id: string;
    entity: string;
    amount: number;
    currency: string;
    status: string;
    order_id: string;
    invoice_id: string | null;
    created_at: number;
  }

  class Razorpay {
    static orders: Orders;
    constructor(options: RazorpayOptions);
    orders: Orders;
    payments: Payments;
  }

  export = Razorpay;
}
