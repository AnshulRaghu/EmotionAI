import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DashboardScreen({ navigation }) {
  const [userGender, setUserGender] = useState('friend');
  const [greeting, setGreeting] = useState('Welcome');

  useEffect(() => {
    const loadUser = async () => {
      const gender = await AsyncStorage.getItem('user_gender');
      const hour = new Date().getHours();

      let greet = 'Welcome';
      if (hour < 12) greet = 'Good morning';
      else if (hour < 18) greet = 'Good afternoon';
      else greet = 'Good evening';

      setUserGender(gender || 'friend');
      setGreeting(greet);
    };

    loadUser();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.greeting}>
        {greeting}, {userGender === 'Male' ? 'bro' : userGender.toLowerCase()} 👋
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('MoodTracker')}
      >
        <Text style={styles.buttonText}>Start Journaling</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UserInfo')}>
        <Text style={styles.buttonText}>Update Info</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => alert('Settings coming soon!')}
      >
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FF',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#5564EB',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#ccc',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});