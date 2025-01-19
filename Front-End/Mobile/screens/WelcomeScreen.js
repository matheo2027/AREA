'use client';

import React from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as Github from 'expo-auth-session/providers/github';
import * as Discord from 'expo-auth-session/providers/discord';
import * as Linking from 'expo-linking';
import CustomButton from '../components/CustomButton';

const WelcomeScreen = ({ navigation }) => {
  const [requestGoogle, responseGoogle, promptGoogle] = Google.useAuthRequest({
    clientId: '1083310640029-762shloldjl0qreq1lmh2crfnks84mqd.apps.googleusercontent.com',
    redirectUri: Linking.createURL('auth'),
  });

  const [requestGithub, responseGithub, promptGithub] = Github.useAuthRequest({
    clientId: 'Ov23liTQhrLel8qNWwXA',
    clientSecret: '6e9babf4c60c5bc37432f64164787bb42f9f1965',
    redirectUri: Linking.createURL('auth'),
  });

  const [requestDiscord, responseDiscord, promptDiscord] = Discord.useAuthRequest({
    clientId: '1325315946885152768',
    redirectUri: Linking.createURL('auth'),
  });

  React.useEffect(() => {
    if (responseGoogle?.type === 'success') {
      handleOAuthResponse(responseGoogle.params, 'google');
    }
    if (responseGithub?.type === 'success') {
      handleOAuthResponse(responseGithub.params, 'github');
    }
    if (responseDiscord?.type === 'success') {
      handleOAuthResponse(responseDiscord.params, 'discord');
    }
  }, [responseGoogle, responseGithub, responseDiscord]);

  const handleOAuthResponse = async (params, provider) => {
    const { access_token: token } = params;

    try {
      // Sauvegarder les informations de l'utilisateur dans le backend
      const res = await fetch('http://localhost:8080/api/save-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'example@provider.com', // Remplacer par une requête pour récupérer l'email si disponible
          token,
          connexion: provider,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert('Success', `Logged in with ${provider}!`);
        navigation.navigate('Dashboard');
      } else {
        Alert.alert('Error', data.message || 'Failed to log in.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'An error occurred while logging in.');
    }
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
        <CustomButton
          title="Continue with Google"
          onPress={() => promptGoogle()}
          isOutline={false}
        />
        <CustomButton
          title="Continue with GitHub"
          onPress={() => promptGithub()}
          isOutline={false}
        />
        <CustomButton
          title="Continue with Discord"
          onPress={() => promptDiscord()}
          isOutline={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  image: { width: '100%', height: 250 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  subtitle: { fontSize: 14, textAlign: 'center', color: '#666', marginBottom: 20 },
  buttonContainer: { flexDirection: 'row', gap: 10 },
  oauthContainer: { marginTop: 20, width: '100%', alignItems: 'center', gap: 10 },
});

export default WelcomeScreen;
