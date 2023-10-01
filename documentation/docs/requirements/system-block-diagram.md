---
sidebar_position: 2
---

# System Block Diagram
![image](https://github.com/Capstone-Projects-2023-Fall/project-studysync/assets/112578002/fd4272b0-e601-4698-87c5-7e6eaaa6c9d6)

Users start using StudySync by going to the website on a browser, entering an engaging space created with React Frontend. Here, they log in securely with Firebase Authentication, making sure their experience is safe. Once logged in, users can easily interact with their study materials, with the Frontend and Firebase Database working together to let users access and change their learning resources in real time. All of this happens smoothly and reliably on Google Cloud, giving users a dependable and unified learning platform. All these parts work together to create a secure, interactive learning experience, powered by advanced technology, making studying easier and more enjoyable for everyone.

Describing the User Journey

User Interaction with Browser:
Users start their journey when they access the StudySync platform through a web browser.
Here, they interact with the interface and access different features, facilitated by the Frontend designed using React.

Frontend and Authentication:
When users need to log in or sign up, the Frontend interacts with Firebase Authentication.
This block verifies the user credentials and handles secure user sessions, allowing or denying access based on the verification.

Frontend and Database Interaction:
Once authenticated, users can create, modify, or interact with the study materials.
The Frontend fetches and sends data to and from the Firebase Database, ensuring users can retrieve and store their flashcards, quizzes, and other study materials.

Google Cloud Hosting:
The entire platform is hosted on Google Cloud through Firebase services.
This provides a robust and scalable environment, ensuring seamless access to the StudySync platform for all users, regardless of traffic load.

User Experience:
Users experience an interactive and user-friendly environment through the React-powered Frontend.
They can leverage the comprehensive features offered by StudySync, such as flashcard creation, quizzes, and social learning, with the assurance of secure and seamless interactions facilitated by Firebase services.
