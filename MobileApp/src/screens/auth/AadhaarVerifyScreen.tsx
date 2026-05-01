import React, { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { commonStyles } from '../../constants/theme';
import { getCurrentUserProfile, updateUserProfile, verifyAadhaar } from '../../services/authService';

function AadhaarVerifyScreen() {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const onVerify = async () => {
    if (!/^\d{12}$/.test(aadhaarNumber.trim())) {
      setStatus('Enter a valid 12-digit Aadhaar number.');
      return;
    }
    try {
      setLoading(true);
      const result = await verifyAadhaar(aadhaarNumber.trim());
      const current = await getCurrentUserProfile();
      if (current) {
        await updateUserProfile(current.uid, { aadhaarVerified: true, role: 'passenger', name: result.name });
      }
      setStatus('Aadhaar verified successfully.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Aadhaar verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={commonStyles.screen}>
      <View style={commonStyles.card}>
        <Text style={commonStyles.title}>Verify Aadhaar</Text>
        <TextInput
          style={commonStyles.input}
          value={aadhaarNumber}
          onChangeText={setAadhaarNumber}
          placeholder="12-digit Aadhaar"
          keyboardType="number-pad"
          maxLength={12}
        />
        {!!status && <Text style={commonStyles.subtitle}>{status}</Text>}
        <Button title={loading ? 'Verifying...' : 'Verify Aadhaar'} disabled={loading} onPress={() => void onVerify()} />
      </View>
    </View>
  );
}

export default AadhaarVerifyScreen;
