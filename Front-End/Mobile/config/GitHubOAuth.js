import React, { useEffect } from 'react';
import { Button } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
};

const clientId = process.env.GITHUB_CLIENT_ID;

export default function GitHubOAuth() {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      scopes: ['read:user', 'user:email'],
      redirectUri: AuthSession.makeRedirectUri({
        useProxy: true,
      }),
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      console.log('GitHub Access Token:', authentication.accessToken);
    }
  }, [response]);

  return (
    <Button
      disabled={!request}
      title="Login with GitHub"
      onPress={() => {
        promptAsync();
      }}
    />
  );
}
