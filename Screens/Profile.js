import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView, Switch, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

export default function ProfileScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  
  // Additional preferences
  const [orderStatuses, setOrderStatuses] = useState(true);
  const [passwordChanges, setPasswordChanges] = useState(true);
  const [specialOffers, setSpecialOffers] = useState(true);
  const [newsletter, setNewsletter] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedFirstName = await AsyncStorage.getItem('firstName');
        const storedLastName = await AsyncStorage.getItem('lastName');
        const storedEmail = await AsyncStorage.getItem('email');

        if (storedFirstName) setFirstName(storedFirstName);
        if (storedLastName) setLastName(storedLastName);
        if (storedEmail) setEmail(storedEmail);
      } catch (e) {
        console.error('Error loading user data:', e);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      // Clear all data from AsyncStorage
      await AsyncStorage.clear();
      
      // Navigate back to onboarding using CommonActions to avoid navigation issues
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Onboarding' }],
        })
      );
    } catch (e) {
      console.error('Error during logout:', e);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const handleSaveChanges = async () => {
    try {
      await AsyncStorage.multiSet([
        ['firstName', firstName],
        ['lastName', lastName],
        ['email', email]
      ]);
      
      Alert.alert(
        'Success',
        'Your changes have been saved successfully!',
        [{ text: 'OK' }]
      );
    } catch (e) {
      console.error('Error saving changes:', e);
      Alert.alert(
        'Error',
        'Failed to save changes. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Image 
          source={require('../assets/logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <View style={styles.placeholder} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal information</Text>
        
        <Text style={styles.inputLabel}>First name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="First name"
        />
        
        <Text style={styles.inputLabel}>Last name</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Last name"
        />
        
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Email notifications</Text>
        
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceLabel}>Order statuses</Text>
          <Switch
            value={orderStatuses}
            onValueChange={setOrderStatuses}
            trackColor={{ false: '#767577', true: '#495E57' }}
            thumbColor={orderStatuses ? '#F4CE14' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceLabel}>Password changes</Text>
          <Switch
            value={passwordChanges}
            onValueChange={setPasswordChanges}
            trackColor={{ false: '#767577', true: '#495E57' }}
            thumbColor={passwordChanges ? '#F4CE14' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceLabel}>Special offers</Text>
          <Switch
            value={specialOffers}
            onValueChange={setSpecialOffers}
            trackColor={{ false: '#767577', true: '#495E57' }}
            thumbColor={specialOffers ? '#F4CE14' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceLabel}>Newsletter</Text>
          <Switch
            value={newsletter}
            onValueChange={setNewsletter}
            trackColor={{ false: '#767577', true: '#495E57' }}
            thumbColor={newsletter ? '#F4CE14' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.saveButton]} 
          onPress={handleSaveChanges}>
          <Text style={styles.buttonText}>Save changes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.logoutButton]} 
          onPress={handleLogout}>
          <Text style={[styles.buttonText, styles.logoutButtonText]}>Log out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495E57',
  },
  placeholder: {
    width: 70, // Match width of back button for center alignment
  },
  logo: {
    height: 40,
    width: 150,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEFEE',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  preferenceLabel: {
    fontSize: 16,
  },
  buttonContainer: {
    padding: 20,
    gap: 16,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#495E57',
  },
  logoutButton: {
    backgroundColor: '#F4CE14',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  logoutButtonText: {
    color: '#333333',
  },
});