import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

export default function ProductDetailsScreen({ route }) {
  const { product} = route.params;
  const { store } = route.params;


  const lowestPrice = product.history.reduce((min, entry) => Math.min(min, entry.price), Infinity);

  const isGoodDeal = () => {
    const latestPrice = product.history[product.history.length - 1].price;
    return latestPrice <= lowestPrice;
  };

  const renderPriceHistory = () => {
    return product.history.map((entry, index) => (
      <Text key={index}>
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
        <Text style={styles.storeName}>{store}</Text>
        <Text style={styles.label}>Price History:</Text>
        {renderPriceHistory()}
        <Text style={styles.label}>Is it a good deal?</Text>
        <Text>{isGoodDeal() ? 'Yes, it is a good deal.' : 'No, it is not a good deal.'}</Text>
        
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
      color: '#81D4FA',
      marginBottom: 5,
      marginTop: 10,
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