"use strict";(self.webpackChunkcreate_project_docs=self.webpackChunkcreate_project_docs||[]).push([[8794],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>y});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),c=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=c(e.components);return r.createElement(l.Provider,{value:t},e.children)},p="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),p=c(n),d=a,y=p["".concat(l,".").concat(d)]||p[d]||m[d]||i;return n?r.createElement(y,o(o({ref:t},u),{},{components:n})):r.createElement(y,o({ref:t},u))}));function y(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=d;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[p]="string"==typeof e?e:a,o[1]=s;for(var c=2;c<i;c++)o[c]=n[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},9380:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>p,frontMatter:()=>i,metadata:()=>s,toc:()=>c});var r=n(7462),a=(n(7294),n(3905));const i={sidebar_position:2},o="System Block Diagram",s={unversionedId:"requirements/system-block-diagram",id:"requirements/system-block-diagram",title:"System Block Diagram",description:"systemblockdiagram drawio",source:"@site/docs/requirements/system-block-diagram.md",sourceDirName:"requirements",slug:"/requirements/system-block-diagram",permalink:"/project-studysync/docs/requirements/system-block-diagram",draft:!1,editUrl:"https://github.com/Capstone-Projects-2023-Fall/project-studysync/edit/main/documentation/docs/requirements/system-block-diagram.md",tags:[],version:"current",lastUpdatedBy:"Harris Kwong",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"docsSidebar",previous:{title:"System Overview",permalink:"/project-studysync/docs/requirements/system-overview"},next:{title:"General Requirements",permalink:"/project-studysync/docs/requirements/general-requirements"}},l={},c=[{value:"System Overview",id:"system-overview",level:2},{value:"System Components:",id:"system-components",level:3},{value:"User Journey",id:"user-journey",level:2},{value:"1. User Interaction with Browser:",id:"1-user-interaction-with-browser",level:3},{value:"2. Frontend and Authentication:",id:"2-frontend-and-authentication",level:3},{value:"3. Frontend and Database Interaction:",id:"3-frontend-and-database-interaction",level:3},{value:"4. ChatGPT API Integration:",id:"4-chatgpt-api-integration",level:3},{value:"5. User Experience:",id:"5-user-experience",level:3}],u={toc:c};function p(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"system-block-diagram"},"System Block Diagram"),(0,a.kt)("p",null,(0,a.kt)("img",{parentName:"p",src:"https://github.com/Capstone-Projects-2023-Fall/project-studysync/assets/111998266/80e7c121-847a-4679-8f48-bd9bd3ae20f6",alt:"system_block_diagram drawio"})),(0,a.kt)("h2",{id:"system-overview"},"System Overview"),(0,a.kt)("p",null,"StudySync is a web-based application optimized for educational engagement, running in web browsers."),(0,a.kt)("h3",{id:"system-components"},"System Components:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("strong",{parentName:"p"},"Frontend Development"),": "),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},"Utilizes React for an engaging user interface."),(0,a.kt)("li",{parentName:"ul"},"Facilitates easy navigation and interaction."))),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("strong",{parentName:"p"},"Firebase Database and User Authentication"),": "),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},"Manages user data and real-time transactions."),(0,a.kt)("li",{parentName:"ul"},"Ensures user data safety and privacy."))),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("strong",{parentName:"p"},"Integration of ChatGPT API"),": "),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},"Processes and responds to user inputs via Firebase Cloud Functions."),(0,a.kt)("li",{parentName:"ul"},"Enhances the interactive learning experience."))),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},(0,a.kt)("strong",{parentName:"p"},"Hosting on Google Cloud"),": "),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},"Ensures reliable performance and scalability."),(0,a.kt)("li",{parentName:"ul"},"Uses Firebase services, part of Google Cloud, for platform support.")))),(0,a.kt)("h2",{id:"user-journey"},"User Journey"),(0,a.kt)("h3",{id:"1-user-interaction-with-browser"},"1. User Interaction with Browser:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Access the platform through a web browser."),(0,a.kt)("li",{parentName:"ul"},"Interact with the React-based interface for various educational features.")),(0,a.kt)("h3",{id:"2-frontend-and-authentication"},"2. Frontend and Authentication:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Log in or sign up via the frontend that interfaces with Firebase Authentication."),(0,a.kt)("li",{parentName:"ul"},"Validates credentials and maintains secure access.")),(0,a.kt)("h3",{id:"3-frontend-and-database-interaction"},"3. Frontend and Database Interaction:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Post-authentication, engage with study materials."),(0,a.kt)("li",{parentName:"ul"},"Frontend manages real-time data exchange with Firebase Database.")),(0,a.kt)("h3",{id:"4-chatgpt-api-integration"},"4. ChatGPT API Integration:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"ChatGPT API interactions are managed through Firebase Cloud Functions."),(0,a.kt)("li",{parentName:"ul"},"Enables AI-based educational content and responses.")),(0,a.kt)("h3",{id:"5-user-experience"},"5. User Experience:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Interactive and user-friendly environment provided by React Frontend."),(0,a.kt)("li",{parentName:"ul"},"Offers AI-enhanced flashcard creation, quizzes, and social learning."),(0,a.kt)("li",{parentName:"ul"},"User interactions secured by Firebase services.")))}p.isMDXComponent=!0}}]);