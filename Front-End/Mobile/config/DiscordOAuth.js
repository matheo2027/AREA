import React, { useEffect } from 'react';
import { Button } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://discord.com/api/oauth2/authorize',
  tokenEndpoint: 'https://discord.com/api/oauth2/token',
};

const clientId = process.env.DISCORD_CLIENT_ID;

export default function DiscordOAuth() {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      scopes: ['identify', 'email'],
      redirectUri: AuthSession.makeRedirectUri({
        useProxy: true,
      }),
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      console.log('Discord Access Token:', authentication.accessToken);
    }
  }, [response]);

  return (
    <Button
      disabled={!request}
      title="Login with Discord"
      onPress={() => {
        promptAsync();
      }}
    />
  );
}
