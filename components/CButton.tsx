import React from 'react'
import { StyleProp, StyleSheet, TouchableOpacity, type TouchableOpacityProps , useColorScheme, ViewStyle } from 'react-native';
import { CText } from './CText';
import { Colors } from '@/constants/Colors';

type Props =  TouchableOpacityProps & {
    title?: string;
    containerStyles?: StyleProp<ViewStyle>,
    textStyles?: any,
}

const CButton = ({
    title="Default Title",
    containerStyles,
    textStyles,
    ...rest
}: Props) => {
    const color = useColorScheme()
    return (
    <TouchableOpacity 
    {...rest}
    style={[
        styles.container,
        {backgroundColor: Colors[color ?? 'light'].tint},
        containerStyles,
    ]}>
        <CText type={"title"} style={[styles.textBtn,textStyles,{color: Colors[color ?? 'light'].text}]}>{title}</CText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    container: {
        width:"100%",
        paddingVertical: 5,
        paddingHorizontal: 5,
    },
    textBtn: {
        color:"black",
        textAlign:"center"
    }
})

export default CButton;