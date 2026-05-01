import React, { useState } from 'react';
import { Button, KeyboardAvoidingView, Platform, Text, TextInput, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { commonStyles } from '../../constants/theme';
import { login } from '../../services/authService';

type Props = StackScreenProps<AuthStackParamList, 'Login'>;

function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = (): string | null => {
    if (!email.trim() || !password.trim()) {
      return 'Email and password are required.';
    }
    if (!email.includes('@')) {
      return 'Enter a valid email.';
    }
    return null;
  };

  const onSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      setError('');
      setLoading(true);
      await login(email, password);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={commonStyles.screen}>
      <View style={commonStyles.card}>
        <Text style={commonStyles.title}>Welcome back</Text>
        <TextInput style={commonStyles.input} value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" />
        <TextInput
          style={commonStyles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          autoCapitalize="none"
        />
        {!!error && <Text style={commonStyles.errorText}>{error}</Text>}
        <Button title={loading ? 'Signing in...' : 'Login'} disabled={loading} onPress={() => void onSubmit()} />
        <View style={{ height: 10 }} />
        <Button title="Create Account" onPress={() => navigation.navigate('Register')} />
      </View>
    </KeyboardAvoidingView>
  );
}

export default LoginScreen;
