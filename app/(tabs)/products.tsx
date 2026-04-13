import { StyleSheet, FlatList } from 'react-native';
import { CContainerView } from '@/components/CContainerView';
import { TopBarWithMenu } from '@/components/TopBarWithMenu';
import { CView } from '@/components/CView';
import { CText } from '@/components/CText';
import { Product } from "@/interfaces/products";
import ItemMenuSquareDetails from '@/components/orders/ItemMenuSquareDetails';
import { useSQLiteContext } from 'expo-sqlite';
import { getProducts } from '@/db/product.operations';
import { useCallback, useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';

export default function TabTwoScreen() {

  const db = useSQLiteContext();
  const isFocused = useIsFocused();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const productResults = await getProducts(db);
      setProducts(productResults);
    } catch (error) {
      console.log('[PRODUCTS] Error cargando productos', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [db]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, isFocused]);

  return (
    <CContainerView style={styles.container}>
        <TopBarWithMenu title={"Productos"}/>
        <CView style={styles.content}>
          <CView style={styles.summaryCard}>
            <CText type="subtitle">Catálogo</CText>
            <CText>{loading ? 'Cargando productos...' : `${products.length} productos disponibles`}</CText>
          </CView>
          <FlatList<Product>
            data={products}
            renderItem={({item}) => <ItemMenuSquareDetails data={item}/> }
            horizontal={false}
            numColumns={2}
            keyExtractor={item => item.uuid}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <CView style={styles.emptyState}>
                <CText type="subtitle">No hay productos registrados</CText>
                <CText>Cuando agregues productos aparecerán aquí para editarlos.</CText>
              </CView>
            }
          />
        </CView>
        
    </CContainerView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  summaryCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    marginTop: 10,
    gap: 4,
  },
  listContent: {
    paddingBottom: 24,
    gap: 12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 12,
  },
  emptyState: {
    marginTop: 48,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    backgroundColor: '#fafafc',
    alignItems: 'center',
    gap: 6,
  },
});
