import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

export default function NameProductScreen() {
    const {nameproduct} = useLocalSearchParams()
    return (
        <View>
            <Text>Este es el producto: {nameproduct}</Text>
        </View>
    )
}
