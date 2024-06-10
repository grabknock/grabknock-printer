import {Order} from './../orders/index';
import {useQuery} from '@tanstack/react-query';
import axios, {isAxiosError} from 'axios';
//import axios from '../apiPublicInstance';
import {API_URL} from '../../constants';

export interface OrderDetailResponse {
  status: string;
  data: OrderDetail;
}

export interface OrderDetail {
  restaurant_id: string;
  platform: string;
  order_cancellation_threshold_in_minutes: number;
  customer_id: string;
  payment_receipt_number: string;
  failure_reason: string | null;
  payment_receipt_url: string | null;
  sub_total: number;
  loyalty_redeem: number;
  order_id: string;
  coupon_code_applied: string | null;
  order_image: string;
  coupon_code_discount: number;
  tax1_name: string;
  tax1_value: number;
  tax2_name: string | null;
  tax2_value: string | null;
  tax3_name: string | null;
  tax3_value: string | null;
  tax4_name: string | null;
  tax4_value: string | null;
  delivery_charges: number;
  order_review: string | null;
  status: string;
  status_message: string;
  total_tax: number;
  tip_amount: number;
  total_paid: number;
  customer_note: string | null;
  payment_method: string;
  payment_mode: string;
  transaction_id: string;
  order_type: string;
  pickup_type: string;
  pickup_type_value: any | null;
  billing_address: BillingAddress;
  free_product: string | null;
  shipping_address: ShippingAddress | null;
  line_items: LineItem[];
  created_at: number;
  created_at_str: string;
  updated_at: null;
  updated_at_str: string;
  job_id: string | null;
}

interface BillingAddress {
  billing_id: string;
  customer_id: string;
  first_name: string;
  last_name: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  created_at: number;
  created_at_str: string;
  updated_at: number;
  updated_at_str: string;
}

interface ShippingAddress {
  billing_id: string;
  customer_id: string;
  first_name: string;
  last_name: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  created_at: number;
  created_at_str: string;
  updated_at: number;
  updated_at_str: string;
}

export interface LineItem {
  line_item_id: string | null;
  product_id: string;
  product_quantity: number;
  spice_level: string | number | null;
  name: string;
  description: string | null;
  image: string;
  price: number;
  addons: any[];
  product: any | null;
}

export const useOrderDetail = (order: Order) => {
  return useQuery({
    queryKey: ['orderDetail', order.order_id],
    queryFn: async () => {
      try {
        return await axios
          .get<OrderDetailResponse>(
            API_URL +
              `/order/${order.restaurant_id}/${order.customer_id}/${order.order_id}`,
          )
          .catch(err => {
            console.error(err);
            if (isAxiosError(err)) {
              console.error('isAxiosError', err);
              console.log(err.response);
              console.dir(err.response, {depth: null});
            }
          });
      } catch (err) {
        console.error(err);
      }
    },
    enabled: !!order.order_id
  });
};
