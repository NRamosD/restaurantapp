import { useState } from "react";
import { Image, StyleProp, ImageStyle } from "react-native"

type Props = {
    src?: string;
    style?: StyleProp<ImageStyle>;
    fallback?: string;
}

/**
 * Componente de imagen que maneja imágenes remotas y fallbacks locales.
 * @param src - URL de la imagen remota.
 * @param [style] - Estilos personalizados para la imagen.
 * @param [fallback] - URL de la imagen que se mostrará en caso de que la imagen principal no se pueda cargar.
 * @returns Componente de imagen que muestra la imagen remota o el fallback, según corresponda. Si ocurre algún error al cargar la imagen, se muestra una imagen de error por defecto.
 */
const CImage = ({
    src,
    style,
    fallback,
    ...props
}: Props) => {
    const [errorImage, setErrorImage] = useState(false);
    return (
        <Image
        style={style}
        source={
            !!src?
                errorImage ? 
                    fallback? {uri: fallback} : require("@/assets/images/fallbackproduct.webp")
                : 
                {uri: src}
            : require("@/assets/images/fallbackproduct.webp")
        }
        onError={()=>setErrorImage(true)}
        {...props}
        />
    )
}

export default CImage