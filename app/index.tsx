import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
//import Auth from "../components/Auth";
//import Account from "../components/Account";
import { Session } from "@supabase/supabase-js";
import { router } from "expo-router";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  console.log("Index");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/(tabs)/grocery");
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.push("/(tabs)/grocery");
      } else {
        router.push("/login");
      }
    });
  }, []);
}
