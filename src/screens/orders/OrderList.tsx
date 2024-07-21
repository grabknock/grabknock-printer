import React, {useContext, useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {Order, OrderMetaData, OrderPayload, useOrders} from '../../api/orders';
import {AuthContext} from '../../auth/AuthContext';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  Addon,
  FreeProduct,
  LineItem,
  OrderDetail,
  useOrderDetail,
} from '../../api/orderDetail';
import {BLEPrinter} from 'react-native-thermal-receipt-printer';
import {Button, useTheme} from 'react-native-paper';
import AppHeader from '../../components/header/AppHeader';
import {generateReceipt} from './receipt';
import {QueryClient} from '@tanstack/react-query';
import {SettingContext} from '../../settings/SettingContext';

function OrderList({route, navigation}: any) {
  //const {selectedPrinter} = route.params;
  const theme = useTheme();
  const {authData} = useContext(AuthContext);
  const {
    toPrintCount: count,
    increment,
    decrement,
  } = useContext(SettingContext);

  const [orderMetaData, setOrderMetaData] = useState<OrderMetaData | null>(
    null,
  );

  const [intervalIds, setIntervalIds] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[] | []>([]);
  const [orderToPrint, setOrderToPrint] = useState<Order>({} as Order);
  const [orderCountBefore, setOrderCountBefore] = useState<number>(0);

  const orderPayload = {
    restaurant_id: authData?.restaurant_id,
    order_statuses: 'ORDER_PLACED',
    dir: 'desc',
    start: 0,
    draw: 5000,
    orderBy: 'updatedAt',
    search: '',
  } as OrderPayload;

  const queryClient = new QueryClient();

  const {data: orderResponse, isLoading, refetch} = useOrders(orderPayload);
  const {data: orderDetail, isPaused} = useOrderDetail(orderToPrint);

  // clean up
  useEffect(() => {
    if (authData == null) {
      //during logout remove internal
      intervalIds.forEach(id => clearInterval(id));
    }
  }, [authData]);

  useEffect(() => {
    if (orderResponse) {
      setOrderMetaData(orderResponse.data.data);
      setOrderCountBefore(orderResponse.data.data.totalItems);
      setOrders(orderResponse.data.data.orders);
    }
  }, [orderResponse]);

  // print order
  useEffect(() => {
    if (orderToPrint.order_id == orderDetail?.data.data.order_id) {
      handlePrint(orderToPrint);
    }
  }, [orderToPrint, orderDetail]);

  const MINUTE_MS = 10000;

  useEffect(() => {
    intervalIds?.forEach(id => clearInterval(id)); // clear old intervals if present
    const interval = setInterval(async () => {
      console.log('Logs every 10 sec');
      if (authData == null) return;
      const previousCount = orderCountBefore;

      const refetchResponse = await refetch();

      const currentCount =
        refetchResponse.data?.data.data.totalItems ?? previousCount;

      // a new order has been created get order Details and print
      console.log(
        'currentCount:' + currentCount,
        'previousCount:' + previousCount,
      );
      if (currentCount > previousCount) {
        const newOrdersCount = currentCount - previousCount;
        const newOrders = refetchResponse.data?.data.data.orders.slice(
          0,
          newOrdersCount,
        );

        console.log('refetch order detail', newOrders?.length);
        const details = newOrders?.map((order: Order) => {
          console.log('start order detail', order.order_id);
          setOrderToPrint(order);
          console.log('order detail', orderDetail?.data.data.order_id);
        });
      }
    }, MINUTE_MS);

    console.log('new intervals', interval);
    setIntervalIds(prevIds => [...prevIds, interval]);

    return () => {
      console.log('clear intervals', interval);
      clearInterval(interval);
    };
  }, [orders]);

  const handlePrint = (orderToPrint: Order) => {
    if (orderToPrint.order_id) {
      if (orderDetail?.data.data.order_id) {
        if (authData) {
          generateReceipt(orderToPrint, orderDetail, authData, count);
          setOrderToPrint({} as Order); // stop print on rerender
          queryClient.removeQueries({
            queryKey: ['orderDetail', orderDetail.data.data.order_id],
          });
        }
      }
    }
  };

  type ItemProps = {order: Order};
  const OrderTile = ({order}: ItemProps) => {
    return (
      <TouchableHighlight
        underlayColor={'#D0D0D0'}
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

  const handleBackButton = async () => {
    if (BLEPrinter) {
      await BLEPrinter.closeConn();
    }
  };

  return (
    <SafeAreaView style={{backgroundColor: theme.colors.background, flex: 1}}>
      <View style={{marginHorizontal: 10}}>
        <AppHeader
          title="Orders"
          navigation={navigation}
          backButton={true}
          backButtonHandler={handleBackButton}
        />
        <View
          style={{
            ...styles.listContainer,
            flexDirection: 'column',
            marginTop: 20,
            backgroundColor: '#FFCDC3',
          }}>
          <View style={{flexDirection: 'column', gap: 8}}>
            <Text style={{...styles.title, fontSize: 26}}>
              {authData?.restaurant_name}
            </Text>
            <View>
              <Text style={{color: 'black', fontSize: 16}}>
                Admin: {authData?.email_address}
              </Text>
              <Text style={{color: 'black', fontSize: 16}}>
                Total Orders:{' '}
                <Text style={{fontWeight: '800'}}>
                  {orderMetaData?.totalItems}
                </Text>
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={styles.countercontainer}>
              <View style={styles.counterbuttonContainer}>
                <Text
                  style={{...styles.countertext, color: 'black', fontSize: 16}}>
                  No. of Copies:{' '}
                </Text>

                <Pressable onPress={decrement}>
                  <Text
                    style={{
                      ...styles.counterbuttontext,
                      backgroundColor: 'red',
                      color: 'white',
                      fontSize: 16,
                    }}>
                    -
                  </Text>
                </Pressable>
                <Text
                  style={{...styles.countertext, color: 'black', fontSize: 16}}>
                  {count}
                </Text>

                <Pressable onPress={increment}>
                  <Text
                    style={{
                      ...styles.counterbuttontext,
                      backgroundColor: 'green',
                      color: 'white',
                      fontSize: 16,
                    }}>
                    +
                  </Text>
                </Pressable>
              </View>
            </View>
            <Button
              style={{padding: 0,  marginLeft: 20, marginTop: 5}}
              icon="printer-outline"
              mode="text"
              onPress={() => {
                authData?.restaurant_name &&
                  BLEPrinter &&
                  BLEPrinter.printText(authData?.restaurant_name);
              }}>
              Test Print
            </Button>
          </View>
        </View>
        <FlatList
          data={orders}
          renderItem={({item}) => <OrderTile order={item} />}
          keyExtractor={item => item.order_id}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    borderRadius: 6,
    padding: 20,
    display: 'flex',
    borderWidth: 1.5,
    justifyContent: 'space-between',
    marginVertical: 6,
    backgroundColor: '#F6F6F8',
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
  countercontainer: {
    justifyContent: 'center',
  },
  countertext: {
    color: 'black',
    fontSize: 24,
  },
  counterbuttonContainer: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  counterbuttontext: {
    textAlign: 'center',
    backgroundColor: 'red',
    padding: 4,
    width: 30,
    fontWeight: 900,
  },
});

export default OrderList;
