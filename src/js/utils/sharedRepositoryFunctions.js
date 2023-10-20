import {collection, getDocs, getDoc, deleteDoc, doc, updateDoc, arrayRemove, arrayUnion} from 'firebase/firestore';

export async function addItemToArrayField(db, uuid, itemToAdd, collectionToAdd, fieldToAddTo, singleName) {
    const itemRef = doc(db, collectionToAdd, uuid);
    try {
      const fieldToUpdate = {};
      fieldToUpdate[fieldToAddTo] = arrayUnion(itemToAdd);
      await updateDoc(itemRef,fieldToUpdate);
    } catch (error) {
      console.error(`Error adding new follower${singleName}`);
      throw error
    }
  }
  
  export async function removeItemFromArrayField(db, uuid, itemToRemove, collectionToAdd, fieldToAddTo, singleName){
    const itemRef = doc(db, collectionToAdd, uuid);
    try {
      const fieldToUpdate = {};
      fieldToUpdate[fieldToAddTo] = arrayRemove(itemToRemove);
      await updateDoc(itemRef,fieldToUpdate);
    } catch (error) {
      console.error(`Error removing ${singleName}`);
      throw error
    }
  }

  export async function setField(db, uuid, collectionToAdd, field, value) {
    const itemRef = doc(db, collectionToAdd, uuid);
    try {
      const dataToUpdate = {};
      dataToUpdate[field] = value;
      await updateDoc(itemRef, dataToUpdate);
    } catch (error) {
      console.error(`Error setting the field ${field} in the ${collectionToAdd} collection`);
      throw error;
    }
  }

  export async function getItemById(db, uuid, collectionToAdd, singleName) {
    try {
      const ref= doc(db, collectionToAdd, uuid);
      const item = await getDoc(ref);
      if (!item.exists()) {
        return `{singleName} with id ${uuid} does not exist`;
      }
      return item.data();
    } catch (error) {
      console.error(`Error getting ${singleName} with id ${uuid}`);
      throw error
    }
  }

  export async function removeDocumentFromCollection(db, documentId, collectionToRemove, singleName) {
    const docRef = doc(db, collectionToRemove, documentId);
    try {
      // Delete the Firestore document
      await deleteDoc(docRef);
      console.log(`Successfully removed ${singleName} with ID: ${documentId} from collection ${collectionToRemove}`);
    } catch (error) {
      console.error(`Error removing ${singleName} with ID: ${documentId} from collection ${collectionToRemove}: ${error}`);
      throw error;
    }
  }


  export async function getAllItems(db, collectionName, dataConverter = null) {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    const items = [];
  
    snapshot.forEach((doc) => {
      const item = dataConverter ? doc.data(dataConverter) : doc.data();
      items.push(item);
    });
  
    return items;
  }


