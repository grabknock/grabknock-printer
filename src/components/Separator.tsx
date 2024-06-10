import React from 'react';
import {StyleSheet, View} from 'react-native';

type SeparatorProps = {
  marginVertical?: number;
};

function Separator({marginVertical = 8}: SeparatorProps) {
  const styles = StyleSheet.create({
    separator: {
      marginVertical: marginVertical,
      borderBottomColor: '#737373',
      //borderBottomWidth: StyleSheet.hairlineWidth,
    },
  });

  return <View style={styles.separator} />;
}

export default Separator;
