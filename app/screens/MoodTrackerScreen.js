import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './BASE_URL';

export default function MoodTrackerScreen() {
  const [text, setText] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [userAge, setUserAge] = useState(null);
  const [userGender, setUserGender] = useState(null);

  useEffect(() => {
    (async () => {
      const id = await AsyncStorage.getItem('session_id');
      const storedAge = await AsyncStorage.getItem('user_age');
      const storedGender = await AsyncStorage.getItem('user_gender');

      if (id && storedAge && storedGender) {
        setSessionId(id);
        setUserAge(parseInt(storedAge));
        setUserGender(storedGender);

        try {
          const res = await fetch(`${BASE_URL}/entries/${id}`);
          const data = await res.json();
          setHistory(data);
        } catch (err) {
          console.error('Failed to load mood history:', err);
        }
      }
    })();
  }, []);

  const analyzeText = async () => {
    Keyboard.dismiss();
    console.log("Analyze Mood clicked!");

    if (!text || !sessionId || !userAge || !userGender) {
      Alert.alert("Missing user data or input.");
      return;
    }

    console.log("Sending to backend:", {
      mood: text,
      age: userAge,
      gender: userGender,
      session_id: sessionId,
    });

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/generate-response/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: text,
          age: userAge,
          gender: userGender,
          session_id: sessionId,
        }),
      });

      const data = await res.json();
      console.log("Gemini Response:", data);

      if (data.message) {
        setResult(data);
      } else {
        console.warn("No message returned:", data);
      }

      setText('');
    } catch (err) {
      console.error("Analyze Mood error:", err);
      Alert.alert("Something went wrong! Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.wrapper}
    >
      <View style={styles.container}>
        <Text style={styles.header}>🧠 Journal your thoughts</Text>

        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="What's on your mind today?"
            multiline
            value={text}
            onChangeText={setText}
          />
          <TouchableOpacity style={styles.button} onPress={analyzeText}>
            <Text style={styles.buttonText}>Analyze Mood</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <ActivityIndicator
            style={{ marginTop: 20 }}
            size="large"
            color="#5564EB"
          />
        )}

        {result && result.message && (
          <View style={styles.resultCard}>
            <Text style={styles.resultText}>{result.message}</Text>
            <Text style={styles.confidenceText}>
              (Sentiment: {result.sentiment})
            </Text>
          </View>
        )}

        {history.length > 0 && (
          <View style={styles.historyContainer}>
            <Text style={styles.historyTitle}>Mood Trend</Text>
            <FlatList
              horizontal
              data={history}
              keyExtractor={(item) => item._id}
              contentContainerStyle={{ gap: 10 }}
              renderItem={({ item }) => (
                <TouchableOpacity activeOpacity={0.8}>
                  <View
                    style={[
                      styles.bubble,
                      {
                        backgroundColor:
                          item.emotion === 'Happy' ? '#75E6A6' : '#76B3F0',
                      },
                    ]}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#F9F9F9' },
  container: { flex: 1, padding: 20, paddingTop: 60 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    minHeight: 100,
    marginBottom: 12,
    backgroundColor: '#F5F5F5',
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#5564EB',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultCard: {
    marginTop: 30,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#E6E9F7',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    elevation: 3,
  },
  resultText: {
    fontSize: 18,
    marginBottom: 5,
    color: '#333',
  },
  confidenceText: {
    fontSize: 16,
    color: '#666',
  },
  historyContainer: {
    marginTop: 40,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  bubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
});