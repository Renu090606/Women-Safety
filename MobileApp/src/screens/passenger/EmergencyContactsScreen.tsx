import React, { useEffect, useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { commonStyles } from '../../constants/theme';
import { getCurrentUserProfile, updateUserProfile } from '../../services/authService';

function EmergencyContactsScreen() {
  const [raw, setRaw] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    void (async () => {
      const current = await getCurrentUserProfile();
      setRaw((current?.emergencyContacts ?? []).join(','));
    })();
  }, []);

  const onSave = async () => {
    const current = await getCurrentUserProfile();
    if (!current) {
      setMessage('No logged in user.');
      return;
    }
    const contacts = raw
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
    await updateUserProfile(current.uid, { emergencyContacts: contacts });
    setMessage('Emergency contacts saved.');
  };

  return (
    <View style={commonStyles.screen}>
      <View style={commonStyles.card}>
        <Text style={commonStyles.title}>Emergency Contacts</Text>
        <Text style={commonStyles.subtitle}>Add numbers separated by commas.</Text>
        <TextInput
          style={commonStyles.input}
          multiline
          numberOfLines={4}
          value={raw}
          onChangeText={setRaw}
          placeholder="+911234567890,+919876543210"
        />
        {!!message && <Text style={commonStyles.subtitle}>{message}</Text>}
        <Button title="Save Contacts" onPress={() => void onSave()} />
      </View>
    </View>
  );
}

export default EmergencyContactsScreen;
