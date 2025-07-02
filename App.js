// app.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TimerListScreen from './screens/TimerListScreen';
import AddTimerScreen from './screens/AddTimerScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TimerList">
        <Stack.Screen
          name="TimerList"
          component={TimerListScreen}
          options={{ title: 'Multi Timer App' }}
        />
        <Stack.Screen
          name="AddTimer"
          component={AddTimerScreen}
          options={{ title: 'Add New Timer' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
