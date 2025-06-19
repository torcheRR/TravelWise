import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ViewProps,
} from 'react-native';
import Slider as RNSlider from '@react-native-community/slider';

type SliderProps = ViewProps & {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  label?: string;
  disabled?: boolean;
  showValue?: boolean;
};

export default function Slider({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  label,
  disabled = false,
  showValue = true,
  style,
  ...props
}: SliderProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[
            styles.label,
            disabled && styles.disabledLabel,
          ]}>
            {label}
          </Text>
          {showValue && (
            <Text style={[
              styles.value,
              disabled && styles.disabledLabel,
            ]}>
              {value}
            </Text>
          )}
        </View>
      )}
      <RNSlider
        value={value}
        onValueChange={onValueChange}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        disabled={disabled}
        minimumTrackTintColor="#f4511e"
        maximumTrackTintColor="#ddd"
        thumbTintColor="#f4511e"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#333',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  disabledLabel: {
    color: '#999',
  },
}); 