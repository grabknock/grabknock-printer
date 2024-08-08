import {useQuery} from '@tanstack/react-query';
import axios, {isAxiosError} from 'axios';
import {API_URL} from '../../constants';

// Order list
export interface OrderPayload {
  restaurant_id: string;
  order_statuses: string;
  start: number;
  draw: number;
  orderBy: string;
  dir: string;
  search: string | null;
}

export interface OrderResponse {
  status: string;
  data: OrderMetaData;
}

export interface OrderMetaData {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  orders: Order[];
}

export interface Order {
  restaurant_id: string;
  platform: string;
  customer_id: string;
  status_message: string;
  tax1_name: string;
  tax1_value: number;
  tax2_name: string | null;
  tax2_value: string | null;
  tax3_name: string | null;
  tax3_value: string | null;
  tax4_name: string | null;
  tax4_value: string | null;
  delivery_charges: number;
  order_id: string;
  status: string;
  sub_total: number;
  failure_reason: string | null;
  total_paid: number;
  total_tax: number;
  order_cancellation_threshold_in_minutes: number;
  payment_receipt_number: string;
  payment_receipt_url: string | null;
  tip_amount: number;
  loyalty_redeem: number;
  coupon_code_applied: string | null;
  coupon_code_discount: number;
  customer_note: string | null;
  order_image: string | null;
  order_review: string | null;
  payment_method: string | null;
  payment_mode: string | null;
  transaction_id: string | null;
  order_type: string;
  pickup_type: string;
  pickup_type_value: string | null;
  pickup_type_value_str: string | null;
  line_item_count: number;
  free_product: string | null;
  created_at: number;
  created_at_str: string;
  updated_at: number;
  updated_at_str: string;
  customer_name: string;
  job_id: string;
}

export const useOrders = (payload: OrderPayload) => {
  return useQuery({
    queryKey: ['orders'],
    retry: 3,
    queryFn: async ({ signal }) =>
      await axios
        .get<OrderResponse>(API_URL + '/restaurant-order', {
          params: {...payload},
          signal
        })
        .catch(err => {
          console.error(err);
          if (isAxiosError(err)) {
            console.error('isAxiosError', err);
            console.log(err.response);
            console.dir(err.response, {depth: null});
          }
          return null;
        }),
        enabled: !!payload.restaurant_id
  });
};
