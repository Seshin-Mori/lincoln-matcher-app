import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export const useUserIdentifier = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (storedId) {
      setUserId(storedId);
    } else {
      const newId = uuidv4();
      localStorage.setItem("userId", newId);
      setUserId(newId);
    }
  }, []);

  return userId;
};