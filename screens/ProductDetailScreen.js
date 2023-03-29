import React, { useState} from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity  } from 'react-native';

export default function ProductDetailsScreen({ route, navigation  }) {
  const { product } = route.params;
  const { store } = route.params;
  const lowestPrice = product.history.reduce((min, entry) => Math.min(min, entry.price), Infinity);

  const isGoodDeal = () => {
    const latestPrice = product.history[product.history.length - 1].price;
    return latestPrice <= lowestPrice;
  };

  
  const renderPriceHistory = () => {
    return product.history.map((entry, index) => (
      <Text key={index} style={styles.historyItem}>
        {new Date(entry.date).toLocaleDateString()} - ${entry.price}
      </Text>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.productName}>{product.name}</Text>
      {product.thumbnail && (
        <Image source={{ uri: product.thumbnail }} style={styles.thumbnail} />
      )}
      <Text style={styles.storeName}>{product.store}</Text>
      <Text style={styles.label}>Is it a good deal?</Text>
        <Text>{isGoodDeal() ? 'Yes, it is a good deal.' : 'No, it is not a good deal.'}</Text>

      <Text style={styles.label}>Price History:</Text>
      <ScrollView>{renderPriceHistory()}</ScrollView>
     
      <TouchableOpacity
          onPress={() => navigation.navigate('UpdateProductScreen', { product})}
          style={styles.updateButton}
        >
          <Text style={styles.buttonText}>Edit Product</Text>
        </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFC',
    paddingHorizontal: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },  
  updateButton: {
    backgroundColor: '#1DE9B6',
    padding: 15,
    borderRadius: 10,
    margin: 20,
  
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
  storeName: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#FFFFFF',
  marginBottom: 5,
  marginTop: 10,
  backgroundColor: '#29FF87',
  borderRadius: 15,
  padding: 10,
  },
  label: {
  fontSize: 18,
  marginTop: 20,
  },
  historyItem: {
  fontSize: 16,
  marginTop: 10,
  },
  });
