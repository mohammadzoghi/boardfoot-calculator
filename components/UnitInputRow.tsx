// components/UnitInputRow.tsx
import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { unitShortLabels, Unit } from '../utils/boardfeet';

// Create a context to manage active input
const NumericInputContext = React.createContext<{
  activeInput: string | null;
  setActiveInput: (id: string | null) => void;
}>({
  activeInput: null,
  setActiveInput: () => {},
});

export const NumericInputProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [activeInput, setActiveInput] = React.useState<string | null>(null);

  return (
    <NumericInputContext.Provider value={{ activeInput, setActiveInput }}>
      {children}
    </NumericInputContext.Provider>
  );
};

// Hook to use the context
export const useNumericInput = () => useContext(NumericInputContext);

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit: Unit;
  onUnitPress: () => void;
  extraValue?: string;
  onExtraChange?: (v: string) => void;
  extraPlaceholder?: string;
  showExtra?: boolean;
  testID?: string;
  inputId?: string; // Add unique identifier for this input
  extraInputId?: string; // Add unique identifier for extra input
}

export const UnitInputRow: React.FC<Props> = ({
                                                label, value, onChange,
                                                unit, onUnitPress,
                                                extraValue = '', onExtraChange,
                                                extraPlaceholder = '', showExtra = false,
                                                testID, inputId = label, extraInputId,
                                              }) => {
  const { activeInput, setActiveInput } = useNumericInput();

  const filter = (txt: string) => txt.replace(/[^0-9./ ]/g, '');

  // Open numeric pad for the selected input
  const openPad = (which: 'main' | 'extra') => {
    const targetInputId = which === 'main' ? inputId : extraInputId || `${inputId}-extra`;
    setActiveInput(targetInputId);
  };

  // Determine if this input row has the active numeric pad
  const isMainActive = activeInput === inputId;
  const isExtraActive = activeInput === extraInputId || activeInput === `${inputId}-extra`;

  return (
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.ctrl}>
          <TouchableOpacity
              style={[styles.input, isMainActive && styles.activeInput]}
              onPress={() => openPad('main')}
              testID={testID}
              activeOpacity={0.7}
          >
            <Text style={value ? styles.text : styles.place}>{value || 'Enter'}</Text>
          </TouchableOpacity>

          {showExtra && (
              <TouchableOpacity
                  style={[
                    styles.input,
                    styles.extra,
                    isExtraActive && styles.activeInput
                  ]}
                  onPress={() => openPad('extra')}
                  activeOpacity={0.7}
              >
                <Text style={extraValue ? styles.text : styles.place}>
                  {extraValue || extraPlaceholder}
                </Text>
              </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.unit} onPress={onUnitPress}>
            <Text style={styles.unitText}>{unitShortLabels[unit] || unit}</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  row: { marginBottom:16 },
  label: { fontSize:16, marginBottom:6, color:'#333' },
  ctrl: { flexDirection:'row', alignItems:'center' },
  input: {
    flex:1, height:44, borderWidth:1, borderColor:'#ccc',
    borderRadius:8, justifyContent:'center', paddingHorizontal:12,
    backgroundColor:'#fafafa', marginRight:8,
  },
  activeInput: {
    borderColor: '#3B68FC',
    backgroundColor: '#f0f7ff',
  },
  extra: { marginRight:8 },
  text: { fontSize:16, color:'#222' },
  place:{ fontSize:16, color:'#aaa' },
  unit:{ width:70, height:44, borderWidth:1,borderColor:'#ccc',
    borderRadius:8,backgroundColor:'#fafafa',alignItems:'center',
    justifyContent:'center'
  },
  unitText:{ fontSize:13, color:'#3B68FC',fontWeight:'500' },
  pad:{ marginTop:12, alignItems:'center' },
  done:{ marginTop:8,padding:8,backgroundColor:'#007aff',borderRadius:6 },
  doneText:{ color:'#fff', fontSize:16 },
});
