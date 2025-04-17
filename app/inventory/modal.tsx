import { Link, router } from 'expo-router';
import React from 'react'
import { Text, View } from 'react-native'

export default function ModalInventory() {
    const isPresented = router.canGoBack();
    return (
        <View>
            <Text>Abrir modal</Text>

            {isPresented && <Link href="../">Dismiss modal</Link>}
        </View>
    )
}
