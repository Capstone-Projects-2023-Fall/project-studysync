import keys from "../../keys";

/**
 * Represents an AI-driven tutor capable of answering questions.
 */


export default class AiTutor {

    
  
    async definitionsuggestion(term){
        const options = {
            method: 'POST',
            headers:{
                'Authorization': `Bearer ${keys.chatgpt_apiKey}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                model:"gpt-3.5-turbo",
                messages:[{role:"user",content:term}],
                max_token:100
            })
        }
        try{
            const response = await fetch('',options);
            const data = await response.json;
            return data;
        }catch(e){
            return "Error occured";
        }
    }
    printUser(){
       return keys.chatgpt_apiKey; 
    }
}
