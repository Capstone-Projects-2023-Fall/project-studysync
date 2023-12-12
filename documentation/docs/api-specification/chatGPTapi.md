---
sidebar_position: 2
---

# ChatGPT API

The project uses Firebase Cloud Function for integrating with OpenAI's GPT model(GPT-4-vision-preview). 
It's designed to respond to HTTPS POST requests, using CORS to handle cross-origin issues. 
The function, initiated with an OpenAI API key, processes incoming requests containing an array of messages. 
It utilizes node-fetch to communicate with OpenAI's chat completion API, sending and receiving JSON data. 
The response from OpenAI, which includes text content from the AI model, is logged and returned to the client. 
The function also includes robust error handling for various scenarios such as invalid requests and API errors.