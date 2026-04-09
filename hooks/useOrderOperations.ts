import { useSQLiteContext } from 'expo-sqlite'
import React from 'react'
import useOrderStore from './useOrderStore'
import { createOrder, updateOrder } from '@/db/order.operations'
import { createOrderProduct, deleteOrderProduct, deleteOrderProductById, getOrderProduct, getProductsByOrderId, updateOrderProduct } from '@/db/order_product.operations'
// import { getProductById, updateProductStock } from '@/db/producto.operations'
import { Product } from '@/interfaces'
import { useOrdenService } from '@/modules'

type Props = {}

const useOrderOperations = ({
    
}: Props) => {
    const { obtenerOrdenPorUuid } = useOrdenService()

    const {
        items,
        addItem
    } = useOrderStore()


    // const verifyStock = async (id_producto: number, cantidad: number) => {
    //     const producto = await getProductById(dbConnection, id_producto)
    //     if(!producto || producto?.ilimitado){
    //         return
    //     }
    //     const currentStock = producto.stock - cantidad
    //     updateProductStock(dbConnection, id_producto, currentStock, 'set')
    // }


    const loadOrderData = async(ordenUuid: string)=>{
        const resultOrder = await obtenerOrdenPorUuid(ordenUuid)
        console.log({resultOrder})
        console.log(resultOrder?.ordenProductos)
        resultOrder?.ordenProductos?.forEach((item) => {
            addItem({
              ...item,
              cantidad: item.cantidad,
              observaciones: item.notas || ""
            })
        })
        // resultOrder.ordenProductos.forEach(async (item) => {
        //   const currentProduct =  await getProductById(dbConnection, item.id_producto)
        //   if(currentProduct){
        //     addItem({
        //       ...currentProduct,
        //       cantidad: item.cantidad,
        //       observaciones: item.detalle || ""
        //     })
        //   }
        // })
    }

    // const createOrderProcess = async ({
    //     estado = "pendiente",   
    //     total,
    //     idPerfil = 1
    // }: {
    //     estado?: "pendiente" | "pagado" | "cancelado"
    //     total: number
    //     idPerfil?: number
    // }) => {
    //     const orderCreated = await createOrder(dbConnection, {
    //         estado,
    //         total,
    //         id_perfil: idPerfil
    //     })

    //     items.forEach(item => {
    //         createOrderProduct(dbConnection, {
    //             id_orden: orderCreated,
    //             id_producto: item.id_producto,
    //             cantidad: item.cantidad,
    //             precio_unitario: item.precio,
    //             detalle: item.observaciones || ""
    //         })
    //         verifyStock(item.id_producto, item.cantidad)
    //     })
    //     return orderCreated
    // }

    // const updateOrderProcess = async ({
    //     id_orden,
    //     total,
    //     estado = "pendiente",
    // }: {
    //     id_orden: number
    //     total: number
    //     estado?: "pendiente" | "pagado" | "cancelado"
    // }) => {
    //     updateOrder(dbConnection, {
    //         id_orden,
    //         total,
    //         id_perfil: 1,
    //         fecha: new Date().toISOString(),
    //         estado
    //     })

    //     const productsInDB = await getProductsByOrderId(dbConnection, id_orden)
    //     //a crear
    //     const productsNotInDB = productsInDB.filter(a1 => !items.some(a2 => a2.id_producto === a1.id_producto));
    //     productsNotInDB.forEach(producto => {
    //         deleteOrderProduct(
    //             dbConnection,
    //             id_orden,
    //             producto.id_producto
    //         )
    //     })
    //     //a eliminar
    //     const productsInDBNotInItems = items.filter(a1 => !productsInDB.some(a2 => a2.id_producto === a1.id_producto));
    //     productsInDBNotInItems.forEach(producto => {
    //         createOrderProduct(dbConnection, {
    //             id_orden: id_orden,
    //             id_producto: producto.id_producto,
    //             cantidad: producto.cantidad,
    //             precio_unitario: producto.precio,
    //             detalle: producto.observaciones || ""
    //         })
    //     })
    //     //a actualizar
    //     const productsToUpdate = items.filter(a1 => productsInDB.some(a2 => a2.id_producto === a1.id_producto));
    //     // console.log({productsToUpdate})
    //     productsToUpdate.forEach(producto => {
    //         updateOrderProduct(dbConnection, {
    //             id_orden: id_orden,
    //             id_producto: producto.id_producto,
    //             cantidad: producto.cantidad,
    //             precio_unitario: producto.precio,
    //             detalle: producto.observaciones || ""
    //         })
    //     })


    //     //falta validar los que no existen y los que se eliminan porque ahorita solo se actualizan los que existen
    //     // items.forEach(item => {
    //     //     updateOrderProduct(dbConnection, {
    //     //         id_orden: id_orden,
    //     //         id_producto: item.id_producto,
    //     //         cantidad: item.cantidad,
    //     //         precio_unitario: item.precio
    //     //     })
    //     // })
    // }

    return {
        // createOrderProcess,
        // updateOrderProcess,
        loadOrderData
    }
}

export default useOrderOperations