import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import ServicesScreen from './screens/ServicesScreen';
import NoAreasScreen from './screens/NoAreasScreen';
import ProfileScreen from './screens/ProfileScreen';
import AREditorScreen from './screens/AREditorScreen';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Services" component={ServicesScreen} />
        <Stack.Screen name="NoAreas" component={NoAreasScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="AREditor" component={AREditorScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

