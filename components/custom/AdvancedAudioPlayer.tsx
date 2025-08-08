import * as FileSystem from "expo-file-system";
import React, { useEffect, useState } from "react";
import { Alert, Platform, StyleSheet, Text, View } from "react-native";
import { PlayerControls } from "./PlayerControls";
import { DeleteButton } from "./DeleteButton";
import { DownloadButton } from "./DownloadButton";
import { Audio } from "expo-av";

const isWeb = Platform.OS === "web";
const CACHE_NAME = "audio-cache-v1";

type Track = {
  id: string;
  title: string;
  artist: string;
  url: string;
};

const MOCKED_TRACKS: Track[] = [
  {
    id: "track_1",
    title: "Качество 1",
    artist: "W3Schools",
    url: "https://www.w3schools.com/html/horse.mp3",
  },
  {
    id: "track_2",
    title: "Качество 2",
    artist: "Mozilla",
    url: "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3",
  },
  {
    id: "track_3",
    title: "Качество 3",
    artist: "Mozilla",
    url: "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/ticking-clock.mp3",
  },
];

export default function AdvancedAudioPlayer() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(
    MOCKED_TRACKS[0]
  ); // Начинаем с первого трека
  const [downloadedTracks, setDownloadedTracks] = useState<
    Record<string, string | boolean>
  >({});

  // Эффект для первоначальной проверки скачанных файлов/кэша
  useEffect(() => {
    const checkDownloads = async () => {
      const downloads: Record<string, string | boolean> = {};

      if (isWeb) {
        console.log("Проверяю кэш браузера...");
        const cache = await caches.open(CACHE_NAME);

        // 1. Получаем ВСЕ ключи (запросы), которые есть в кэше
        const cachedRequests = await cache.keys();

        // 2. Превращаем их в Set из URL-адресов для быстрой проверки
        const cachedUrls = new Set(cachedRequests.map((req) => req.url));

        console.log("Найденные URL в кэше:", cachedUrls);

        // 3. Теперь проверяем наши треки по этому списку
        for (const track of MOCKED_TRACKS) {
          if (cachedUrls.has(track.url)) {
            console.log(`Трек "${track.title}" найден в кэше!`);
            downloads[track.id] = true;
          }
        }
      } else {
        // Нативная логика остается без изменений
        for (const track of MOCKED_TRACKS) {
          const fileUri = FileSystem.documentDirectory + `${track.id}.mp3`;
          const fileInfo = await FileSystem.getInfoAsync(fileUri);
          if (fileInfo.exists) {
            downloads[track.id] = fileUri;
          }
        }
      }

      setDownloadedTracks(downloads);
    };
    checkDownloads();
  }, []);

  // Эффект для очистки звука при выходе
  useEffect(() => {
    return () => {
      sound?.unloadAsync();
    };
  }, [sound]);

  // --- 4. ОСНОВНАЯ ЛОГИКА ---

  const playSound = async (track: Track) => {
    if (sound) await sound.unloadAsync();

    let sourceUri: string;
    const isDownloaded = !!downloadedTracks[track.id];

    if (isDownloaded) {
      if (isWeb) {
        console.log(`Проверяю кэш для трека "${track.title}"...`);
        const cache = await caches.open(CACHE_NAME);

        // ИСПОЛЬЗУЕМ ОПЦИЮ ignoreSearch ДЛЯ НАДЕЖНОСТИ
        const response = await cache.match(track.url, { ignoreSearch: true });

        if (response) {
          console.log(`Трек найден в кэше. Создаю blob...`);
          const blob = await response.blob();
          sourceUri = URL.createObjectURL(blob);
        } else {
          console.warn(
            `Рассинхронизация: трек "${track.title}" не найден в кэше. Загружаю из сети.`
          );
          sourceUri = track.url;
          setDownloadedTracks((prev) => {
            const newState = { ...prev };
            delete newState[track.id];
            return newState;
          });
        }
      } else {
        console.log(`Загрузка ${track.title} из файловой системы...`);
        sourceUri = downloadedTracks[track.id] as string;
      }
    } else {
      console.log(`Загрузка ${track.title} из интернета...`);
      sourceUri = track.url;
    }

    try {
      const { sound: newSound } = await Audio.Sound.createAsync({
        uri: sourceUri,
      });
      await newSound.playAsync();
      setSound(newSound);
      setIsPlaying(true);
      setCurrentTrack(track);
    } catch (error) {
      console.error("Ошибка воспроизведения:", error);
      Alert.alert("Ошибка", "Не удалось воспроизвести трек.");
    }
  };

  const downloadTrack = async (track: Track) => {
    if (downloadedTracks[track.id])
      return Alert.alert("Уведомление", "Трек уже скачан.");

    if (isWeb) {
      const PROXY_URL = "https://corsproxy.io/?";
      const proxiedUrl = PROXY_URL + encodeURIComponent(track.url);

      try {
        console.log(`Скачиваю через прокси: ${proxiedUrl}`);
        const response = await fetch(proxiedUrl);
        if (!response.ok)
          throw new Error(
            `Сетевой ответ был не в порядке: ${response.statusText}`
          );

        const cache = await caches.open(CACHE_NAME);
        await cache.put(track.url, response.clone());
        console.log("Запись в кэш инициирована.");

        // --- НОВАЯ СУПЕР-НАДЕЖНАЯ ПРОВЕРКА ---
        // Прежде чем обновлять UI, убедимся, что файл реально лежит в кэше
        const check = await cache.match(track.url, { ignoreSearch: true });
        if (check) {
          console.log(
            "ПРОВЕРКА ПРОШЛА: Файл успешно найден в кэше после записи."
          );
          setDownloadedTracks((prev) => ({ ...prev, [track.id]: true }));
          Alert.alert("Успех", "Трек сохранен и готов к работе!");
        } else {
          // Если даже после записи его там нет - это серьезная проблема браузера/среды
          throw new Error(
            "Не удалось верифицировать запись в кэш. Файл не сохранился."
          );
        }
      } catch (error) {
        console.error("ПОЙМАНА ОШИБКА ВНУТРИ downloadTrack:", error);
        Alert.alert(
          "Ошибка",
          "Не удалось сохранить трек. Подробности в консоли."
        );
      }
    } else {
      // Нативная логика не меняется
      try {
        const fileUri = FileSystem.documentDirectory + `${track.id}.mp3`;
        const { uri } = await FileSystem.downloadAsync(track.url, fileUri);
        setDownloadedTracks((prev) => ({ ...prev, [track.id]: uri }));
        Alert.alert("Успех", "Трек скачан на устройство!");
      } catch (error) {
        console.error("Ошибка скачивания:", error);
        Alert.alert("Ошибка", "Не удалось скачать трек.");
      }
    }
  };

  const deleteTrack = async (track: Track) => {
    if (!downloadedTracks[track.id]) return;

    Alert.alert(
      "Удалить трек",
      `Вы уверены, что хотите удалить "${track.title}"?`,
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Удалить",
          style: "destructive",
          onPress: async () => {
            if (isWeb) {
              const cache = await caches.open(CACHE_NAME);
              await cache.delete(track.url);
            } else {
              await FileSystem.deleteAsync(
                downloadedTracks[track.id] as string
              );
            }
            setDownloadedTracks((prev) => {
              const newState = { ...prev };
              delete newState[track.id];
              return newState;
            });
            Alert.alert("Успех", "Трек удален.");
          },
        },
      ]
    );
  };

  // Простые функции управления плеером
  const togglePlayPause = async () => {
    if (!sound) {
      if (currentTrack) playSound(currentTrack);
      return;
    }
    isPlaying ? await sound.pauseAsync() : await sound.playAsync();
    setIsPlaying(!isPlaying);
  };

  const stopSound = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    }
  };

  // --- 5. UI КОМПОНЕНТА ---
  if (!currentTrack) {
    return (
      <View style={styles.container}>
        <Text>Загрузка...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{currentTrack.title}</Text>
      <Text style={styles.trackInfo}>Исполнитель: {currentTrack.artist}</Text>

      <PlayerControls
        isPlaying={isPlaying}
        onPlayPause={togglePlayPause}
        onStop={stopSound}
      />

      <View style={styles.bitrateSelector}>
        <Text style={styles.bitrateTitle}>Список треков:</Text>
        {MOCKED_TRACKS.map((track) => (
          <View key={track.id} style={styles.trackContainer}>
            <Text
              style={[
                styles.trackTitle,
                currentTrack.id === track.id && styles.activeTrackTitle,
              ]}
              onPress={() => playSound(track)}
            >
              {track.title}
            </Text>

            <View style={styles.iconContainer}>
              {downloadedTracks[track.id] ? (
                <DeleteButton onPress={() => deleteTrack(track)} />
              ) : (
                <DownloadButton onPress={() => downloadTrack(track)} />
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
