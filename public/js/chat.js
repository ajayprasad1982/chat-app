const socket=io()
//element
const $messageForm=document.querySelector("#message-form")
const $messageFormInput=$messageForm.querySelector("#message")
const $messageFormButton=$messageForm.querySelector("#send")
const $messageFormLocationButton=document.querySelector("#send-location")
const $messages=document.querySelector("#messages")

//template
const messageTemplate=document.querySelector("#message-template").innerHTML
const messageLocationTemplate=document.querySelector("#message-location-template").innerHTML
const sideBarTemplate=document.querySelector("#sidebar-template").innerHTML

//Query
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})


// autoscroll
const autoscroll=()=>{

    //new message element
    const $newMessage=$messages.lastElementChild

    // Height of the last message
      const newMessageStyles=getComputedStyle($newMessage)
      const newMessageMargin=parseInt(newMessageStyles.marginBottom)
      const newMessageHeight=$newMessage.offsetHeight + newMessageMargin

      // visible height
      const visibleHeight=$messages.offsetHeight

      // Height of message container
      const containerHeight=$messages.scrollHeight
      // how far as I have scrolled??
      const scrollOffset=$messages.scrollTop+visibleHeight

      if(containerHeight - newMessageHeight <= scrollOffset)
      {
        $messages.scrollTop=$messages.scrollHeight
      }



}

socket.on('message',(message)=>{
    console.log(message)
    const html=Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm:ss a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})



document.querySelector("#message-form").addEventListener("submit",(e)=>{
    e.preventDefault()

    $messageFormButton.setAttribute("disabled","disabled")

    const input=e.target.elements.message.value
    socket.emit("sendMessage",input,(error)=>{
        $messageFormButton.removeAttribute("disabled")
        $messageFormInput.value=''
        $messageFormInput.focus()
       if(error)
       return  console.log(error)

       console.log("Message Delivered")
    })
})

socket.on("locationMessage",url=>{
    console.log(url)
    const html=Mustache.render(messageLocationTemplate,{
        username:url.username,
        url:url.url,
        createdAt:moment(url.createdAt).format('h:mm:ss a')
    })
    $messages.insertAdjacentHTML('beforeend',html)

})

$messageFormLocationButton.addEventListener("click",()=>{

    
    if(!navigator.geolocation)
    return alert("Geolocation is not supported by your browser")

    

    navigator.geolocation.getCurrentPosition((position)=>{
        $messageFormLocationButton.setAttribute("disabled","disabled")
        


        const location={
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        }
        socket.emit("sendLocation",location,(message)=>{
            $messageFormLocationButton.removeAttribute("disabled")
        console.log(message)
        })
    })
})
socket.on("roomData",({room,users})=>{
   const html=Mustache.render(sideBarTemplate,{
      room,
      users 
   })
document.querySelector("#sidebar").innerHTML=html
})


socket.emit("join",({username,room}),(error)=>{
    if(error)
  { 
    alert(error)
    location.href='/'
  }
})