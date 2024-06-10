import React, {useContext, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {
  Order,
  OrderMetaData,
  OrderPayload,
  OrderResponse,
  useOrders,
} from '../../api/orders';
import {AuthContext} from '../../auth/AuthContext';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {LineItem, OrderDetail, useOrderDetail} from '../../api/orderDetail';
import {IBLEPrinter} from 'react-native-thermal-receipt-printer';
import {BLEPrinter} from 'react-native-thermal-receipt-printer';
import { getStorageData } from '../../utils/jwt';

function OrderList({route, navigation}: any) {
  const {selectedPrinter} = route.params;
  const [auth, setAuth] = useState<any>({});

  const {authData} = useContext(AuthContext);
  const [orderMetaData, setOrderMetaData] = useState<OrderMetaData | null>(
    null,
  );
  const [orders, setOrders] = useState<Order[] | []>([]);
  const [orderToPrint, setOrderToPrint] = useState<Order>({} as Order);
  const [orderCountBefore, setOrderCountBefore] = useState<number>(0);

  useEffect(() => {
    (async() => {
      const authToken = JSON.parse(await getStorageData("ACCESS_TOKEN") || "");
      setAuth(authToken)
      console.log(authToken);
    })()
  }, [auth])

  const orderPayload = {
    restaurant_id: auth?.restaurant_id,
    order_statuses: 'ORDER_PLACED',
    dir: 'desc',
    start: 0,
    draw: 5000,
    orderBy: 'updatedAt',
    search: '',
  } as OrderPayload;

  const {data: orderResponse, isLoading, refetch} = useOrders(orderPayload);
  const {data: orderDetail, isPaused} = useOrderDetail(orderToPrint);

  useEffect(() => {
    if (orderResponse) {
      setOrderMetaData(orderResponse.data.data);
      setOrderCountBefore(orderResponse.data.data.totalItems);
      setOrders(orderResponse.data.data.orders);
    }
  }, [orderResponse]);

  const MINUTE_MS = 10000;

  useEffect(() => {
    const interval = setInterval(async () => {
      console.log('Logs every 10 sec');
      const previousCount = orderCountBefore;

      const refetchResponse = await refetch();

      const currentCount =
        refetchResponse.data?.data.data.totalItems ?? previousCount;

      // a new order has been created get order Details and print
      if (currentCount > previousCount) {
        const newOrdersCount = currentCount - previousCount;
        const newOrders = refetchResponse.data?.data.data.orders.slice(
          0,
          newOrdersCount,
        );
        //const newOrders = refetchResponse.data?.data.data.orders.slice(0, 1);
        console.log('refetch order detail', newOrders?.length);
        const details = newOrders?.map((order: Order) => {
          console.log('start order detail', order.order_id);
          setOrderToPrint(order);
          console.log('order detail', orderDetail?.data.data.order_id);
        });
      }
    }, MINUTE_MS);

    return () => clearInterval(interval);
  }, [orders]);

  function itemSubstrings(itemName: string, length: number) {
    const substrings = [];
    for (let i = 0; i < itemName.length; i += length) {
      let substring = itemName.substr(i, length);
      if (substring.length < 22) {
        substring = substring.padEnd(22);
      }
      substrings.push(substring);
    }
    return substrings;
  }


  const generateBillItemName = (item: LineItem) => {
    return itemSubstrings(item.name, 22).map((itemLine: string, index) => {
      if (index === 0) { // 1st line of the item with price quantity and total
        const total = (item.price * item.product_quantity).toString().padEnd(4);
        return  `${itemLine}  $${item.price.toString().padEnd(5)} ${item.product_quantity.toString().padEnd(5)} $${item.price * item.product_quantity}`;
      } else { // Other line of items
        return  `\n      ${itemLine}`; 
      }
    });
  };

  // print when order detail is called
  useEffect(() => {
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

        if (orderDetail.data.data.order_type == "DELIVERY" && orderDetail.data.data.shipping_address) {

            receiptContent += `<L>Pickup Time: ${new Date(orderDetail.data.data.pickup_type_value).toLocaleString()}<L>\n\n`;

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
        receiptContent += `<L>Sno   Item                    Price  Qty.  Tot.</L>\n`;
        receiptContent += `<C>================================================</C>\n`;

        const itemsContent = orderDetail.data.data.line_items.map(
          (item: LineItem, index) => {
            
            const count = (++index).toString().padEnd(6);
            let textToPrint = `${count}${generateBillItemName(item)}`;
            textToPrint = textToPrint.replace(/,/g, '');

            console.log("textToPrint", textToPrint);

            const toPrint = `<L>${textToPrint}</L>\n`;
            receiptContent += toPrint;


            if (item.spice_level) {
                receiptContent+= `<L>         - Spice: ${item.spice_level}</L>\n`
            }
            
            return toPrint;
          },
        );

        receiptContent += `<C>================================================</C>\n\n`;

        receiptContent += `  <L>${"Subtotal".padStart(30)}        $${orderDetail.data.data.sub_total.toString().padEnd(5)}</L>\n`
        receiptContent += `  <L>${"Total Tax".padStart(31)}       $${orderDetail.data.data.total_tax.toString().padEnd(5)}</L>\n`

        if (orderDetail.data.data.loyalty_redeem > 0) {
            receiptContent += `  <L>${"Loyalty Redeem".padStart(36)} -$${orderDetail.data.data.loyalty_redeem.toString().padEnd(5)}</L>\n`
        }
        
        receiptContent += `  <L>${"Tip".padStart(25)}             $${orderDetail.data.data.tip_amount.toFixed(2).toString().padEnd(5)}</L>\n`

        if (orderDetail.data.data.order_type == "DELIVERY") {
            receiptContent += ` <L>${"Delivery Chg.".padStart(36)}   $${orderDetail.data.data.delivery_charges.toString().padEnd(5)}</L>\n`
        }

        

        receiptContent += `\n  <L>${"Total Paid".padStart(32)}      $${orderDetail.data.data.total_paid.toString().padEnd(5)}</L>\n\n\n`


        receiptContent += `<C>________________________________________________</C>\n`;
        receiptContent += `<C>Customer Signature</C>\n\n`;
        receiptContent += `<C>*******************************************</C>\n\n`;
        receiptContent += `<C>Thank you for Ordering at ${authData?.restaurant_name}</C>\n\n\n`;


        BLEPrinter.printText(receiptContent);
        setOrderToPrint({} as Order);
      }
    }
  }, [orderToPrint, orderDetail]);

  type ItemProps = {order: Order};
  const OrderTile = ({order}: ItemProps) => {
    return (
        <TouchableHighlight 
            underlayColor={"#D0D0D0"}
            onPress={() => {
                setOrderToPrint(order);
        }}>
            <View style={styles.listContainer}>
                <View
                style={{
                    flexDirection: 'row',
                    gap: 8,
                    justifyContent: 'space-between',
                }}>
                <View style={{flexDirection: 'column', gap: 1}}>
                    <Text style={styles.title}>{order.order_id}</Text>
                    <Text style={styles.textGrey}>{order.created_at_str}</Text>
                    <Text style={{...styles.textGrey, marginTop: 10}}>
                    Order Type: {order.order_type}
                    </Text>
                    <Text style={styles.textGrey}>Pick Up: {order.pickup_type}</Text>
                </View>
                <View style={{flexDirection: 'column', gap: 5}}>
                    <Text style={styles.status}>{order.status}</Text>
                    <Text style={styles.price}>${order.total_paid}</Text>
                </View>
                </View>
            </View>
        </TouchableHighlight>
      
    );
  };

  return (
    <SafeAreaView>
      <View style={{...styles.listContainer, flexDirection: 'column', gap: 8}}>
        <Text style={{...styles.title, fontSize: 26}}>
          {authData?.restaurant_name}
        </Text>
        <View>
          <Text style={{color: 'black', fontSize: 16}}>
            Admin: {authData?.email_address}
          </Text>
          <Text style={{color: 'black', fontSize: 16}}>
            Total Orders:{' '}
            <Text style={{fontWeight: '800'}}>{orderMetaData?.totalItems}</Text>
          </Text>
        </View>
      </View>
      <FlatList
        data={orders}
        renderItem={({item}) => <OrderTile order={item} />}
        keyExtractor={item => item.order_id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 20,
    borderBottomColor: 'lightgrey',
    borderWidth: 0.19,
    justifyContent: 'space-between',
  },
  title: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  status: {
    color: '#EB1100',
    fontWeight: '800',
    fontSize: 16,
  },
  price: {
    color: 'green',
    fontWeight: '800',
  },
  textGrey: {
    color: 'grey',
  },
});

export default OrderList;
