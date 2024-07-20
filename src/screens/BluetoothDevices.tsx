import React, {useContext, useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {BLEPrinter} from 'react-native-thermal-receipt-printer';
import {Avatar, Button, IconButton, MD3Colors, Text} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import CustomButton from '../components/buttons/CustomButton';
import AppHeader from '../components/header/AppHeader';
import AppLoader from '../components/loader/AppLoader';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

interface IBLEPrinter {
  device_name: string;
  inner_mac_address: string;
}

function getFirstTwoLetters(str: string) {
  // Remove special characters
  let cleanedStr = str.replace(/[^a-zA-Z]/g, '');
  // Get the first two letters
  let firstTwoLetters = cleanedStr.substring(0, 2).toUpperCase();
  return firstTwoLetters;
}

const colors = ['#FFB7A9', '#FFBB63', '#B5DEFF', '#67DEA8', '#E1E0FF'];

function BluetoothDevices({navigation}: any): React.JSX.Element {
  const theme = useTheme();

  const [printers, setPrinters] = useState<IBLEPrinter[] | []>([]);
  const [currentPrinter, setCurrentPrinter] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  // const {authData} = useContext(AuthContext);

  useEffect(() => {
    BLEPrinter.init().then(() => {
      BLEPrinter.getDeviceList().then(setPrinters);
    });
  }, []);

  const _connectPrinter = (printer: IBLEPrinter) => {
    setLoading(true);
    //connect printer
    try {
      BLEPrinter.connectPrinter(printer.inner_mac_address).then(
        selectedPrinter => {
          console.log('selected printer', selectedPrinter);
          setCurrentPrinter(selectedPrinter);
          setLoading(false);
          printTextTest();
          navigation.navigate('OrderList', {
            selectedPrinter: selectedPrinter,
          });
        },
      );
    } catch (err) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const printTextTest = () => {
    BLEPrinter.printText('<C>Grabknock</C>\n');
  };

  const printBillTest = () => {
    currentPrinter && BLEPrinter.printBill('<C>sample bill</C>');
  };

  if (loading) {
    return <AppLoader />;
  }

  type ItemProps = {printer: IBLEPrinter};
  const PrinterTile = ({printer}: ItemProps) => {
    let randomIndex = Math.floor(Math.random() * colors.length);
    return (
      <TouchableOpacity
        style={{...styles.listContainer}}
        key={printer.inner_mac_address}
        onPress={() => _connectPrinter(printer)}>
        <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
          <Avatar.Text
            size={50}
            label={getFirstTwoLetters(printer.device_name)}
            style={{marginRight: 20, backgroundColor: colors[randomIndex]}}
          />
          <View>
            <Text style={styles.title}>{`${printer.device_name}`}</Text>
            <Text style={{color: 'gray'}}>
              Mac Address: {printer.inner_mac_address}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{backgroundColor: theme.colors.background, flex: 1}}>
      <View style={{marginHorizontal: 10, flex: 1}}>
        <AppHeader title="Bluetooh Devices" navigation={navigation} />
        <FlatList
          style={{backgroundColor: theme.colors.background, marginTop: 20}}
          data={printers}
          renderItem={({item}) => <PrinterTile printer={item} />}
          keyExtractor={item => item.inner_mac_address}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    borderRadius: 6,
    padding: 14,
    borderWidth: 1.5,
    justifyContent: 'space-between',
    marginVertical: 6,
    backgroundColor: '#F6F6F8',
  },
  title: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BluetoothDevices;
