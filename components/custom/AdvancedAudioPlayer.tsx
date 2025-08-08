import * as FileSystem from "expo-file-system";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { PlayerControls } from "./PlayerControls";
import { DeleteButton } from "./DeleteButton";
import { DownloadButton } from "./DownloadButton";
import { Audio } from "expo-av";

const audioSources = [
  {
    bitrate: "Низкое",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
    id: "track_15",
  },
  {
    bitrate: "Среднее",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    id: "track_1",
  },
  {
    bitrate: "Высокое",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    id: "track_8",
  },
];

export default function AdvancedAudioPlayer() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(audioSources[1]);
  const [downloadedTracks, setDownloadedTracks] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const checkDownloads = async () => {
      const downloads: Record<string, string> = {};
      for (const source of audioSources) {
        const fileUri = FileSystem.documentDirectory + `${source.id}.mp3`;
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (fileInfo.exists) {
          downloads[source.id] = fileUri;
        }
      }
      setDownloadedTracks(downloads);
    };
    checkDownloads();
  }, []);

  useEffect(() => {
    return () => {
      sound?.unloadAsync();
    };
  }, [sound]);

  const playSound = async (source: any) => {
    if (sound) {
      await sound.unloadAsync();
    }
    const localUri = downloadedTracks[source.id];
    const sourceUri = localUri || source.url;

    console.log(`Загрузка с ${localUri ? "устройства" : "интернета"}`);
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: sourceUri },
        { shouldPlay: true }
      );
      setSound(newSound);
      setIsPlaying(true);
      setCurrentTrack(source);
    } catch (error) {
      console.error("Ошибка загрузки аудио:", error);
      Alert.alert("Ошибка", "Не удалось воспроизвести трек.");
    }
  };

  const togglePlayPause = async () => {
    if (!sound) {
      playSound(currentTrack);
      return;
    }
    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    }
  };

  const switchBitrate = (newSource: any) => {
    if (currentTrack.id === newSource.id) return;
    playSound(newSource);
  };

  const downloadTrack = async (source: any) => {
    if (downloadedTracks[source.id]) {
      Alert.alert("Трек уже скачан");
      return;
    }
    try {
      const localUri = FileSystem.documentDirectory + `${source.id}.mp3`;
      const { uri } = await FileSystem.downloadAsync(source.url, localUri);
      setDownloadedTracks((prev) => ({ ...prev, [source.id]: uri }));
      Alert.alert("Успех", "Трек скачан на устройство!");
    } catch (error) {
      console.error("Ошибка скачивания:", error);
      Alert.alert("Ошибка", "Не удалось скачать трек.");
    }
  };

  const deleteTrack = (source: any) => {
    const localUri = downloadedTracks[source.id];
    if (!localUri) return;

    Alert.alert("Удалить трек", `Вы уверены?`, [
      { text: "Отмена", style: "cancel" },
      {
        text: "Удалить",
        style: "destructive",
        onPress: async () => {
          try {
            await FileSystem.deleteAsync(localUri);
            setDownloadedTracks((prev) => {
              const newDownloads = { ...prev };
              delete newDownloads[source.id];
              return newDownloads;
            });
            Alert.alert("Успех", "Трек удален.");
          } catch (error) {
            console.error("Ошибка удаления:", error);
            Alert.alert("Ошибка", "Не удалось удалить трек.");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Аудиоплеер</Text>
      <Text style={styles.trackInfo}>
        Текущее качество: {currentTrack.bitrate}
      </Text>

      <PlayerControls
        isPlaying={isPlaying}
        onPlayPause={togglePlayPause}
        onStop={stopSound}
      />

      <View style={styles.bitrateSelector}>
        <Text style={styles.bitrateTitle}>Список треков:</Text>
        {audioSources.map((source) => (
          <View key={source.id} style={styles.trackContainer}>
            <Text
              style={[
                styles.trackTitle,
                currentTrack.id === source.id && styles.activeTrackTitle,
              ]}
              onPress={() => switchBitrate(source)}
            >
              {source.bitrate} качество
            </Text>

            <View style={styles.iconContainer}>
              {downloadedTracks[source.id] ? (
                <DeleteButton onPress={() => deleteTrack(source)} />
              ) : (
                <DownloadButton onPress={() => downloadTrack(source)} />
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  trackInfo: {
    fontSize: 16,
    color: "#555",
    marginBottom: 40,
  },
  bitrateSelector: {
    alignItems: "center",
    width: "100%",
    marginTop: 40,
  },
  bitrateTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  trackContainer: {
    marginVertical: 8,
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  activeTrackTitle: {
    color: "royalblue",
    fontWeight: "bold",
  },
  iconContainer: {
    minWidth: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
