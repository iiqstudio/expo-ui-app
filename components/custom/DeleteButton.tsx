import { default as VectorIcon } from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  type TouchableOpacityProps,
} from "react-native";

type DeleteButtonProps = {
  onPress: TouchableOpacityProps["onPress"];
  size?: number;
  color?: string;
  style?: TouchableOpacityProps["style"];
};

export function DeleteButton({
  onPress,
  size = 32,
  color = "crimson",
  style,
}: DeleteButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <VectorIcon name="trash-can-outline" size={size} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
});
