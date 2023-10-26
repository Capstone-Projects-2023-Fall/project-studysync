import {collection, getDocs, getDoc, deleteDoc, doc, updateDoc, arrayRemove, where, arrayUnion, query} from 'firebase/firestore';

//add user follower, etc
export async function addItemToArrayField(db, uuid, itemToAdd, collectionToAdd, fieldToAddTo, singleName) {
    const itemRef = doc(db, collectionToAdd, uuid);
    try {
      const fieldToUpdate = {};
      fieldToUpdate[fieldToAddTo] = arrayUnion(itemToAdd);
      await updateDoc(itemRef,fieldToUpdate);
      return itemToAdd
    } catch (error) {
      console.error(`Error adding new ${singleName}`);
      throw error
    }
  }
  
  //remove user follower, etc
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


  //set user bio, etc
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

  //get user by id, quiz by id, etc
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

  //remove user from user collection, etc
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

  //get all users, get all quizes etc
  export async function getAllItems(db, collectionName, dataConverter = null) {
    const collectionRef = dataConverter == null? collection(db, collectionName) : collection(db, collectionName).withConverter(dataConverter);
    const snapshot = await getDocs(collectionRef);
    const items = [];
  
    snapshot.forEach((doc) => {
      const item = doc.data();
      items.push(item);
    });
  
    return items;
  }

  //get user followers etc
  export async function getArrayFieldFromCollection(db, collectionName, docId, fieldName) {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.hasOwnProperty(fieldName)) {
          return data[fieldName] || [];
        } else {
          console.error(`Field '${fieldName}' not found in the document.`);
          return [];
        }
      } else {
        console.error(`Document with ID '${docId}' not found in the collection '${collectionName}'.`);
        return [];
      }
    } catch (error) {
      console.error(`Error fetching ${fieldName} from collection ${collectionName}:`, error);
      throw error;
    }
  }
  
    //updates all non-array fields with the given object
    export async function updateNonArrayDocumentFields(db, documentId, collectionName, fieldsToUpdate) {
      const docRef = doc(db, collectionName, documentId);
      try {
        //object to store the updates
        const updates = {};
      
        for (const field in fieldsToUpdate) {
            //These fields are not arrays so we set it directly
            const fieldExists = await checkFieldExists(db, collectionName,field)
            if(!fieldExists) throw new Error(`The field ${field} does not exist in the ${collectionName} collection`)
            updates[field] = fieldsToUpdate[field];
        }
    
        await updateDoc(docRef, updates);
    
        console.log(`Successfully updated document with ID ${documentId} in collection ${collectionName}`);
      } catch (error) {
        console.error(`Error updating document with ID ${documentId} in collection ${collectionName}: ${error}`);
        throw error;
      }
    }

    export async function updateArrayDocumentFields(db, documentId, collectionName, fieldsToUpdate) {
      const docRef = doc(db, collectionName, documentId);
      try {
          // Object to store the updates
          const updates = {};
  
          for (const field in fieldsToUpdate) {
              const fieldExists = await checkFieldExists(db, collectionName, field);
              if (!fieldExists) throw new Error(`The field ${field} does not exist in the ${collectionName} collection`);

              updates[field] = arrayUnion(...fieldsToUpdate[field]);
          }
  
          await updateDoc(docRef, updates);
  
          console.log(`Successfully updated document with ID ${documentId} in collection ${collectionName}`);
      } catch (error) {
          console.error(`Error updating document with ID ${documentId} in collection ${collectionName}: ${error}`);
          throw error;
      }
  }

    async function checkFieldExists(db, col, fieldName){
      try{
          const q = query(collection(db, col), where(fieldName, '!=', null));
          const querySnapshot = await getDocs(q);
          console.log("snap: ", querySnapshot)
          return !querySnapshot.empty
      }catch(error){
          console.log("Error checking field existence:", error);
          return false
      }
    }