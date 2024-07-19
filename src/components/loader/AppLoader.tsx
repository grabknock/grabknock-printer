import React from 'react';
import {View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';

function AppLoader() {
  return (
    <View
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
      <ActivityIndicator size="large" color="#1B1B1E" />
    </View>
  );
}

export default AppLoader;
