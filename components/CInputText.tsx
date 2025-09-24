import React from 'react'
import { StyleProp, StyleSheet, TextStyle, useColorScheme } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';


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
    const theme = useColorScheme()

    return (
        // <TextInput 
        // {...rest}
        // style={[
        //     styles.container,
        //     containerStyles,
        // ]}/>
        <TextInput
            {...rest}
            style={[style,{ fontSize:fontSize||15, marginVertical:10}]}
            label={label}
            mode="outlined"
            theme={{
                colors: {
                    primary: theme === "dark" ? "white" : "black", // Color del borde cuando tiene focus
                    outline: "#CFAE70", // Borde cuando no tiene focus
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