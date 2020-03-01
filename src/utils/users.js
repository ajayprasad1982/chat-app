const users=[]

//addUser,removeUser,getUser,getUsersinRoom

const addUser=({id,username,room})=>{
    
        //clean data 
          username:username.trim().toLowerCase()
          room:room.trim().toLowerCase()

    
     //validate the data
      if(!username || !room)
      return {
          Error:"username and room are required"

      }

      // check for existing user
      const existingUser=users.find((user)=>{
          return username===user.username && room=== user.room
      })


      

      // validate username
      if(existingUser)
      return {
          Error:"username is in use"
      }

      //store user
      const user={id,username,room}
      users.push(user)
      return {user}
}

// delete user
const removeUser=((id)=>{
    const index=users.findIndex(user=>user.id===id)

    if(index!= -1){
        return users.splice(index,1)[0]
    }
})
// get user
const getUser=(id)=>{
    return users.find(user=>user.id===id)
}

// get users
const getUsersInRoom=(room)=>{
    return users.filter(user=>user.room===room)
}

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}