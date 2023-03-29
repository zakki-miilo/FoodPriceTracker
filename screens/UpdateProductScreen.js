import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UpdateProductScreen({ navigation, route }) {
    const { product} = route.params;
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.history[product.history.length - 1].price.toString());
  const [store, setStore] = useState(product.store);
  const [thumbnail, setThumbnail] = useState(product.thumbnail);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    const savedStores = await AsyncStorage.getItem('stores');
    if (savedStores) {
      setStores(JSON.parse(savedStores));
    }
  };
  
  const updateProduct = async () => {
    const updatedProduct = {
      ...product,
      name,
      store,
      thumbnail,
      history: [...product.history, { price, date: new Date() }],
    };
  
    let products = await AsyncStorage.getItem('products');
    products = JSON.parse(products) || [];
    const productIndex = products.findIndex((p) => p.id === product.id);
    products[productIndex] = updatedProduct;
    await AsyncStorage.setItem('products', JSON.stringify(products));
  
    if (store && !stores.includes(store)) {
      const updatedStores = [...stores, store];
      setStores(updatedStores);
      await AsyncStorage.setItem('stores', JSON.stringify(updatedStores));
    }
  
    navigation.goBack();
  };
  

  const takePhoto = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === 'granted') {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        setThumbnail(result.assets[0].uri);
      }
    } else {
      alert('Camera permission is required to take a photo.');
    }
  };
  

return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.label}>Product Name:</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter product name"
        style={styles.input}
      />
      <Text style={styles.label}>Price:</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        placeholder="Enter price"
        keyboardType="numeric"
        style={styles.input}
      />
      <Text style={styles.label}>Store:</Text>
      <TextInput
        value={store}
        onChangeText={setStore}
        placeholder="Enter store name"
        style={styles.input}
      />
      <TouchableOpacity onPress={takePhoto} style={styles.button}>
        <Text style={styles.buttonText}>Take Photo</Text>
      </TouchableOpacity>
      {thumbnail && (
        <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
      )}
      <TouchableOpacity onPress={updateProduct} style={styles.saveP}>
        <Text style={styles.buttonText}>Update Product</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
  
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5FCFC',
      paddingHorizontal: 20,
    },
    label: {
      fontSize: 18,
      marginTop: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: '#C5C5C5',
      borderRadius: 10,
      padding: 10,
      fontSize: 18,
      marginBottom: 20,
    },
    button: {
      backgroundColor: '#1DE9B6',
      padding: 15,
      borderRadius: 10,
      marginBottom: 20,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 18,
      textAlign: 'center',
    },
    thumbnail: {
      width: 200,
      height: 200,
      alignSelf: 'center',
      marginTop: 20,
      borderRadius: 10,
    },
    saveP: {
      backgroundColor: '#FF5252',
      padding: 15,
      borderRadius: 10,
      margin: 20,
    },
  });
  