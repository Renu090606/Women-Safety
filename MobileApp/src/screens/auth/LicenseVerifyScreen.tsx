import React, { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { commonStyles } from '../../constants/theme';
import { getCurrentUserProfile, updateUserProfile, verifyLicense } from '../../services/authService';

function LicenseVerifyScreen() {
  const [licenseId, setLicenseId] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const onVerify = async () => {
    if (!licenseId.trim()) {
      setStatus('Enter a valid license ID.');
      return;
    }
    try {
      setLoading(true);
      const result = await verifyLicense(licenseId.trim());
      const current = await getCurrentUserProfile();
      if (current) {
        await updateUserProfile(current.uid, { licenseVerified: true, role: 'driver', name: result.name });
      }
      setStatus('License verified successfully.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'License verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={commonStyles.screen}>
      <View style={commonStyles.card}>
        <Text style={commonStyles.title}>Verify Driver License</Text>
        <TextInput style={commonStyles.input} value={licenseId} onChangeText={setLicenseId} placeholder="License ID" />
        {!!status && <Text style={commonStyles.subtitle}>{status}</Text>}
        <Button title={loading ? 'Verifying...' : 'Verify License'} disabled={loading} onPress={() => void onVerify()} />
      </View>
    </View>
  );
}

export default LicenseVerifyScreen;
