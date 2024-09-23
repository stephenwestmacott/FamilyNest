import "react-native-url-polyfill/auto";
import { useEffect } from "react";
import { supabase } from "./lib/supabase";
import { router } from "expo-router";

export default function App() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/(drawer)/(tabs)/grocery");
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.push("/(drawer)/(tabs)/grocery");
      } else {
        router.replace("/(auth)/login");
      }
    });
  }, []);
}
