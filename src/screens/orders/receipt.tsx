import { AxiosResponse } from 'axios';
import {Addon, FreeProduct, LineItem, OrderDetailResponse} from '../../api/orderDetail';
import {Order} from '../../api/orders';
import { UserData } from '../../auth/types';
import { BLEPrinter } from 'react-native-thermal-receipt-printer';


function itemSubstrings(itemName: string, length: number) {
    const substrings = [];
    for (let i = 0; i < itemName.length; i += length) {
      let substring = itemName.substr(i, length);
      if (substring.length < length) {
        substring = substring.padEnd(length);
      }
      substrings.push(substring);
    }
    return substrings;
  }

 // to do: make these 3 methods into a single method? same logic repeated in 3 places
 const generateBillItemName = (item: LineItem) => {
    return itemSubstrings(item.name, 22).map((itemLine: string, index) => {
      if (index === 0) { // 1st line of the item with price quantity and total
        const total = (item.price * item.product_quantity).toString().padEnd(4);
        return  `${itemLine}  $${item.price.toString().padEnd(5)} ${item.product_quantity.toString().padEnd(4)} $${item.price * item.product_quantity}`;
      } else { // Other line of items
        return  `\n      ${itemLine}`; 
      }
    });
  };

  const generateBillItemNameForFreeProduct = (item: FreeProduct) => {
    return itemSubstrings(`${item.product_name}(Free)`, 22).map((itemLine: string, index) => {
      if (index === 0) { // 1st line of the item with price quantity and total
        const total = (0).toString().padEnd(4);
        return  `${itemLine}  $${"0".toString().padEnd(5)} ${"1".padEnd(4)} $${0}`;
      } else { // Other line of items
        return  `\n      ${itemLine}`; 
      }
    });
  };

  const generateBillItemForAddOns = (item: Addon) => {
    return itemSubstrings(item.ad_on_item_name, 17).map((itemLine: string, index) => {
      if (index === 0) { // 1st line of the item with price quantity and total
        const total = (item.price * 1).toString().padEnd(4);
        //return  `${itemLine}  $${item.price.toString().padEnd(5)} ${"1".padEnd(4)} $${item.price * 1}`;
        return  `${itemLine}  $${item.price.toString().padEnd(5)} ${"1".padEnd(4)}`;
      } else { // Other line of items
        return  `\n      ${itemLine}`; 
      }
    });
  };

