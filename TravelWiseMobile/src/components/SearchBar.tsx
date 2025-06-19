import React from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';
import Icon from './Icon';

type SearchBarProps = TextInputProps & {
  containerStyle?: ViewProps['style'];
  onClear?: () => void;
};

export default function SearchBar({
  containerStyle,
  onClear,
  style,
  ...props
}: SearchBarProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Icon name="search" size={20} color="#666" style={styles.icon} />
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor="#999"
        {...props}
      />
      {props.value ? (
        <TouchableOpacity onPress={onClear}>
          <Icon name="close-circle" size={20} color="#666" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 0,
  },
}); 