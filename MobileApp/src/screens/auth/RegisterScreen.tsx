import React, { useState } from 'react';
import { Button, KeyboardAvoidingView, Platform, Text, TextInput, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { commonStyles } from '../../constants/theme';
import { UserRole, register } from '../../services/authService';

type Props = StackScreenProps<AuthStackParamList, 'Register'>;

function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('passenger');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = (): string | null => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      return 'Name, email and password are required.';
    }
    if (!email.includes('@')) {
      return 'Enter a valid email.';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters.';
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
      await register({ name, email, password, role });
      navigation.navigate(role === 'driver' ? 'LicenseVerify' : 'AadhaarVerify');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={commonStyles.screen}>
      <View style={commonStyles.card}>
        <Text style={commonStyles.title}>Create account</Text>
        <TextInput style={commonStyles.input} value={name} onChangeText={setName} placeholder="Full name" />
        <TextInput style={commonStyles.input} value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" />
        <TextInput style={commonStyles.input} value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
        <View style={{ marginBottom: 10 }}>
          <Button title={`Role: ${role}`} onPress={() => setRole(current => (current === 'passenger' ? 'driver' : 'passenger'))} />
        </View>
        {!!error && <Text style={commonStyles.errorText}>{error}</Text>}
        <Button title={loading ? 'Creating...' : 'Register'} disabled={loading} onPress={() => void onSubmit()} />
      </View>
    </KeyboardAvoidingView>
  );
}

export default RegisterScreen;
