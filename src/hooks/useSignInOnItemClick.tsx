import {
  InternetIdentityProvider,
  User,
  authSubscribe,
  signIn,
} from "@junobuild/core-peer";
import { useEffect, useState } from "react";

// Custom hook to handle sign-in logic for all clickable elements
export const useSignInOnItemClick = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const cancelAuthListener = authSubscribe((user: User | null) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });

    return () => {
      cancelAuthListener();
    };
  }, []);

  const [showModal, setShowModal] = useState(false);
  const _signIn = async () => {
    await signIn({
      provider: new InternetIdentityProvider({
        domain: "ic0.app",
      }),
    });
  };

  const handleDocumentClick = (event: any) => {
    // Check if user clicked on a clickable element
    const isButtonClicked =
      event.target.tagName === "BUTTON" || event.target.closest("button");

    if (isButtonClicked && loggedIn === false) {
      event.stopPropagation();
      _signIn();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick, true); // Event capturing
    return () => {
      document.removeEventListener("click", handleDocumentClick, true); // Cleanup
    };
  }, [loggedIn]);

  return { showModal, setShowModal };
};
