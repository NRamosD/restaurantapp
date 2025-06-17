import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import MenuPopUpGeneral from './MenuPopUpGeneral';
import { CText } from '@/components/CText';

type Props = {
    title?:string;

}

export const TopBarWithMenu = ({title}: Props) => {
  return (
    <View style={styles.container}>
        <View style={styles.titleSide}>
            <CText type="title">
                { title || "Title" }
            </CText>
        </View>
        <View style={styles.menuSide}>
            <MenuPopUpGeneral/>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        borderBottomWidth: 2,
        borderColor:"#ccc"
    },
    titleSide: {
        width: '70%',
        marginBottom: 2,
        justifyContent: 'center',
        paddingHorizontal: 5,
        paddingVertical: 5,
        // alignItems: 'center',
    },
    menuSide: {
        width: '30%',
        paddingRight: 5,
        alignItems: "flex-end",
        justifyContent: 'center',
        overflow:"visible",
    },
})