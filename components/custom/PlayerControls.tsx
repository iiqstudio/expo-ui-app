import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  type ViewStyle,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type PlayerControlsProps = {
  isPlaying: boolean;
  onPlayPause: () => void;
  onStop: () => void;
  style?: ViewStyle;
};

export function PlayerControls({
  isPlaying,
  onPlayPause,
  onStop,
  style,
}: PlayerControlsProps) {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={onStop}>
        <MaterialCommunityIcons
          name="stop-circle-outline"
          size={34}
          color="black"
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={onPlayPause} style={styles.playPauseButton}>
        <AntDesign
          name={isPlaying ? "pausecircle" : "play"}
          size={50}
          color="royalblue"
        />
      </TouchableOpacity>

      <View style={{ width: 34 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "70%",
  },
  playPauseButton: {
    marginHorizontal: 20,
  },
});
