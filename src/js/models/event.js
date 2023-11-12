import { json } from "react-router-dom"

export const EVENT_TYPE = {
    SHARE_QUIZ: "SHARE QUIZ",
    NEW_FOLLOWER : "NEW FOLLOWER",
    UPCOMING_QUIZ: "UPCOMING_QUIZ",
    SHARE_FLASHCARD: "SHARED_FLASHCARD"
}

export default class Event {
    constructor(name, eventType, id){
        this.createdAt = new Date().getTime()
        this.name = name
        this.eventType = eventType
        this.id = id

        switch (EVENT_TYPE){
            case EVENT_TYPE.NEW_FOLLOWER:
                this.newFollowerEvent  = null
                break
            case EVENT_TYPE.SHARE_QUIZ:
                this.shareQuizEvent = null
                break
        }
    }

    //This can only be called when the event is a new follower event
    createNewFollowerEvent(follwerId, followingId){
        this.newFollowerEvent = new NewFollowerEvent(follwerId, followingId).toJSON();
        return this.newFollowerEvent
    }

    createShareQuizEvent(sharedBy, sharedWith){
        this.shareQuizEvent = new ShareEvent(sharedBy, sharedWith).toJSON();
        return this.shareQuizEvent
    }

    toJSON(){
        const jsonOutput =  {
            createdAt: this.createdAt,
            name: this.name,
            eventType: this.eventType,
            id: this.id,
            newFollowerEvent: this.newFollowerEvent
        }

        switch(this.eventType){
            case EVENT_TYPE.NEW_FOLLOWER:
                jsonOutput.newFollowerEvent = this.newFollowerEvent
                break
            case EVENT_TYPE.SHARE_QUIZ:
                jsonOutput.shareQuizEvent = this.shareQuizEvent
                break
        }
        return jsonOutput
    }
}

export class NewFollowerEvent{
    constructor(followerId, followingId){
        this.followerId = followerId
        this.followingId = followingId
    }

    toJSON(){
        return{
            followerId: this.followerId,
            followingId: this.followingId
        }
    }
}

export class ShareEvent{
    constructor(sharedBy, sharedWith){
        this.shared = sharedBy
        this.sharedWith = sharedWith
    }

    toJSON(){
        return {
            sharedBy: this.sharedBy,
            sharedWith: this.sharedWith
        }
    }
}
