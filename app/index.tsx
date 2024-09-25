import "react-native-url-polyfill/auto";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { router } from "expo-router";

export default function App() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/(drawer)/(tabs)/grocery");
      }
    });

    // Redirect to sign in page if user does not have a session
    supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/(auth)/signin");
      } else {
        router.replace("/(drawer)/(tabs)/grocery");
      }
    });
  }, []);
}
