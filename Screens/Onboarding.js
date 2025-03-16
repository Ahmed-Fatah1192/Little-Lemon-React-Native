import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnboardingScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const validateForm = () => {
    return firstName.length > 0 && lastName.length > 0 && email.includes('@');
  };

  const handleTextChange = (field, value) => {
    switch (field) {
      case 'firstName':
        setFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'email':
        setEmail(value);
        break;
    }
    
    // Check form validity after each change
    setTimeout(() => {
      setIsFormValid(validateForm());
    }, 100);
  };

  const handleSubmit = async () => {
    try {
      // Save user data
      await AsyncStorage.multiSet([
        ['firstName', firstName],
        ['lastName', lastName],
        ['email', email],
        ['onboardingCompleted', 'true']
      ]);
      
      // Navigate to home screen
      navigation.replace('Home');
    } catch (e) {
      console.error('Error saving onboarding data:', e);
      Alert.alert('Error', 'Failed to save user data. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <Image 
          source={require('../assets/logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.heroSection}>
        <Text style={styles.heroText}>Let's get to know you</Text>
      </View>
      
      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Personal information</Text>
        
        <Text style={styles.inputLabel}>First name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={(text) => handleTextChange('firstName', text)}
          placeholder="First name"
        />
        
        <Text style={styles.inputLabel}>Last name</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={(text) => handleTextChange('lastName', text)}
          placeholder="Last name"
        />
        
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => handleTextChange('email', text)}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TouchableOpacity 
          style={[styles.button, !isFormValid && styles.buttonDisabled]} 
          onPress={handleSubmit}
          disabled={!isFormValid}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    height: 50,
    width: 200,
  },
  heroSection: {
    backgroundColor: '#495E57',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  form: {
    padding: 20,
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
  button: {
    backgroundColor: '#F4CE14',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#F4CE1480',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});