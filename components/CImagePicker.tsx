import React, { useState } from 'react'
import { Alert, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CView } from './CView';
import CButton from './CButton';

type Props = {}

const CImagePicker = (props: Props) => {
    const [image, setImage] = useState<string|null>(null);

    const pickImage = async () => {
        // Pide permiso
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Necesitas dar acceso a la galería');
        return;
        }

        // Abre galería
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        });

        // Si no se canceló
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };
    return (
        <CView style={styles.container}>
            <CButton title="Subir Imagen" onPress={pickImage} />
            {image && <Image source={{ uri: image }} style={styles.image} />}
        </CView>
    )
}

export default CImagePicker

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
});