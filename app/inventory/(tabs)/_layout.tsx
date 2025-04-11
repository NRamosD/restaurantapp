import { IconSymbol } from '@/components/ui/IconSymbol'
import { Tabs } from 'expo-router'
import React from 'react'

export default function InventoryTabsLayout() {
  return (
    <Tabs>
        <Tabs.Screen 
            name="index" 
            options={{
                title: 'Home',
                tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
                headerShown:false,
            }}
        />
        <Tabs.Screen 
            name="items" 
            options={{
                title: 'Items',
                tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
                headerShown:false,
            }}
        />
    </Tabs>
  )
}
