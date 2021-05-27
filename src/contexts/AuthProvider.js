import React, { createContext, useContext, useState, useEffect } from "react";
import firebaseApp from "../firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState();
  const [suggestions, setSuggestions] = useState();
  const [photos, setPhotos] = useState([]);

  // function signup(email, password) {
  //   return firebaseApp.auth().createUserWithEmailAndPassword(email, password);
  // }

  function login(email, password) {
    return firebaseApp.auth().signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return firebaseApp.auth().signOut();
  }

  const value = {
    photos,
    setPhotos,
    suggestions,
    setSuggestions,
    userInfo,
    setUserInfo,
    currentUser,
    // signup,
    login,
    logout,
  };

  useEffect(() => {
    async function getSuggestions(following, id) {
      let query = firebaseApp.firestore().collection("users");

      // .where("userId", "not in", [...following, id])
      // .get();

      if (following.length > 0) {
        query = query.where("userId", "not-in", [...following, id]);
      } else {
        query = query.where("userId", "!=", id);
      }
      const result = await query.limit(10).get();

      const user = result.docs.map((item) => ({
        ...item.data(),
        docId: item.id,
      }));

      if (user) {
        setSuggestions(user);
      }
    }

    if (userInfo) {
      getSuggestions(userInfo?.following, userInfo?.userId);
    }
  }, [userInfo]);

  useEffect(() => {
    async function runThis() {
      const result = await firebaseApp
        .firestore()
        .collection("photos")
        .where("userId", "in", userInfo.following)
        .get();

      const userTimelinePhotos = result.docs.map((item) => ({
        ...item.data(),
        docId: item.id,
      }));

      const photosWithUserDetails = await Promise.all(
        userTimelinePhotos.map(async (photo) => {
          let liked = false;
          if (photo.likes.includes(userInfo.userId)) {
            liked = true;
          }

          const photoResult = await firebaseApp
            .firestore()
            .collection("users")
            .where("userId", "==", photo.userId)
            .get();
          const user = photoResult?.docs?.map((item) => ({
            ...item.data(),
            docId: item.id,
          }));
          const username = user[0].username;

          return { username, ...photo, liked };
          // setPhotos((photos) => [...photos, { ...photo, liked, username }]);
        })
      );
      return photosWithUserDetails;
    }
    async function runThis2() {
      const followedUserPhotos = await runThis();
      followedUserPhotos.sort((a, b) => b.dateCreated - a.dateCreated);
      setPhotos(followedUserPhotos);
    }
    if (userInfo?.following.length > 0) {
      runThis2();
    }
    // eslint-disable-next-line
  }, [userInfo?.useId, userInfo?.following]);

  useEffect(() => {
    const unsubscribe = firebaseApp.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    async function getUserById(id) {
      const result = await firebaseApp
        .firestore()
        .collection("users")
        .where("userId", "==", id)
        .get();
      const user = result.docs.map((item) => ({
        ...item.data(),
        docId: item.id,
      }));
      setUserInfo(user[0]);
    }
    if (currentUser?.uid) {
      getUserById(currentUser.uid);
    }
    // eslint-disable-next-line
  }, [currentUser]);

  if (loading) return "Loading...";

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
