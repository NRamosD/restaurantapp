import React from 'react'
import { StyleProp, StyleSheet, TextInput, type TextInputProps, TextStyle, TouchableOpacity } from 'react-native';
import { CText } from './CText';

type Props =  TextInputProps & {
    containerStyles?: StyleProp<TextStyle>,
    textStyles?: any,
}

const CInputText = ({
    containerStyles,
    textStyles,
    ...rest
}: Props) => {
  return (
    <TextInput 
    {...rest}
    style={[
        styles.container,
        containerStyles,
    ]}/>
  )
}

const styles = StyleSheet.create({
    container: {
        width:"100%",
        height:50,
        borderWidth:1,
        borderRadius:5,
        borderColor:"#c1c1c1",
        fontSize: 15
    },
})

export default CInputText;