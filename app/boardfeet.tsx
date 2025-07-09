import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Keyboard
} from 'react-native';
import { Collapsible } from '../components/Collapsible';
import { UnitInputRow, NumericInputProvider, useNumericInput } from '../components/UnitInputRow';
import { calculateBoardFeet, Unit } from '../utils/boardfeet';
import { CostSection } from '../components/CostSection';
import { sanitizeNumberInput } from '../utils/validation';
import KeypadPortal from '../components/KeypadPortal';

// Unit option constants
const unitOptions = [
  { label: 'Millimeters', value: 'mm' },
  { label: 'Centimeters', value: 'cm' },
  { label: 'Meters', value: 'm' },
  { label: 'Inches', value: 'in' },
  { label: 'Feet', value: 'ft' },
  { label: 'Feet & Inch', value: 'ftin' },
  { label: 'Meters & Centimeters', value: 'mcm' },
];

const thicknessUnitOptions = [
  { label: 'Millimeters', value: 'mm' },
  { label: 'Centimeters', value: 'cm' },
  { label: 'Inches', value: 'in' },
];

// Types for input handlers and calculator content props
type InputHandler = {
  inputId: string;
  value: string;
  onChange: (val: string) => void;
};

type PickerType = 'thickness' | 'width' | 'length' | null;

interface CalculatorContentProps {
  thickness: string;
  thicknessUnit: Unit;
  width: string;
  widthUnit: Unit;
  length: string;
  lengthUnit: Unit;
  lengthExtra: string;
  widthExtra: string;
  result: number | null;
  error: string | null;
  price: string;
  totalCost: number | null;
  showCost: boolean;
  handleThicknessChange: (val: string) => void;
  handleWidthChange: (val: string) => void;
  handleWidthExtraChange: (val: string) => void;
  handleLengthChange: (val: string) => void;
  handleLengthExtraChange: (val: string) => void;
  handlePriceChange: (val: string) => void;
  handleCalculate: () => void;
  openPicker: (type: 'thickness' | 'width' | 'length') => void;
  pickerVisible: PickerType;
  tempUnit: string;
  cancelPicker: () => void;
  selectUnit: (val: string) => void;
  setShowCost: (show: boolean) => void;
}

