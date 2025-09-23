import { useSQLiteContext } from 'expo-sqlite'
import React from 'react'
import useOrderStore from './useOrderStore'
import { createOrder, updateOrder } from '@/database/order.operations'
import { createOrderProduct, deleteOrderProduct, deleteOrderProductById, getOrderProduct, getProductsByOrderId, updateOrderProduct } from '@/database/order_product.operations'
import { Product } from '@/interfaces'

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
        estado = "pendiente",
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

        const productsInDB = await getProductsByOrderId(dbConnection, id_orden)
        //a crear
        const productsNotInDB = productsInDB.filter(a1 => !items.some(a2 => a2.id_producto === a1.id_producto));
        productsNotInDB.forEach(product => {
            deleteOrderProduct(
                dbConnection,
                id_orden,
                product.id_producto
            )
        })
        //a eliminar
        const productsInDBNotInItems = items.filter(a1 => !productsInDB.some(a2 => a2.id_producto === a1.id_producto));
        productsInDBNotInItems.forEach(product => {
            createOrderProduct(dbConnection, {
                id_orden: id_orden,
                id_producto: product.id_producto,
                cantidad: product.quantity,
                precio_unitario: product.precio
            })
        })
        //a actualizar
        const productsToUpdate = items.filter(a1 => productsInDB.some(a2 => a2.id_producto === a1.id_producto));
        // console.log({productsToUpdate})
        productsToUpdate.forEach(product => {
            updateOrderProduct(dbConnection, {
                id_orden: id_orden,
                id_producto: product.id_producto,
                cantidad: product.quantity,
                precio_unitario: product.precio
            })
        })


        //falta validar los que no existen y los que se eliminan porque ahorita solo se actualizan los que existen
        // items.forEach(item => {
        //     updateOrderProduct(dbConnection, {
        //         id_orden: id_orden,
        //         id_producto: item.id_producto,
        //         cantidad: item.quantity,
        //         precio_unitario: item.precio
        //     })
        // })
    }

    return {
        createOrderProcess,
        updateOrderProcess
    }
}

export default useOrderOperations