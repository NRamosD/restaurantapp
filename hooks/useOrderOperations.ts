import { useSQLiteContext } from 'expo-sqlite'
import React from 'react'
import useOrderStore from './useOrderStore'
import { createOrder, updateOrder } from '@/database/order.operations'
import { createOrderProduct, updateOrderProduct } from '@/database/order_product.operations'

type Props = {}

const useOrderOperations = ({
    
}: Props) => {
    const dbConnection = useSQLiteContext()
    const {
        items,
    } = useOrderStore()


    const createOrderProcess = async ({
        estado = "pendiente",   
        total,
        idPerfil = 1
    }: {
        estado?: "pendiente" | "pagado" | "cancelado"
        total: number
        idPerfil?: number
    }) => {
        const orderCreated = await createOrder(dbConnection, {
            estado,
            total,
            id_perfil: idPerfil
        })

        items.forEach(item => {
            createOrderProduct(dbConnection, {
                id_orden: orderCreated,
                id_producto: item.id_producto,
                cantidad: item.quantity,
                precio_unitario: item.precio
            })
        })
        
    }

    const updateOrderProcess = async ({
        id_orden,
        total,
        estado = "pendiente"
    }: {
        id_orden: number
        total: number
        estado?: "pendiente" | "pagado" | "cancelado"
    }) => {
        updateOrder(dbConnection, {
            id_orden,
            total,
            id_perfil: 1,
            fecha: new Date().toISOString(),
            estado
        })
        //falta validar los que no existen y los que se eliminan porque ahorita solo se actualizan los que existen
        items.forEach(item => {
            console.log({item})
            updateOrderProduct(dbConnection, {
                id_orden: id_orden,
                id_producto: item.id_producto,
                cantidad: item.quantity,
                precio_unitario: item.precio
            })
        })
    }

    return {
        createOrderProcess,
        updateOrderProcess
    }
}

export default useOrderOperations