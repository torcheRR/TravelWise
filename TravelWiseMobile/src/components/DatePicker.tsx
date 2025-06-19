import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "./Icon";

type DatePickerProps = ViewProps & {
  value: Date;
  onChange: (date: Date) => void;
  label?: string;
  placeholder?: string;
  format?: string;
};

export default function DatePicker({
  value,
  onChange,
  label,
  placeholder = "Tarih Seçin",
  format = "dd.MM.yyyy",
  style,
  ...props
}: DatePickerProps) {
  const [visible, setVisible] = useState(false);

  const handleChange = (event: any, selectedDate?: Date) => {
    setVisible(false);
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <View style={[styles.container, style]} {...props}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={styles.input} onPress={() => setVisible(true)}>
        <Text style={[styles.text, !value && styles.placeholder]}>
          {value ? formatDate(value) : placeholder}
        </Text>
        <Icon name="calendar" size={20} color="#666" />
      </TouchableOpacity>

      {visible && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
  placeholder: {
    color: "#999",
  },
});
