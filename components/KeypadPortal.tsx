// components/KeypadPortal.tsx
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Dimensions, Animated, Platform, View, Text, TouchableOpacity } from 'react-native';
import { useNumericInput } from './UnitInputRow';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface KeypadPortalProps {
  inputHandlers: {
    inputId: string;
    value: string;
    onChange: (val: string) => void;
  }[];
}

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', '/'],
  ['space', 'backspace'],
];

const KeypadPortal: React.FC<KeypadPortalProps> = ({ inputHandlers }) => {
  const { activeInput, setActiveInput } = useNumericInput();
  const [slideAnim] = useState(new Animated.Value(0));

  // Find the currently active handler by matching inputId with activeInput
  const activeHandler = inputHandlers.find(handler => handler.inputId === activeInput) || inputHandlers[0];

  // Safely access insets with fallback to prevent crashes
  let bottomInset = 0;
  try {
    const insets = useSafeAreaInsets();
    bottomInset = insets.bottom;
  } catch (error) {
    console.warn('Safe area context not available, using default padding');
  }

  // Animate the keypad sliding in/out
  useEffect(() => {
    if (activeInput) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [activeInput, slideAnim]);

  // Handle key press
  const handlePress = (key: string) => {
    if (!activeHandler) return;

    let newValue = activeHandler.value || '';

    if (key === 'backspace') {
      newValue = newValue.slice(0, -1);
    } else if (key === 'space') {
      newValue = newValue + ' ';
    } else {
      newValue = newValue + key;
    }

    activeHandler.onChange(newValue);
  };

  if (!activeInput) return null;

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  return (
    <Modal
      visible={!!activeInput}
      transparent={true}
      animationType="none"
      statusBarTranslucent={true}
      onRequestClose={() => setActiveInput(null)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setActiveInput(null)}
      >
        <Animated.View
          style={[
            styles.keypadContainer,
            { transform: [{ translateY }] }
          ]}
        >
          <View style={styles.pad}>
            <View style={styles.handleContainer}>
              <View style={styles.handleBar} />
            </View>
            {KEYS.map((row, i) => (
              <View key={i} style={styles.row}>
                {row.map((key) => (
                  <TouchableOpacity
                    key={key}
                    style={styles.key}
                    onPress={(e) => {
                      e.stopPropagation();
                      handlePress(key);
                    }}
                  >
                    <Text style={styles.keyText}>
                      {key === 'backspace' ? '⌫' : key === 'space' ? '␣' : key}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  keypadContainer: {
    width: width,
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: Platform.OS === 'android' ? 24 : undefined,
  },
  pad: {
    width: width,
    backgroundColor: '#fff',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  handleContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  key: {
    flex: 1,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  keyText: {
    fontSize: 24,
    fontWeight: '500',
  }
});

export default KeypadPortal;
