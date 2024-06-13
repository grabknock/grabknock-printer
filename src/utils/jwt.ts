import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
    console.error('Error retrieving data from AsyncStorage:', e);
  }
};

const getStorageData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  } catch (e) {
    // error reading value
    console.error('Error retrieving data from AsyncStorage:', e);
  }
};

export const removeStorageData = async (key: string) => {
  try {
    console.log(key)
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error(e);
  }
};

export { storeData, getStorageData }