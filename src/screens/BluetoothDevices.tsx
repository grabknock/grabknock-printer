import React, {useContext, useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {BLEPrinter} from 'react-native-thermal-receipt-printer';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {AuthContext} from '../auth/AuthContext';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

interface IBLEPrinter {
  device_name: string;
  inner_mac_address: string;
}

function BluetoothDevices({navigation}: any): React.JSX.Element {
  const [printers, setPrinters] = useState<any>([]);
  const [currentPrinter, setCurrentPrinter] = useState<any>();

  // const {authData} = useContext(AuthContext);

  useEffect(() => {
    BLEPrinter.init().then(() => {
      BLEPrinter.getDeviceList().then(setPrinters);
    });
  }, []);

  const _connectPrinter = (printer: any) => {
    //connect printer
    BLEPrinter.connectPrinter(printer.inner_mac_address).then(
      selectedPrinter => {
        setCurrentPrinter(selectedPrinter);
        //printTextTest();
        navigation.navigate('OrderList', {
          selectedPrinter: selectedPrinter
        })
      },
      error => console.warn(error),
    );
  };

  const printTextTest = () => {
    currentPrinter && BLEPrinter.printText('<C>sample text</C>\n');
  };

  const printBillTest = () => {
    currentPrinter && BLEPrinter.printBill('<C>sample bill</C>');
  };

  type ItemProps = {printer: IBLEPrinter};
  const PrinterTile = ({printer}: ItemProps) => {
    return (
      <TouchableOpacity
        style={styles.listContainer}
        key={printer.inner_mac_address}
        onPress={() => _connectPrinter(printer)}>
        <Text style={styles.title}>{`Device: ${printer.device_name}`}</Text>
        <Text style={{color: 'gray'}}>
          Mac Address: {printer.inner_mac_address}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      <FlatList
        data={printers}
        renderItem={({item}) => <PrinterTile printer={item} />}
        keyExtractor={item => item.inner_mac_address}
      />

      {/* <TouchableOpacity onPress={printTextTest}>
        <Text>Print Text</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={printBillTest}>
        <Text>Print Bill Text</Text>
      </TouchableOpacity> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 19,
    borderBottomColor: 'lightgrey',
    borderWidth: 0.19,
    justifyContent: 'space-between',
  },
  title: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BluetoothDevices;