export function generateReceipt(
  orderToPrint: Order,
  orderDetail: AxiosResponse<OrderDetailResponse>,
  authData: UserData,
  count: number
) {
    console.log("generateReceipt");
  if (orderToPrint.order_id) {
    if (orderDetail?.data.data.order_id) {
      console.log(
        'order to print',
        orderToPrint.order_id,
        orderDetail?.data.data.order_id,
      );

      let receiptContent = `<CM>${authData?.restaurant_name}</CM>\n\n`;
      receiptContent += `<C>Order ID: ${orderToPrint.order_id}</C>\n\n`;
      receiptContent += `<D>Billed To: </D>\n`;
      receiptContent += `<L>${orderDetail.data.data.billing_address.first_name} ${orderDetail.data.data.billing_address.last_name}</L>\n`;
      receiptContent += `<L>${orderDetail.data.data.billing_address.address_line_1}</L>\n`;
      receiptContent += `<L>${orderDetail.data.data.billing_address.address_line_2}</L>\n`;
      receiptContent += `<L>${orderDetail.data.data.billing_address.city}, ${orderDetail.data.data.billing_address.state}</L>\n`;
      receiptContent += `<L>${orderDetail.data.data.billing_address.postal_code}, ${orderDetail.data.data.billing_address.country}</L>\n\n`;
      receiptContent += `<L>Order Type: ${orderDetail.data.data.order_type}<L>\n`;
      receiptContent += `<L>Pickup Status: ${orderDetail.data.data.pickup_type}<L>\n`;

      if (
        orderDetail.data.data.order_type == 'DELIVERY' &&
        orderDetail.data.data.shipping_address
      ) {
        receiptContent += `<L>Pickup Time: ${new Date(
          orderDetail.data.data.pickup_type_value,
        ).toLocaleString()}<L>\n\n`;

        receiptContent += `<D>Delivery Address: </D>\n`;
        receiptContent += `<L>${orderDetail.data.data.shipping_address.first_name} ${orderDetail.data.data.shipping_address.last_name}</L>\n`;
        receiptContent += `<L>${orderDetail.data.data.shipping_address.address_line_1}</L>\n`;
        receiptContent += `<L>${orderDetail.data.data.shipping_address.address_line_2}</L>\n`;
        receiptContent += `<L>${orderDetail.data.data.shipping_address.city}, ${orderDetail.data.data.shipping_address.state}</L>\n`;
        receiptContent += `<L>${orderDetail.data.data.shipping_address.postal_code}, ${orderDetail.data.data.shipping_address.country}</L>\n\n`;
      }

      receiptContent += `<L>Payment Method: ${orderDetail.data.data.payment_method}<L>\n`;
      receiptContent += `<R>Order Date: ${orderDetail.data.data.created_at_str}<L>\n\n`;
      receiptContent += `<L>Customer Note: ${orderDetail.data.data.customer_note}</L>\n`;
      receiptContent += `<C>================================================</C>\n`;
      receiptContent += `<L>Sno   Item                    Price  Qty. Tot.</L>\n`;
      receiptContent += `<C>================================================</C>\n`;

      const itemsContent = orderDetail.data.data.line_items.map(
        (item: LineItem, index: any) => {
          const count = (++index).toString().padEnd(6);
          let textToPrint = `${count}${generateBillItemName(item)}`;
          textToPrint = textToPrint.replace(/,/g, '');

          console.log('textToPrint', textToPrint);

          const toPrint = `<L>${textToPrint}</L>\n`;
          receiptContent += toPrint;

          if (item.spice_level) {
            receiptContent += `<L>        Spice: ${item.spice_level}</L>\n`;
          }

          // add add on items
          if (item.addons.length > 0) {
            receiptContent += `<L>${'Add On:'.padStart(15)}</L>\n`;
            item.addons.map((addon: Addon, index: number) => {
              let addonToPrint = `${'- '.padStart(
                11,
              )}${generateBillItemForAddOns(addon)}`;
              receiptContent += `<L>${addonToPrint}</L>\n`;
            });
          }

          return toPrint;
        },
      );

      // add free item
      if (orderDetail.data.data.free_product) {
        receiptContent += `${(orderDetail.data.data.line_items.length + 1)
          .toString()
          .padEnd(6)}${generateBillItemNameForFreeProduct(
          orderDetail.data.data.free_product,
        )}\n`;
      }

      receiptContent += `<C>================================================</C>\n\n`;

      receiptContent += `  <L>${'Subtotal'.padStart(
        30,
      )}        $${orderDetail.data.data.sub_total.toString().padEnd(5)}</L>\n`;
      receiptContent += `  <L>${'Total Tax'.padStart(
        31,
      )}       $${orderDetail.data.data.total_tax.toString().padEnd(5)}</L>\n`;

      if (orderDetail.data.data.loyalty_redeem > 0) {
        receiptContent += `  <L>${'Loyalty Redeem'.padStart(
          36,
        )} -$${orderDetail.data.data.loyalty_redeem
          .toString()
          .padEnd(5)}</L>\n`;
      }

      receiptContent += `  <L>${'Tip'.padStart(
        25,
      )}             $${orderDetail.data.data.tip_amount
        .toFixed(2)
        .toString()
        .padEnd(5)}</L>\n`;

      if (orderDetail.data.data.order_type == 'DELIVERY') {
        receiptContent += ` <L>${'Delivery Chg.'.padStart(
          36,
        )}   $${orderDetail.data.data.delivery_charges
          .toString()
          .padEnd(5)}</L>\n`;
      }

      receiptContent += `\n  <L>${'Total Paid'.padStart(
        32,
      )}      $${orderDetail.data.data.total_paid
        .toString()
        .padEnd(5)}</L>\n\n\n`;

      receiptContent += `<C>________________________________________________</C>\n`;
      receiptContent += `<C>Customer Signature</C>\n\n`;
      receiptContent += `<C>*******************************************</C>\n\n`;
      receiptContent += `<C>Thank you for Ordering at ${authData?.restaurant_name}</C>\n\n\n`;

      let c = 0;
      do {
        BLEPrinter.printText(receiptContent);
        c++;
      } while (c < count)
      
    }
  }
}
