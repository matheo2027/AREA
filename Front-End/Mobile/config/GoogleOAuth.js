import React, { useEffect } from 'react';
import { Button } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
};

const clientId = process.env.GOOGLE_CLIENT_ID;

export default function GoogleOAuth() {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      scopes: ['profile', 'email'],
      redirectUri: AuthSession.makeRedirectUri({
        useProxy: true,
      }),
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      console.log('Google Access Token:', authentication.accessToken);
    }
  }, [response]);

  return (
    <Button
      disabled={!request}
      title="Login with Google"
      onPress={() => {
        promptAsync();
      }}
    />
  );
}
