import { supabase } from "@/app/lib/supabase";

// Function to fetch the user's ID from Supabase
export const fetchUserID = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Error fetching session:", error);
      return null;
    }

    const user = data.session?.user;

    if (user) {
      console.log("UserID:", user.id);
      return user.id;
    } else {
      console.log("No user found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
