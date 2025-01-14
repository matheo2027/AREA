import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import CustomButton from '../components/CustomButton'; // Assurez-vous que ce fichier existe
import GoogleOAuth from '../config/GoogleOAuth'; // Vérifiez les chemins et l'implémentation
import DiscordOAuth from '../config/DiscordOAuth'; // Vérifiez les chemins et l'implémentation
import GitHubOAuth from '../config/GitHubOAuth'; // Vérifiez les chemins et l'implémentation

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Image d'accueil */}
      <Image
        source={require('../assets/welcome.png')} // Vérifiez que le fichier 'welcome.png' existe dans le dossier 'assets'
        style={styles.image}
        resizeMode="contain"
      />
      {/* Texte d'introduction */}
      <Text style={styles.title}>Configure your Automation Space</Text>
      <Text style={styles.subtitle}>
        Explore all the existing services roles based on your interest.
      </Text>
      {/* Boutons Login / Register */}
      <View style={styles.buttonContainer}>
        <CustomButton title="Login" onPress={() => navigation.navigate('Login')} />
        <CustomButton
          title="Register"
          onPress={() => navigation.navigate('Register')}
          isOutline
        />
      </View>
      {/* Section OAuth */}
      <Text style={styles.oauthContainer}>
        {/* Chaque composant OAuth est un enfant de la balise <Text> */}
        <GoogleOAuth />
        <DiscordOAuth />
        <GitHubOAuth />
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  image: { width: '100%', height: 250 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  subtitle: { fontSize: 14, textAlign: 'center', color: '#666', marginBottom: 20 },
  buttonContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  oauthContainer: {
    marginTop: 20,
    gap: 10,
    flexDirection: 'column',  // Organiser les éléments en colonne
    alignItems: 'center',     // Centrer les éléments horizontalement
  },
});
