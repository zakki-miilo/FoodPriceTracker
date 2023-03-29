import React, { useState, useCallback } from 'react';
import {StyleSheet, View, Text, TouchableOpacity, FlatList, Image, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Card } from 'react-native-elements';
import { LinearGradient } from "expo-linear-gradient";
import Icon from 'react-native-vector-icons/FontAwesome';


export default function HomeScreen({ navigation }) {
    const [products, setProducts] = useState([]);
    const clay = require('../assets/clay.png');

    const refreshProducts = async () => {
      const storedProducts = await AsyncStorage.getItem('products');
      if (storedProducts) {
        const parsedProducts = JSON.parse(storedProducts);
        parsedProducts.sort((a, b) => {
          try {
            return new Date(b.createdAt) - new Date(a.createdAt);
          } catch (error) {
            console.error("Invalid date value in product:", a, b);
          }
        });
        setProducts(parsedProducts);
      }
    };
    

    useFocusEffect(
      useCallback(() => {
        fetchData();
      }, [])
    );
  
    const fetchData = async () => {
      const storedProducts = await AsyncStorage.getItem('products');
      if (storedProducts) {
        const parsedProducts = JSON.parse(storedProducts);
        parsedProducts.sort((a, b) => {
          try {
            return new Date(b.createdAt) - new Date(a.createdAt);
          } catch (error) {
            console.error("Invalid date value in product:", a, b);
          }
        });
        
        
        
        setProducts(parsedProducts);
      }
    };
    
    
    
  
    const renderItem = ({ item, index }) => {
      let currentDate;
      let previousDate;
      let formattedCurrentDate;
      let formattedPreviousDate;
    
      try {
        currentDate = new Date(item.createdAt);
        formattedCurrentDate = currentDate.toLocaleDateString();
      } catch (error) {
        console.error("Invalid date value in product:", item);
        return null;
      }
    
      if (index > 0) {
        try {
          previousDate = new Date(products[index - 1].createdAt);
          formattedPreviousDate = previousDate.toLocaleDateString();
        } catch (error) {
          console.error("Invalid date value in previous product:", products[index - 1]);
        }
      }
return (
  <>
    {(index === 0 || formattedCurrentDate !== formattedPreviousDate) && (
  <View style={styles.dateSection}>
    <Text style={styles.dateText}>{formattedCurrentDate}</Text>
  </View>
)}

    <Swipeable renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('ProductDetails', { product: item, store: item.store })}
        >
          <View style={styles.itemCard}>
            {item.thumbnail && (
              <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
            )}
            <View style={styles.itemDetails}>
            <View style={styles.textContainer}>
              <View style={styles.storeNameCard}>
                <Text style={styles.storeName}>{item.store}</Text>
              </View>
              <Text style={styles.itemName}>{item.name}</Text>
            </View>
            <Text style={styles.itemPrice}>${parseFloat(item.price).toFixed(2)}</Text>

          </View>
        </View>
      </TouchableOpacity>
      </Swipeable>
    
  </>
);
};
  
    
    
  
    
    
    return (
      <LinearGradient
      colors={["#fee09e", "#6afecf"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
  <Image source={clay} style={styles.clay} />
  <View style={styles.contentContainer}>
        <View style={styles.cardRow}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Product</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Price</Text>
          </View>
        </View>
        <FlatList
            data={products}
            renderItem={({ item, index }) => renderItem({ item, index })}
            keyExtractor={(item) => item.id.toString()}
            style={styles.flatList}
          />


      


        </View>
        <View style={styles.bottomNav}>
         <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <Icon name="home" type="font-awesome" size={30} color="#454145" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ShoppingList')}>
            <Icon name="shopping-cart" type="font-awesome" size={30} color="#454145" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('AddProduct')}>
            <Icon name="plus" type="font-awesome" size={30} color="#454145" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Icon name="calendar" type="font-awesome" size={30} color="#454145" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Icon name="cog" type="font-awesome" size={30} color="#454145" />
          </TouchableOpacity>
        </View>
    </View>
      </LinearGradient>
      

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

    },
    contentContainer: {
      flex: 1,
      paddingTop: 80,
      paddingHorizontal: 5,
      backgroundColor: 'transparent', // Add this line to make the background transparent
    },
    cardRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',

    },
  
    card: {
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#fff',
      padding: 5,
      margin: 5,
      color: '36DDE0',
      marginTop: 60,

    },
  
    cardTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#000000',
      padding: 5,
    
    },
  
    itemCard: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 15,
      width: Dimensions.get('window').width - 15,
      marginTop: 15,
      padding: 10,
      height: 80,
      backgroundColor: 'white',
      shadowColor: '#000',
      shadowOffset: { width: 1, height: 6},
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      // Add these lines for drop shadow on Android
      elevation: 2,

    },
    storeNameCard: {
      backgroundColor: '#44DBDF',
      borderRadius: 5,
      paddingHorizontal: 5,
      paddingVertical: 2,
      marginBottom: 5,
    },
    storeCard: {
      borderRadius: 10,
      backgroundColor: '#F57474',
      padding: 5,
      marginTop: 5,
      marginLeft: 10,
    },
    storeName: {
      fontSize: 12,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#FFFFFF',
    },
    itemDetails: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginLeft: 10,
     
    },
    itemName: {
      fontSize: 14,
    },
    itemText: {
      fontSize: 14,
      fontFamily: 'monospace',
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
      width: 60,
      height: 60,
      borderRadius: 5,
    },
  
    addButton: {
      backgroundColor: '#6145DD',
      padding: 15,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 15,
      margin: 20,
      width: 200
    },
  
    addButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
    },

    flatList: {
      backgroundColor: 'transparent', // Make the FlatList background transparent

    },
    bottomNav: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#fece66',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingVertical: 10,
      paddingBottom: Platform.OS === 'ios' ? 20 : 10, // Extra padding for iOS devices with a bottom notch
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -1 },
      shadowOpacity: 0.82,
      shadowRadius: 2.22,
      elevation: 1,
      zIndex: 1,
     
    },
    
    navItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: 65,
      color: 'FFFFFF'
    },
    
    dateSection: {
      backgroundColor: '#cf6afe',
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginTop: 10,
      alignSelf: 'flex-start',
    },
    dateText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    clay: {
      position: 'absolute',
      top: 35,
      right: 80,
      width: 150,
      height: 150,
      borderRadius: 15,
    },
    textContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
  });