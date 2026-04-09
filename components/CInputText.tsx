import React from 'react'
import { StyleProp, TextStyle } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';
import { useAppTheme } from '@/theme';


type Props =  TextInputProps & {
    label:string;

    optionText?: "text" | "number"
    fontSize?:number
    style?: StyleProp<TextStyle>
}

const CInputText = ({
    label,
    optionText="text",
    fontSize=15,
    style,
    ...rest
}: Props) => {
    const theme = useAppTheme()

    return (
        <TextInput
            {...rest}
            style={[style,{ fontSize:fontSize||15, marginVertical:10, backgroundColor: theme.components.input.backgroundColor }]}
            label={label}
            mode="outlined"
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