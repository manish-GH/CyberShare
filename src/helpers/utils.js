import firebaseApp from "../firebase";

export function updateUserProfile(
  userInfo,
  currentUser,
  setUserInfo,
  setSuggestions,
  setPhotos
) {
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

  async function getSuggestions(following, id) {
    let query = firebaseApp.firestore().collection("users");

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
  return console.log("done");
}
