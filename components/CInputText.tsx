import React from 'react'
import { DimensionValue, KeyboardTypeOptions, StyleProp, TextStyle } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';
import { useAppTheme } from '@/theme';
import { useAppearanceStore } from '@/hooks/useAppearanceStore';

type Props =  TextInputProps & {
    label:string;

    optionText?: "text" | "number"
    fontSize?:number
    style?: StyleProp<TextStyle>
    height?: DimensionValue | undefined
    keyboardType?: KeyboardTypeOptions
}

const CInputText = ({
    label,
    optionText="text",
    fontSize=15,
    style,
    height,
    keyboardType='default',
    ...rest
}: Props) => {
    const theme = useAppTheme()
    const fontScale = useAppearanceStore((state) => state.fontScale)
    const resolvedFontSize = (fontSize || 15) * fontScale

    return (
        <TextInput
            {...rest}
            style={[{ 
                fontSize: resolvedFontSize, 
                marginVertical:5, 
                backgroundColor: theme.components.input.backgroundColor,
                ...(height ? { height: height } : {}),
            }, style]}
            label={label}
            mode="outlined"
            keyboardType={keyboardType}
            theme={{
                colors: {
                    primary: theme.components.input.activeBorderColor,
                    outline: theme.components.input.borderColor,
                    onSurfaceVariant: theme.components.input.labelColor,
                    onSurface: theme.components.input.textColor,
                    surface: theme.components.input.backgroundColor,
                },
            }}
            onKeyPress={(e:any)=>{
                switch(optionText){
                    case "text":
                        break;
                    case "number":
                        if (!/[0-9.]/.test(e.key)) {
                            e.preventDefault();
                        }
                        break;
                    default:
                        console.log("Uncontrolled case")
                        break;
                }
                
            }}
            // value={text}
            // onChangeText={text => setText(text)}
        />
    )
}



export default CInputText;