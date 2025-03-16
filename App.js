import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingScreen from './screens/Onboarding';
import HomeScreen from './screens/Home';
import ProfileScreen from './screens/Profile';

const Stack = createStackNavigator();

export default function App() {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user completed onboarding
    const checkOnboardingStatus = async () => {
      try {
        const status = await AsyncStorage.getItem('onboardingCompleted');
        if (status === 'true') {
          setIsOnboardingCompleted(true);
        }
      } catch (e) {
        console.error('Error reading onboarding status:', e);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isOnboardingCompleted ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : null}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}