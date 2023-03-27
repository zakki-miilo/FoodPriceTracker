import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image,KeyboardAvoidingView, Platform} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddProductScreen({ navigation }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [store, setStore] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [stores, setStores] = useState([]);

  const saveProduct = async () => {
    const product = {
      id: Date.now(),
      name,
      price,
      store,
      thumbnail,
      history: [{ price, date: new Date() }],
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

  const takePhoto = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      if (!result.canceled) {
        setThumbnail(result.assets[0].uri);
      }
    }
  };
  
useEffect(() => {
  loadStores();
}, []);


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
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

    {thumbnail && <Image source={{ uri: thumbnail }} style={styles.thumbnail} />}
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
    paddingTop: 20,
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
    label: {
    fontSize: 18,
    marginTop: 20,
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
      thumbnail: {
      width: 100,
      height: 100,
      marginTop: 20,
      alignSelf: 'center',
      },
      });