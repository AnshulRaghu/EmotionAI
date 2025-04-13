import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import UserInfoScreen from './screens/UserInfoScreen';
import MoodTrackerScreen from './screens/MoodTrackerScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="UserInfo">
          <Stack.Screen
            name="UserInfo"
            component={UserInfoScreen}
            options={{ title: 'Welcome to EmotionAI' }}
          />
          <Stack.Screen
            name="MoodTracker"
            component={MoodTrackerScreen}
            options={{ title: 'Your Daily Mood Journal' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}