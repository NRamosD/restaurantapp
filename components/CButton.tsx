import React from 'react'
import { StyleProp, StyleSheet, TouchableOpacity, type TouchableOpacityProps , View, ViewStyle } from 'react-native';
import { CText } from './CText';

type Props =  TouchableOpacityProps & {
    title?: string;
    containerStyles?: any,
    textStyles?: any,
}

const CButton = ({
    title="Default Title",
    containerStyles,
    textStyles,
    ...rest
}: Props) => {
  return (
    <TouchableOpacity 
    {...rest}
    style={[
        styles.container,
        containerStyles,
    ]}>
        <CText type={"title"} style={[styles.textBtn,textStyles]}>{title}</CText>
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