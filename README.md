# CyberShare

CyberShare is a social media app developed using ReactJs and Firebase

**Click [Here](https://nostalgic-morse-36cdc3.netlify.app/) to give it a try or watch the [Demo](https://youtu.be/XXJeTTYVcpw)**



## Technology Used

- **React** (FrontEnd)
  - **Material-UI** 
  - **react-router-dom**
  - **react-uuid** 
  - **react-bootstrap** 
- **Firebase** - Baas (Backend as a Service)
  - **Firestore** 
  - **Authentication**
    - SignIn & SignUp functionality using Email and Password verification    
  - **Storage** - Cloud Storage for uploading and serving Songs
 

## Functionalities

### Post photos

User can share a new photo(in the form of a URL) and add a caption.

### Follow and Unfollow 

User can follow and unfollow other users.

### Like 

User can like posts of users he follows.

### Comment

User can comment on posts of users he follows.

### Profile

User can go to their profile or visit other profiles by clicking on the username.



### Context API

- **useAuth** - This provides the functions related to Login and Logout and help in better state management.


### Helper Functions

- **updateUserProfile** - This provides the function to update the user profile when the user follows or unfollows an account.


## Setup (deveopment)

- Clone the repo, and cd into it
- Install all the dependcies from package.json
- Create a firebase project and enable Email-Password Authentication
- Place your firebase project Keys inside the Firebase.js file
- Run app by typing `npm start` in command line
