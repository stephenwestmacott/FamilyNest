import React, { useEffect } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { router } from "expo-router";
import { supabase } from "../../lib/supabase";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

const TabLayout = () => {
  useEffect(() => {
    const checkFamilyMembership = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (session) {
          const { data, error } = await supabase
            .from("ProfileFamilyJunction")
            .select()
            .eq("profile_id", session.user.id);

          if (error) {
            console.log("error", error);
          } else {
            if (data.length === 0) {
              router.replace("/(family)/setup");
            }
          }
        }
      } catch (error) {
        console.error("Error checking family membership:", error);
      }
    };

    checkFamilyMembership();
  }, []);

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
};

export default TabLayout;
