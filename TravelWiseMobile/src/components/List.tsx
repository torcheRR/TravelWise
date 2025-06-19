import React from "react";
import {
  FlatList,
  FlatListProps,
  StyleSheet,
  View,
  ViewProps,
} from "react-native";
import Separator from "./Separator";

type ListProps<T> = Omit<FlatListProps<T>, "ItemSeparatorComponent"> & {
  containerStyle?: ViewProps["style"];
  showSeparator?: boolean;
  separatorColor?: string;
};

export default function List<T>({
  containerStyle,
  showSeparator = true,
  separatorColor,
  ...props
}: ListProps<T>) {
  return (
    <View style={[styles.container, containerStyle]}>
      <FlatList
        {...props}
        ItemSeparatorComponent={
          showSeparator ? () => <Separator color={separatorColor} /> : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
