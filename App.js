import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UpdateProductScreen from './screens/UpdateProductScreen';
import { LinearGradient } from "expo-linear-gradient";
import 'react-native-gesture-handler';

import HomeScreen from './screens/HomeScreen';
import AddProductScreen from './screens/AddProductScreen';

import ProductDetailsScreen from './screens/ProductDetailScreen.js';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTitle: "Hello",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
              paddingVertical: 10, 
              paddingHorizontal: 10, 
          
              color: 'white',
            },
            headerTransparent: true,
          }}
        />
        <Stack.Screen name="AddProduct" component={AddProductScreen} options={{ title: 'Add Product' }} />
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ title: 'Product Details' }} />
        <Stack.Screen name="UpdateProductScreen" component={UpdateProductScreen} options={{ title: 'Update Product' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
