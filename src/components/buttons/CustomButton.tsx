import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'

function CustomButton({text, onPress, buttonStyle, textStyle}: any) {
  return (
    <Pressable style={[styles.button, buttonStyle, textStyle]} onPress={onPress} >
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 6,
      elevation: 3,
      backgroundColor: 'black',
      height: 55
    },
    text: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
    },
  });

export default CustomButton