import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { BASE_URL } from './BASE_URL';

export default function UserInfoScreen({ navigation }) {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  const registerUser = async () => {
    if (!age || !gender) {
      Alert.alert("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ age: parseInt(age), gender })
      });

      const raw = await res.text();
      console.log("Raw response:", raw);

      let data;
      try {
        data = JSON.parse(raw);
      } catch (e) {
        Alert.alert("Failed to parse response", raw);
        return;
      }

      console.log("Parsed session_id:", data.session_id);

      if (data.session_id) {
        await AsyncStorage.setItem('session_id', data.session_id);
        await AsyncStorage.setItem('user_age', age);
        await AsyncStorage.setItem('user_gender', gender);
        navigation.navigate('MoodTracker');
      } else {
        Alert.alert("Registration failed", JSON.stringify(data));
      }
    } catch (err) {
      console.error("Registration error:", err);
      Alert.alert("Network error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tell us a bit about you</Text>

      <TextInput
        style={styles.input}
        placeholder="Age"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={gender}
          onValueChange={(itemValue) => setGender(itemValue)}
        >
          <Picker.Item label="Select Gender" value="" />
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
          <Picker.Item label="Non-binary" value="Non-binary" />
          <Picker.Item label="Prefer not to say" value="Prefer not to say" />
        </Picker>
      </View>

      <Button title="Continue" onPress={registerUser} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 80 },
  title: { fontSize: 24, marginBottom: 20 },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff'
  },
  pickerContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden'
  }
});