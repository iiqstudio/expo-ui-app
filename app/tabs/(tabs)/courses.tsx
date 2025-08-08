import {
  connectFunctionsEmulator,
  Functions,
  getFunctions,
  httpsCallable,
} from "firebase/functions";

import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

import {
  Auth,
  connectAuthEmulator,
  getReactNativePersistence,
  initializeAuth,
  signInAnonymously,
} from "firebase/auth";
import {
  ActivityIndicator,
  Alert,
  Button,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";

import { FirebaseApp, initializeApp } from "firebase/app";
import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { HelloWave } from "@/components/HelloWave";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "test-project-2cd7f.firebaseapp.com",
  projectId: "test-project-2cd7f",
  storageBucket: "test-project-2cd7f.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

let app: FirebaseApp;
let auth: Auth;
let functions: Functions;

try {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });

  functions = getFunctions(app, "us-central1");

  const host = Platform.OS === "android" ? "10.0.2.2" : "localhost";
  console.log(`Подключаемся к эмуляторам по адресу: ${host}`);

  connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true });
  connectFunctionsEmulator(functions, host, 5001);
} catch (error) {
  console.error("Критическая ошибка инициализации Firebase:", error);
}

export default function Courses() {
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [error, setError] = useState("");
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (auth) {
      // Чтобы избежать двойного входа при hot-reload
      if (auth.currentUser) {
        setIsAuth(true);
        console.log("Пользователь уже авторизован. UID:", auth.currentUser.uid);
        return;
      }

      signInAnonymously(auth)
        .then((userCredential) => {
          setIsAuth(true);
          console.log(
            "Пользователь успешно анонимно авторизован. UID:",
            userCredential.user.uid
          );
        })
        .catch((e) => {
          const errorMessage =
            "Ошибка анонимной аутентификации. Убедитесь, что эмулятор Auth запущен.";
          console.error(errorMessage, e);
          setError(errorMessage);
          Alert.alert("Ошибка аутентификации", e.message);
        });
    }
  }, []);

  // Этот обработчик также написан правильно.
  const handleGetAudioLink = async () => {
    setLoading(true);
    setError("");
    setAudioUrl("");

    try {
      if (!auth.currentUser) {
        throw new Error(
          "Критическая ошибка: Попытка вызова функции без пользователя на клиенте!"
        );
      }

      console.log(
        `Вызов функции от имени пользователя ${auth.currentUser.uid} через httpsCallable...`
      );

      const getAudioLinkCallable = httpsCallable(functions, "getAudioLink");
      const result: any = await getAudioLinkCallable();
      const data = result.data;

      if (data.success && data.url) {
        console.log("УСПЕХ! Функция выполнена, получен URL:", data.url);
        setAudioUrl(data.url);
      } else {
        throw new Error(
          data.error ||
            "Ответ от сервера не содержит URL или флаг success=false"
        );
      }
    } catch (e: any) {
      console.error("ОШИБКА при вызове функции:", e);
      setError(
        "Не удалось получить данные. Проверьте логи эмулятора функций на наличие ошибок."
      );
      Alert.alert("Ошибка вызова функции", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Тест Cloud Function</ThemedText>
        <ThemedText>
          {isAuth
            ? "Вы авторизованы анонимно. Готово к тесту!"
            : "Идет анонимная авторизация..."}
        </ThemedText>
        <ThemedText>
          Нажмите на кнопку, чтобы вызвать локальную функцию и получить ссылку.
        </ThemedText>

        <Button
          title={loading ? "Загрузка..." : "Получить ссылку на аудио"}
          onPress={handleGetAudioLink}
          disabled={loading || !isAuth}
        />

        {loading && (
          <ActivityIndicator
            size="large"
            style={{ margin: 20 }}
            color="#0000ff"
          />
        )}

        {audioUrl ? (
          <ThemedView style={styles.resultContainer}>
            <ThemedText type="defaultSemiBold">Успех! Ссылка:</ThemedText>
            <ThemedText style={styles.linkText} selectable={true}>
              {audioUrl}
            </ThemedText>
          </ThemedView>
        ) : null}

        {error ? (
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        ) : null}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  stepContainer: { gap: 8, marginBottom: 8 },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  resultContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "rgba(34, 139, 34, 0.1)",
    borderColor: "forestgreen",
    borderWidth: 1,
    borderRadius: 5,
  },
  linkText: { color: "#0000ff", marginTop: 5, fontFamily: "monospace" },
  errorText: {
    marginTop: 15,
    padding: 10,
    color: "#D8000C",
    backgroundColor: "#FFD2D2",
    borderColor: "#D8000C",
    borderWidth: 1,
    borderRadius: 5,
  },
});
