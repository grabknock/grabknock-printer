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
  free_product: FreeProduct | null;
  shipping_address: ShippingAddress | null;
  line_items: LineItem[];
  created_at: number;
  created_at_str: string;
  updated_at: null;
  updated_at_str: string;
  job_id: string | null;
}

export interface FreeProduct {
  restaurant_id: string;
  product_id: string;
  sort_order: number;
  category_id: string;
  spice_levels: string | null;
  is_recommended_product: boolean;
  is_available_as_free_product: boolean;
  is_special_product: boolean;
  category_name: string | null;
  availability_status: string;
  stock_unavailable_days: number;
  product_name: string;
  images: string | null;
  product_short_description: string;
  product_long_description: string | null;
  product_image: string;
  product_tags: string;
  addon_list: Addon[] | any[];
  sale_price: number;
  sale_price_expiry_date: number | string | null;
  regular_price: number;
  discount_percentage: number;
  rating_count: number;
  average_rating: number;
  status: string;
  created_at: number | string;
  created_at_str: string;
  updated_at: number | string;
  updated_at_str: string;
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
  addons: Addon[] | any[];
  product: any | null;
}

export interface Addon {
  ad_on_item_id: string;
  ad_on_item_name: string;
  add_on_name: string;
  price: number;
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
