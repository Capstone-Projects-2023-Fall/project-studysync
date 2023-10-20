async function addItemToArrayField(db, itemToAdd, collectionToAdd, singleName) {
    const userRef = doc(db, collectionToAdd, userId);
    try {
      await updateDoc(userRef, {
        followers: arrayUnion(itemToAdd)
      });
    } catch (error) {
      console.error(`Error adding new follower${singleName}`);
      throw error
    }
  }
  
  async function removeItemArrayField(uuid, itemToRemove, collectionToAdd, singleName){
    const ref = doc(db, collectionToAdd, uuid);
    try {
        await updateDoc(ref, {
            followers: arrayRemove(itemToRemove)
        });
    } catch (error) {
      console.error(`Error removing ${singleName}`);
      throw error
    }
  }