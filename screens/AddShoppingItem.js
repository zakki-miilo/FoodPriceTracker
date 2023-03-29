import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddShoppingItem({ navigation }) {
  const [itemName, setItemName] = useState('');

  const handleCreate = async () => {
    if (itemName.trim() === '') {
      alert('Please enter an item name.');
      return;
    }
  
    const newItem = {
      id: new Date().getTime(),
      name: itemName.trim(),
    };
  
    const storedShoppingList = await AsyncStorage.getItem('shoppingList');
    let shoppingList = storedShoppingList ? JSON.parse(storedShoppingList) : [];
    shoppingList.push(newItem);
    await AsyncStorage.setItem('shoppingList', JSON.stringify(shoppingList));
  
    navigation.goBack();
  };
  

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={itemName}
        onChangeText={setItemName}
        placeholder="Enter item name"
      />
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
          <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#29292A',
    justifyContent: 'center',
    padding: 20,
    
  },
  input: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 15,
    padding: 10,
    height: 60,
    marginBottom: 20,
    color: '#F81BFF',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    
  },
  cancelButton: {
    backgroundColor: '#E05858',
    padding: 10,
    borderRadius: 25,
    width: 140,
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 25,
    width: 140,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,

  },

});
