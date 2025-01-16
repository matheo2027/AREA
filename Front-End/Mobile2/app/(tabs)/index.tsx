import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';  // Utilisation de useNavigation sans typage spécifique

export default function HomeScreen() {
  const navigation = useNavigation();  // Utilisation du hook useNavigation

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>Configure your Automation Space</Text>
        <Text style={styles.subtitle}>
          Explore all the existing services roles based on your interest
        </Text>
        <View style={styles.buttons}>
          {/* Redirection vers Login */}
          <Button
            title="Login"
            onPress={() => navigation.navigate('../Login')}  // Utilisation de navigate pour aller à l'écran Login
            color="#005a9c"
          />
          {/* Redirection vers Register */}
          <Button
            title="Register"
            onPress={() => navigation.navigate('Register')}  // Utilisation de navigate pour aller à l'écran Register
            color="#fff"
            style={styles.registerButton}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  hero: {
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    color: '#005a9c',
  },
  subtitle: {
    marginTop: 10,
    color: '#333',
    fontSize: 16,
  },
  buttons: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerButton: {
    backgroundColor: '#fff',
    borderColor: '#005a9c',
    borderWidth: 2,
  },
});
