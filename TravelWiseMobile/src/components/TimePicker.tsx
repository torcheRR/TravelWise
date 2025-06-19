import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "./Icon";

type TimePickerProps = ViewProps & {
  value: Date;
  onChange: (date: Date) => void;
  label?: string;
  placeholder?: string;
  format?: string;
};

export default function TimePicker({
  value,
  onChange,
  label,
  placeholder = "Saat Seçin",
  format = "HH:mm",
  style,
  ...props
}: TimePickerProps) {
  const [visible, setVisible] = useState(false);

  const handleChange = (event: any, selectedDate?: Date) => {
    setVisible(false);
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <View style={[styles.container, style]} {...props}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={styles.input} onPress={() => setVisible(true)}>
        <Text style={[styles.text, !value && styles.placeholder]}>
          {value ? formatTime(value) : placeholder}
        </Text>
        <Icon name="time" size={20} color="#666" />
      </TouchableOpacity>

      {visible && (
        <DateTimePicker
          value={value || new Date()}
          mode="time"
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
