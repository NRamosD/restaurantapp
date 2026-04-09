import React from 'react'
import { StyleProp, StyleSheet, TextStyle, TouchableOpacity, type TouchableOpacityProps, ViewStyle } from 'react-native';
import { CText } from './CText';
import { useAppTheme } from '@/theme';

type Props =  TouchableOpacityProps & {
    title?: string;
    containerStyles?: StyleProp<ViewStyle>,
    textStyles?: StyleProp<TextStyle>,
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}

const CButton = ({
    title="Default Title",
    containerStyles,
    textStyles,
    variant='primary',
    ...rest
}: Props) => {
    const theme = useAppTheme()
    const buttonTheme = theme.components.button[variant]
    return (
    <TouchableOpacity 
    {...rest}
    style={[
        styles.container,
        { backgroundColor: buttonTheme.backgroundColor, borderColor: buttonTheme.borderColor },
        containerStyles,
    ]}>
        <CText type={"title"} style={[styles.textBtn, { color: buttonTheme.textColor }, textStyles]}>{title}</CText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    container: {
        width:"100%",
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderWidth: 1,
    },
    textBtn: {
        textAlign:"center"
    }
})

export default CButton;