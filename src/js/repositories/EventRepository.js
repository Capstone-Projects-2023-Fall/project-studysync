import Event from "../models/event"
import { EVENT_TYPE } from "../models/event"
import { setDoc, doc } from 'firebase/firestore';
import { getAllItems, getItemById } from "../utils/sharedRepositoryFunctions";
const { v4: uuidv4 } = require('uuid');


export class EventRepository {
    constructor(database){
        this.database = database
    }

    /** Create new follwer event */
    async createNewFollowerEvent(followerId, followingId){
        const event = new Event(`${followerId} followed ${followingId}`, EVENT_TYPE.NEW_FOLLOWER, uuidv4())
        event.createNewFollowerEvent(followerId, followingId)
        try{
            const eventsRef = doc(this.database, "events", event.id)
            await setDoc(eventsRef, event.toJSON())
            return event.id
        }catch(error){
            console.log(`error adding new follower event: ${error}`)
        }
    }

    async getAllEvents(){
        return await getAllItems(this.database, "events", null)
    }

    async getEventById(id){
        await getItemById(this.database, id, "events", "event")
    }

}