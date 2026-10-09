import { isApiError } from "@apixa/core";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { api, type User } from "./src/api";

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setError(null);
    try {
      setUsers(await api.users.getAll());
    } catch (err) {
      setError(
        isApiError(err)
          ? `${err.name}: ${err.message}. Start the FastAPI backend on :8787.`
          : "Failed to load users",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onCreate() {
    setError(null);
    try {
      await api.users.create({ name, email });
      setName("");
      setEmail("");
      await load();
    } catch (err) {
      setError(isApiError(err) ? err.message : "Create failed");
    }
  }

  async function onDelete(id: string) {
    setError(null);
    try {
      await api.users.delete(id);
      await load();
    } catch (err) {
      setError(isApiError(err) ? err.message : "Delete failed");
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>Apixa · React Native</Text>
        <Text style={styles.title}>Typed client on device</Text>
        <Text style={styles.lede}>
          Same defineApi client as the web examples, via Expo + Fetch.
        </Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {loading ? <ActivityIndicator color="#0f6e56" /> : null}

        {users.map((user) => (
          <View key={user.id} style={styles.card}>
            <View style={styles.cardBody}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.meta}>
                {user.email} · {user.id}
              </Text>
            </View>
            <Pressable style={styles.secondaryBtn} onPress={() => void onDelete(user.id)}>
              <Text style={styles.secondaryBtnText}>Delete</Text>
            </Pressable>
          </View>
        ))}

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Name"
            placeholderTextColor="#8a9aa5"
          />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#8a9aa5"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Pressable style={styles.primaryBtn} onPress={() => void onCreate()}>
            <Text style={styles.primaryBtnText}>Create</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f4f6f8" },
  container: { padding: 20, gap: 12 },
  eyebrow: {
    color: "#0f6e56",
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontSize: 12,
  },
  title: { fontSize: 28, fontWeight: "700", color: "#14212b" },
  lede: { color: "#5b6b76", marginBottom: 8 },
  error: {
    backgroundColor: "#fde8e8",
    color: "#9b2c2c",
    padding: 12,
    borderRadius: 10,
    overflow: "hidden",
  },
  card: {
    backgroundColor: "#fff",
    borderColor: "#d7e0e7",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardBody: { flex: 1 },
  name: { fontWeight: "700", color: "#14212b" },
  meta: { color: "#5b6b76", marginTop: 2 },
  form: {
    marginTop: 8,
    backgroundColor: "#fff",
    borderColor: "#d7e0e7",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d7e0e7",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#14212b",
  },
  primaryBtn: {
    backgroundColor: "#0f6e56",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "700" },
  secondaryBtn: {
    backgroundColor: "#e6f4ef",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  secondaryBtnText: { color: "#0f6e56", fontWeight: "700" },
});
