import {database} from "../../../firebase"
import {collection, getDocs} from 'firebase/firestore';

export async function getSnapShot(col){
    const ref = collection(database, col)
    const data = [] 
  try{
    const snapshot = await getDocs(ref, col);
    snapshot.docs.forEach((doc)=>{
        console.log(doc.data())
    //   data.push(doc.data())
    })
    // return data
  }catch(error){
    throw error
  }
}




