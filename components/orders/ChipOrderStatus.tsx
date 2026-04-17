import React from 'react'
import { CView } from '../CView'
import { CText } from '../CText'

type Props = {
    estado: 'PENDIENTE' | 'EN_PREPARACION' | 'LISTO' | 'ENTREGADO' | 'CANCELADO' | 'SINCRONIZADO',
    fontSize?: number
}

const ChipOrderStatus = ({
    estado,
    fontSize = 12
}: Props) => {
    let color = "#e0e0e0"
    switch (estado) {
        case "PENDIENTE":
            color = "#e0e0e0"
            break
        case "EN_PREPARACION":
            color = "#ff9800"
            break
        case "LISTO":
            color = "#4caf50"
            break
        case "ENTREGADO":
            color = "#2196f3"
            break
        case "CANCELADO":
            color = "#f44336"
            break
        case "SINCRONIZADO":
            color = "#9c27b0"
            break
        default:
            color = "#e0e0e0"
            break
    }
    return (
        <CView style={{ padding: 5, borderRadius: 5, backgroundColor: color , alignItems:"center"}}>
            <CText type="defaultSemiBold" style={{ color: estado==="PENDIENTE" ? "black" : "white", fontSize, letterSpacing:1 }}>
                {estado?.replace("_", " ")}
            </CText>
        </CView>
    )
}

export default ChipOrderStatus