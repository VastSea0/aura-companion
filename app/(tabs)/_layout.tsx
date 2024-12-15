import { Tabs } from 'expo-router';
import React from 'react';
import Tooltip from 'react-native-walkthrough-tooltip';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
     
      screenOptions={{
        tabBarActiveTintColor: "#FFD700",
        tabBarInactiveTintColor: "#B0B0B0",
        tabBarStyle: { backgroundColor: colorScheme === 'dark' ? "#121212" : "#121212" },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
    <Tabs.Screen
      name="tasks"
      
      options={{
        title: 'Tasks',
        tabBarIcon: ({ color, focused }) => (
          <TabBarIcon name={focused ? 'add-circle' : 'add-circle-outline'} color={color} />
        ),
      }}
    />
    </Tabs>
  );
}
