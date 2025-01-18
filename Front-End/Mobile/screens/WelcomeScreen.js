import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import CustomButton from '../components/CustomButton';
import { AUTH_CONFIG } from '../config/authConfig'; // Import du fichier de configuration
import * as WebBrowser from 'expo-web-browser'; // Si vous utilisez Expo

export default function WelcomeScreen({ navigation }) {
  const handleOAuth = async (provider) => {
    const config = AUTH_CONFIG[provider];
    const authUrl = `${config.authEndpoint}?client_id=${config.clientId}&redirect_uri=${config.redirectUri}&response_type=code&scope=${encodeURIComponent(config.scopes.join(' '))}`;

    // Ouvrir l'authentification dans le navigateur
    const result = await WebBrowser.openAuthSessionAsync(authUrl);
    console.log(result); // Gérer la réponse (par exemple, récupérer un code d'autorisation)
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/welcome.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Configure your Automation Space</Text>
      <Text style={styles.subtitle}>
        Explore all the existing services roles based on your interest.
      </Text>
      <View style={styles.buttonContainer}>
        <CustomButton title="Login" onPress={() => navigation.navigate('Login')} />
        <CustomButton
          title="Register"
          onPress={() => navigation.navigate('Register')}
          isOutline
        />
      </View>
      <View style={styles.oauthContainer}>
        <TouchableOpacity
          style={styles.oauthButton}
          onPress={() => handleOAuth('google')}
        >
          <Text style={styles.oauthButtonText}>Login with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.oauthButton}
          onPress={() => handleOAuth('discord')}
        >
          <Text style={styles.oauthButtonText}>Login with Discord</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.oauthButton}
          onPress={() => handleOAuth('github')}
        >
          <Text style={styles.oauthButtonText}>Login with GitHub</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  image: { width: '100%', height: 250 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  subtitle: { fontSize: 14, textAlign: 'center', color: '#666', marginBottom: 20 },
  buttonContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  oauthContainer: { marginTop: 20, alignItems: 'center' },
  oauthButton: {
    backgroundColor: '#4285F4', // Couleur par défaut (Google Blue)
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: 200,
    alignItems: 'center',
  },
  oauthButtonText: { color: '#fff', fontWeight: 'bold' },
});
