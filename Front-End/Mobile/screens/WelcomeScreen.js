import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import CustomButton from '../components/CustomButton';
import GoogleOAuth from '../config/GoogleOAuth';
import DiscordOAuth from '../config/DiscordOAuth';
import GitHubOAuth from '../config/GitHubOAuth';

export default function WelcomeScreen({ navigation }) {
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
      <Text style={styles.oauthContainer}>
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
  oauthContainer: { marginTop: 20, gap: 10, flexDirection: 'column', alignItems: 'center' },
});
