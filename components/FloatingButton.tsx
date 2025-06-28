import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, type TouchableOpacityProps, StyleProp, ViewStyle, OpaqueColorValue } from 'react-native';

type FloatingButtonProps = TouchableOpacityProps & {
    nameIcon?: "add"|"apps";
    colorIcon?: string | OpaqueColorValue;
    floatProps?:StyleProp<ViewStyle>
} 

const FloatingButton = ({
    nameIcon,
    colorIcon,
    floatProps,
    ...rest
}:FloatingButtonProps) => {
  return (
    <TouchableOpacity style={[styles.fab, floatProps]} {...rest}>
      {
        nameIcon?
        <Ionicons name={nameIcon} size={30} color={colorIcon ||"white"} />
        :
        <Text style={styles.fabIcon}>+</Text>
      }
    </TouchableOpacity>
  );
};

export default FloatingButton

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    backgroundColor: '#007bff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Sombra Android
    shadowColor: '#000', // Sombra iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  fabIcon: {
    fontSize: 30,
    color: 'white',
  },
});