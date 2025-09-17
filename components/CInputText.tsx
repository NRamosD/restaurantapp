import React from 'react'
import { StyleProp, StyleSheet } from 'react-native';
import { CText } from './CText';
import { TextInput, TextInputProps } from 'react-native-paper';
import { useThemeColor } from '@/hooks/useThemeColor';

type Props =  TextInputProps & {
    label:string;
    optionText?: "text" | "number"
}

const CInputText = ({
    label,
    optionText="text",
    ...rest
}: Props) => {


    return (
        // <TextInput 
        // {...rest}
        // style={[
        //     styles.container,
        //     containerStyles,
        // ]}/>
        <TextInput
            {...rest}
            style={styles.container}
            label={label}
            theme={{
                colors: {
                    primary: '#ff7300ff', // Color del borde cuando tiene focus
                    outline: '#cacacaff', // Borde cuando no tiene focus
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

const styles = StyleSheet.create({
    container: {
        borderWidth:1,
        borderRadius:5,
        borderColor:"#c1c1c1",
        backgroundColor:"#ffffff",
        fontSize: 15
    },
})

export default CInputText;