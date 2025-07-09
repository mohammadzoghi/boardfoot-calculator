import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

interface CostSectionProps {
  price: string;
  onPriceChange: (val: string) => void;
  totalCost: number | null;
  inputId?: string;
}

export const CostSection: React.FC<CostSectionProps> = ({
  price,
  onPriceChange,
  totalCost,
  inputId = 'Price'
}) => {
  // Filter input to only allow numbers and decimal point
  const handleTextChange = (text: string) => {
    // Only allow numbers and at most one decimal point
    const filtered = text.replace(/[^0-9.]/g, '');

    // Ensure there's only one decimal point
    const parts = filtered.split('.');
    if (parts.length > 2) {
      // If multiple decimal points, keep only the first one
      const result = parts[0] + '.' + parts.slice(1).join('');
      onPriceChange(result);
    } else {
      onPriceChange(filtered);
    }
  };

  return (
    <>
      <View style={styles.costInputRow}>
        <View style={styles.costInputContainer}>
          <Text style={styles.costPrefix}>$</Text>
          <TextInput
            style={styles.costInputText}
            value={price}
            onChangeText={handleTextChange}
            placeholder="Price"
            placeholderTextColor="#aaa"
            keyboardType="decimal-pad"
            returnKeyType="done"
          />
          <Text style={styles.costSuffix}>/board foot</Text>
        </View>
      </View>
      {totalCost !== null && (
        <Text style={styles.totalCostText}>
          Total Cost: <Text style={styles.totalCostValue}>${totalCost.toFixed(2)}</Text>
        </Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  costInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  costInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 10,
    flex: 1,
  },
  costPrefix: {
    fontSize: 18,
    color: '#3B68FC',
    fontWeight: 'bold',
    marginRight: 4,
  },
  costInputText: {
    flex: 1,
    fontSize: 16,
    color: '#222',
  },
  costSuffix: {
    fontSize: 15,
    color: '#888',
    marginLeft: 4,
  },
  totalCostText: {
    marginTop: 8,
    fontSize: 16,
    color: '#333',
    textAlign: 'left',
  },
  totalCostValue: {
    color: '#3B68FC',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
