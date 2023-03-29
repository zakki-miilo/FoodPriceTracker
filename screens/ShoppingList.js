import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Card, CheckBox } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ShoppingList({ navigation }) {
  const [shoppingList, setShoppingList] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    const storedShoppingList = await AsyncStorage.getItem('shoppingList');
    if (storedShoppingList) {
      const parsedShoppingList = JSON.parse(storedShoppingList);
      setShoppingList(parsedShoppingList);
    }
  };

  const renderItem = ({ item, index }) => {
    const handleCheckboxPress = async () => {
      const updatedShoppingList = shoppingList.map((listItem) => {
        if (listItem.id === item.id) {
          return { ...listItem, checked: !listItem.checked };
        }
        return listItem;
      });
      setShoppingList(updatedShoppingList);
      await AsyncStorage.setItem('shoppingList', JSON.stringify(updatedShoppingList));
    };
  
    return (
        <View style={styles.item}>
        <CheckBox
          title={item.name}
          checked={item.checked}
          onPress={handleCheckboxPress}
          containerStyle={styles.checkboxContainer}
          textStyle={item.checked ? styles.itemNameChecked : styles.itemNameUnchecked}
          checkedColor="#6afecf"
        />
      </View>
    );
  };
  
  

      return (
        <LinearGradient
          colors={['#fee09e', '#6afecf']}
          style={styles.container}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.contentContainer}>
            <FlatList
              data={shoppingList}
              renderItem={({ item, index }) => renderItem({ item, index })}
              keyExtractor={(item) => item.id.toString()}
              style={styles.flatList}
            />
          </View>
          {shoppingList.length === 0 && (
            <View style={styles.emptyListContainer}>
                <Text style={styles.emptyListText}>Drop down your shopping list!</Text>
                <Text style={styles.emptyListText}>
                Tap the plus button to create your first list
                </Text>
            </View>
            )}

          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => navigation.navigate('AddShoppingItem')}
            >
            <Icon name="plus" type="font-awesome" size={30} color="#FFFFFF" />
            </TouchableOpacity>

          <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
              <Icon name="home" type="font-awesome" size={30} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
              <Icon name="shopping-cart" type="font-awesome" size={30} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => navigation.navigate('AddProduct')}
            >
              <Icon name="plus" type="font-awesome" size={30} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
              <Icon name="calendar" type="font-awesome" size={30} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
              <Icon name="cog" type="font-awesome" size={30} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      );
      
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
        fontFamily: 'Roboto',
    },
    contentContainer: {
        flex: 1,
        marginTop: 100, // Add margin to the top
      },
    item: {
        marginBottom: 10,
        backgroundColor: 'white',
        paddingVertical: 2, // Decrease the top and bottom padding
        paddingHorizontal: 5, // Keep the left and right padding
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 2,
      },
      itemName: {
        fontSize: 14,
        textDecorationLine: 'none',
        fontWeight: 'normal',
      },
      checkboxContainer: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      },
      itemNameUnchecked: {
        fontWeight: 'normal',
      },
      itemNameChecked: {
        fontWeight: 'normal',
        textDecorationLine: 'line-through',
        color: '#8E8B8E',
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
      top: 20,
      right: 10,
      width: 150,
      height: 150,
    },
    floatingButton: {
        backgroundColor: '#fece66',
        width: 60,
        height: 60,
        borderRadius: 30,
        position: 'absolute',
        bottom: 100,
        left: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      emptyListContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
      },
      
      emptyListText: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10,
        color: '#000000',
        fontFamily: 'Roboto',
      },
      
  });