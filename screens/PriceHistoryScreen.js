import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const PriceHistoryScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  // Fetch the product data using the productId
  // Replace the following line with your method of fetching the product data
  const product = product.find((item) => item.id === productId);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.price}>${item.price.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Price History for {product.name}</Text>
      <FlatList
        data={product.priceHistory}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  date: {
    fontSize: 18,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PriceHistoryScreen;
