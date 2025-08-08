// components/DownloadButton.tsx

import { default as VectorIcon } from "@expo/vector-icons/MaterialCommunityIcons";
import React, { type ComponentProps } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  type TouchableOpacityProps,
} from "react-native";

type IconProps = ComponentProps<typeof VectorIcon>;

type DownloadButtonProps = {
  onPress: TouchableOpacityProps["onPress"];
  size?: number;
  color?: string;
  style?: TouchableOpacityProps["style"];
};

export function DownloadButton({
  onPress,
  size = 32,
  color = "royalblue",
  style,
}: DownloadButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <VectorIcon name="download-circle-outline" size={size} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
});
