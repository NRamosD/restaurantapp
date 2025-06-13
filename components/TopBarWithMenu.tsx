import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import MenuPopUpGeneral from './MenuPopUpGeneral';

type Props = {
    title?:string;

}

export const TopBarWithMenu = ({title}: Props) => {
  return (
    <View style={styles.container}>
        <View style={styles.titleSide}>
            <Text style={{ fontSize:20, fontWeight:'bold'}}>
                { title || "Title" }
            </Text>
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
    },
    titleSide: {
        width: '70%',
        height:50,
        backgroundColor: '#ddd',
        marginBottom: 2,
        // alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5,
    },
    menuSide: {
        width: '30%',
        backgroundColor: '#aaf',
        marginBottom: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})