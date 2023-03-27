import React, { useState, useCallback } from 'react';
import {StyleSheet, View, Text, TouchableOpacity, FlatList, Image, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Card } from 'react-native-elements';

export default function HomeScreen({ navigation }) {
    const [products, setProducts] = useState([]);

    const refreshProducts = async () => {
      await fetchData();
    };

    useFocusEffect(
      useCallback(() => {
        fetchData();
      }, [])
    );
  
    const fetchData = async () => {
      const storedProducts = await AsyncStorage.getItem('products');
      if (storedProducts) setProducts(JSON.parse(storedProducts));
    };
  
    const renderItem = ({ item }) => (
      <Swipeable renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('ProductDetails', { product: item, store: item.store })}

        >
          {item.thumbnail && (
            <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
          )}
          <View style={styles.itemDetails}>
            <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>${item.price}</Text>
          </View>
          </TouchableOpacity>
          </Swipeable>
          );
    
          return (
            <View style={styles.container}>
              <Card containerStyle={styles.card}>
                <Text style={styles.cardTitle}>Product</Text>
              </Card>
              <Card containerStyle={styles.card}>
                <Text style={styles.cardTitle}>Price</Text>
              </Card>
              <FlatList data={products} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} />
              <TouchableOpacity onPress={() => navigation.navigate('AddProduct')} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add Product</Text>
              </TouchableOpacity>
            </View>
          );
          

    
      function renderRightActions(progress, dragX, item) {
        const deleteItem = async () => {
          let products = await AsyncStorage.getItem('products');
          products = JSON.parse(products);
          products = products.filter((product) => product.id !== item.id);
          await AsyncStorage.setItem('products', JSON.stringify(products));
        };
      
        const onDelete = async () => {
          Alert.alert(
            'Delete Product',
            'Are you sure you want to delete this product?',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: async () => {
                  await deleteItem();
                  refreshProducts();
                },
              },
            ],
            { cancelable: false }
          );
        };
      
        return (
          <RectButton style={styles.deleteButton} onPress={onDelete}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </RectButton>
        );
      }
         
  }
  const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#F5FCFC',
    paddingTop: 20,
    },
  card: {
    borderRadius: 10,
    margin: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
    item: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    },

    itemDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10,
    },

    itemText: {
    fontSize: 18,
    },

    itemPrice: {
    fontSize: 18,
    color: '#36DDE0',
    },

    deleteButton: {
      backgroundColor: 'red',
      justifyContent: 'center',
      alignItems: 'flex-end',
      width: 100,
      height: '100%',
    },

    deleteButtonText: {
      color: 'white',
      paddingHorizontal: 20,
      fontWeight: '600',
    },

    thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 5,
    },

    addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    margin: 20,
    },

    addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    },
    });