export default function BoardFootCalculator() {
  // State management
  const [thickness, setThickness] = useState('');
  const [thicknessUnit, setThicknessUnit] = useState<Unit>('in');
  const [width, setWidth] = useState('');
  const [widthUnit, setWidthUnit] = useState<Unit>('in');
  const [length, setLength] = useState('');
  const [lengthUnit, setLengthUnit] = useState<Unit>('ftin');
  const [lengthExtra, setLengthExtra] = useState('');
  const [widthExtra, setWidthExtra] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pickerVisible, setPickerVisible] = useState<PickerType>(null);
  const [tempUnit, setTempUnit] = useState<string>('');
  const [showCost, setShowCost] = useState(false);
  const [price, setPrice] = useState('');
  const [totalCost, setTotalCost] = useState<number | null>(null);

  // Input filtering function
  const filter = useCallback((txt: string) => txt.replace(/[^0-9./ ]/g, ''), []);

  // Input handlers
  const handleThicknessChange = useCallback((val: string) => setThickness(filter(val)), [filter]);
  const handleWidthChange = useCallback((val: string) => setWidth(filter(val)), [filter]);
  const handleWidthExtraChange = useCallback((val: string) => setWidthExtra(filter(val)), [filter]);
  const handleLengthChange = useCallback((val: string) => setLength(filter(val)), [filter]);
  const handleLengthExtraChange = useCallback((val: string) => setLengthExtra(filter(val)), [filter]);
  const handlePriceChange = useCallback((val: string) => setPrice(filter(val)), [filter]);

  // Calculate total cost when result or price changes
  useEffect(() => {
    if (result !== null && price !== '' && !isNaN(Number(price))) {
      setTotalCost(Number(price) * result);
    } else {
      setTotalCost(null);
    }
  }, [price, result]);

  // Calculate board feet
  const handleCalculate = () => {
    Keyboard.dismiss();
    setError(null);

    // Sanitize inputs
    const t = sanitizeNumberInput(thickness.replace(',', '.'));
    const w = sanitizeNumberInput(width.replace(',', '.'));
    const lMain = sanitizeNumberInput(length.replace(',', '.'));
    const lExtra = sanitizeNumberInput(lengthExtra.replace(',', '.'));
    const wExtra = sanitizeNumberInput(widthExtra.replace(',', '.'));

    // Validate inputs
    if (t <= 0 || w <= 0) {
      setResult(null);
      setError('Please enter valid positive numbers for thickness and width.');
      return;
    }

    if ((lengthUnit === 'ftin' || lengthUnit === 'mcm') && (lMain < 0 || lExtra < 0)) {
      setResult(null);
      setError('Please enter valid non-negative numbers for length and extra part.');
      return;
    }

    if (!(lengthUnit === 'ftin' || lengthUnit === 'mcm') && (lMain <= 0)) {
      setResult(null);
      setError('Please enter a valid positive length.');
      return;
    }

    // Calculate board feet
    const calculated = calculateBoardFeet(
      t,
      thicknessUnit,
      w,
      widthUnit,
      wExtra,
      lMain,
      lengthUnit,
      lExtra
    );

    setResult(calculated);
  };

  // Unit picker handlers
  const openPicker = (type: 'thickness' | 'width' | 'length') => {
    setPickerVisible(type);
    if (type === 'thickness') setTempUnit(thicknessUnit);
    if (type === 'width') setTempUnit(widthUnit);
    if (type === 'length') setTempUnit(lengthUnit);
  };

  const selectUnit = (val: string) => {
    if (pickerVisible === 'thickness') setThicknessUnit(val as Unit);
    if (pickerVisible === 'width') setWidthUnit(val as Unit);
    if (pickerVisible === 'length') setLengthUnit(val as Unit);
    setPickerVisible(null);
  };

  const cancelPicker = () => {
    setPickerVisible(null);
  };

  return (
    <NumericInputProvider>
      <CalculatorContent
        thickness={thickness}
        thicknessUnit={thicknessUnit}
        width={width}
        widthUnit={widthUnit}
        length={length}
        lengthUnit={lengthUnit}
        lengthExtra={lengthExtra}
        widthExtra={widthExtra}
        result={result}
        error={error}
        price={price}
        totalCost={totalCost}
        showCost={showCost}
        handleThicknessChange={handleThicknessChange}
        handleWidthChange={handleWidthChange}
        handleWidthExtraChange={handleWidthExtraChange}
        handleLengthChange={handleLengthChange}
        handleLengthExtraChange={handleLengthExtraChange}
        handlePriceChange={handlePriceChange}
        handleCalculate={handleCalculate}
        openPicker={openPicker}
        pickerVisible={pickerVisible}
        tempUnit={tempUnit}
        cancelPicker={cancelPicker}
        selectUnit={selectUnit}
        setShowCost={setShowCost}
      />
    </NumericInputProvider>
  );
}

// Result component to display board feet calculation results
const ResultDisplay = ({ result }: { result: number | null }) => {
  if (result === null) return null;

  return (
    <View style={styles.resultBox}>
      <Text style={styles.resultLabel}>Board Feet</Text>
      <Text style={styles.resultValue}>{parseFloat(result.toPrecision(4))}</Text>
    </View>
  );
};

