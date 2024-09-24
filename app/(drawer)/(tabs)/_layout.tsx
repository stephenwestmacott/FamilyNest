import React, { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { supabase } from "../../lib/supabase";
import { Alert } from "react-native";

type User = {
  id: string;
  email?: string;
};

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser({
          id: user.id,
          email: user.email || "",
        });
      } else {
        Alert.alert("Error Accessing User");
      }
    });
  }, []);

  console.log("TabLayout");

  // print user id
  if (user) {
    console.log(user.id);
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#e8b9b4",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="todo"
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="list-ul" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="grocery"
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="shopping-cart" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="finances"
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="dollar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="documents"
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="files-o" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
