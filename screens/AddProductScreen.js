import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function AddProductScreen({ navigation}) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [store, setStore] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [stores, setStores] = useState([]);
  const shiba = require('../assets/shiba.jpeg');


  const saveProduct = async () => {
    const product = {
      id: Date.now(),
      name,
      price,
      store,
      thumbnail,
      createdAt: new Date().toISOString(),
      history: [{ price, date: new Date().toISOString() }],

    };


    let products = await AsyncStorage.getItem('products');
    products = JSON.parse(products) || [];
    products.push(product);
    await AsyncStorage.setItem('products', JSON.stringify(products));

    if (store && !stores.includes(store)) {
      const updatedStores = [...stores, store];
      setStores(updatedStores);
      await AsyncStorage.setItem('stores', JSON.stringify(updatedStores));
    }

    navigation.goBack();
  };
  
  const loadStores = async () => {
    const savedStores = await AsyncStorage.getItem('stores');
    if (savedStores) {
      setStores(JSON.parse(savedStores));
    }
  };

  useEffect(() => {
    loadStores();
  }, []);

  const takePhoto = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === 'granted') {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      if (!result.canceled) {
        setThumbnail(result.assets ? result.assets[0].uri : result.uri);
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
    <View style={styles.row}>
          <View style={styles.thumbnailContainer}>
            <Image
              source={thumbnail ? { uri: thumbnail } : shiba}
              style={styles.thumbnail}
              resizeMode="cover"
            />
          </View>
          <View style={styles.content}>
            <Text style={styles.label}>Product Name:</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter product name"
              style={styles.input}
            />
          </View>
          </View>
          <Text style={[styles.label, { marginTop: 40 }]}>Price:</Text>
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
        <View style={styles.storeSuggestions}>
          {stores.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.storeSuggestionCard}
              onPress={() => setStore(suggestion)}
            >
              <Text style={styles.storeSuggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={takePhoto} style={styles.button}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={saveProduct} style={styles.saveP}>
          <Text style={styles.buttonText}>Save Product</Text>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1DE9B6',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  saveP: {
    backgroundColor: '#00E676',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
  thumbnailContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 15,
    backgroundColor: '#e0e0e0', // Gray background
  },
  content: {
    flex: 1,
  },
  storeSuggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  storeSuggestionCard: {
    backgroundColor: '#81D4FA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 10,
  },
  storeSuggestionText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});