// Unit picker component
const UnitPicker = ({
  visible,
  options,
  selectedUnit,
  onSelect,
  onCancel
}: {
  visible: boolean;
  options: Array<{ label: string; value: string }>;
  selectedUnit: string;
  onSelect: (val: string) => void;
  onCancel: () => void;
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableOpacity style={styles.pickerOverlay} activeOpacity={1} onPress={onCancel}>
        <View style={styles.customPickerModal}>
          <FlatList
            data={options}
            keyExtractor={item => item.value}
            initialScrollIndex={(() => {
              return Math.max(0, options.findIndex(u => u.value === selectedUnit));
            })()}
            getItemLayout={(_, index) => ({length: 48, offset: 48 * index, index})}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.customPickerItem,
                  selectedUnit === item.value && styles.customPickerItemSelected
                ]}
                onPress={() => onSelect(item.value)}
              >
                <Text style={[
                  styles.customPickerItemText,
                  selectedUnit === item.value && styles.customPickerItemTextSelected
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
            extraData={selectedUnit}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

// Inner component that has access to the numeric input context
function CalculatorContent({
  thickness,
  thicknessUnit,
  width,
  widthUnit,
  length,
  lengthUnit,
  lengthExtra,
  widthExtra,
  result,
  error,
  price,
  totalCost,
  showCost,
  handleThicknessChange,
  handleWidthChange,
  handleWidthExtraChange,
  handleLengthChange,
  handleLengthExtraChange,
  handlePriceChange,
  handleCalculate,
  openPicker,
  pickerVisible,
  tempUnit,
  cancelPicker,
  selectUnit,
  setShowCost,
}: CalculatorContentProps) {
  // Get the current active input from context
  const { activeInput, setActiveInput } = useNumericInput();

  // Define all input handlers that will be passed to the shared keypad
  const inputHandlers = [
    { inputId: 'Thickness', value: thickness, onChange: handleThicknessChange },
    { inputId: 'Width', value: width, onChange: handleWidthChange },
    { inputId: 'Width-extra', value: widthExtra, onChange: handleWidthExtraChange },
    { inputId: 'Length', value: length, onChange: handleLengthChange },
    { inputId: 'Length-extra', value: lengthExtra, onChange: handleLengthExtraChange },
    // Remove Price from custom keypad handlers
  ].filter(handler => handler.inputId === activeInput);

  // Handler to close the keypad when tapping anywhere except inputs and the keypad
  const handleBackgroundPress = () => {
    if (activeInput) {
      setActiveInput(null);
    }
  };

  return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Board Feet Calculator</Text>

          {/* Input Fields */}
          <UnitInputRow
            label="Thickness"
            inputId="Thickness"
            value={thickness}
            onChange={handleThicknessChange}
            unit={thicknessUnit}
            onUnitPress={() => openPicker('thickness')}
          />

          <UnitInputRow
            label="Width"
            inputId="Width"
            value={width}
            onChange={handleWidthChange}
            unit={widthUnit}
            onUnitPress={() => openPicker('width')}
            showExtra={widthUnit === 'ftin' || widthUnit === 'mcm'}
            extraValue={widthExtra}
            onExtraChange={handleWidthExtraChange}
            extraPlaceholder={widthUnit === 'ftin' ? 'Inches' : 'Centimeters'}
            extraInputId="Width-extra"
          />

          <UnitInputRow
            label="Length"
            inputId="Length"
            value={length}
            onChange={handleLengthChange}
            unit={lengthUnit}
            onUnitPress={() => openPicker('length')}
            showExtra={lengthUnit === 'ftin' || lengthUnit === 'mcm'}
            extraValue={lengthExtra}
            onExtraChange={handleLengthExtraChange}
            extraPlaceholder={lengthUnit === 'ftin' ? 'Inches' : 'Centimeters'}
            extraInputId="Length-extra"
          />

          {/* Calculate Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleCalculate}>
              <Text style={styles.primaryButtonText}>Calculate</Text>
            </TouchableOpacity>
          </View>

          {/* Cost Section */}
          <Collapsible title="Cost" onToggle={() => setShowCost(!showCost)}>
            <View style={styles.costSectionContainer}>
              <CostSection
                price={price}
                onPriceChange={handlePriceChange}
                totalCost={totalCost}
                inputId="Price"
              />
            </View>
          </Collapsible>

          {/* Error Message */}
          {error && <Text style={styles.error}>{error}</Text>}
        </View>

        {/* Unit Picker Modal */}
        <UnitPicker
          visible={pickerVisible !== null}
          options={pickerVisible === 'thickness' ? thicknessUnitOptions : unitOptions}
          selectedUnit={tempUnit}
          onSelect={selectUnit}
          onCancel={cancelPicker}
        />

        {/* Result Display */}
        <ResultDisplay result={result} />

        <Text style={styles.formula}>
          Formula: (Thickness in in × Width in in × Length in ft) ÷ 12
        </Text>

        {/* Add KeypadPortal component to render the custom keypad */}
        <KeypadPortal inputHandlers={inputHandlers} />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#eef2f7',
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    marginTop: 32,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  buttonContainer: {
    marginVertical: 16,
  },
  primaryButton: {
    backgroundColor: 'rgb(59, 104, 252)',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginTop: 16,
    textAlign: 'center',
  },
  formula: {
    marginTop: 12,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  resultBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
    maxWidth: 360,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  resultLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'rgb(59, 104, 252)',
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customPickerModal: {
    width: 300,
    maxHeight: 300,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  customPickerItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  customPickerItemSelected: {
    backgroundColor: 'rgba(59, 104, 252, 0.1)',
  },
  customPickerItemText: {
    fontSize: 16,
    color: '#333',
  },
  customPickerItemTextSelected: {
    color: 'rgb(59, 104, 252)',
    fontWeight: 'bold',
  },
  costSectionContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
});
