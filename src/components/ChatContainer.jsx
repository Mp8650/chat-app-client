import React,{useState,useEffect,useRef,useContext} from 'react';
import assets, {messagesDummyData} from '../assets/assets';
//import {formatMessageTime} from '../lib/utils';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';


function ChatContainer(){

  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext)
  const { authUser, onlineUsers} = useContext(AuthContext)
  const scrollEnd = useRef()
  const [input, setInput] = useState('');

  const handleSendMessage = async (e)=> {
    e.preventDefault();
    if(input.trim() === "") return null;
    await sendMessage({text: input.trim()});
    setInput("")
  }

  // Handle sending an image
  const handleSendImage = async (e)=> {
    const file = e.target.files[0];
    if(!file || !file.type.startsWith("image/")) {
        toast.error("select an image file")
        return;
    }
    const reader = new FileReader();
    reader.onloadend = async ()=> {
        await sendMessage({image: reader.result})
        e.target.value = ""
    }
    reader.readAsDataURL(file)
  }

  useEffect(()=>{
    if(selectedUser){
        getMessages (selectedUser._id)
    }
  },[selectedUser])


  useEffect(()=> {
    if(scrollEnd.current && messages){
      scrollEnd.current.scrollIntoView({behavior:"smooth"})
    }
  },[messages])

    return selectedUser ? (
        <div className='h-full overflow-scroll relative backdrop-blur-lg'>
            {/* ------ Header-------*/}
             <div className='flex items-center gap-3 py-3 mx-4 border-stone-500'>
                <img src ={selectedUser.profilePic || assets.avatar_icon} alt='' className="w-8 rounded-full"/>
                <p className='flex-1 text-lg text-white flex items-center gap-2'>
                    {selectedUser.fullName}
                    {onlineUsers.includes(selectedUser._id) && <span className="w-2 h-2 
                    rounded-full bg-green-500"></span>}
                </p>
                <img onClick={()=> setSelectedUser(null)} src={assets.arrow_icon} alt="" 
                className='md:hidden max-w-7'/>
                <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5'/>

             </div>

             {/*------Chat Area-------*/}
             <div className='flex flex-col h-[calc(100%-120px)] 
             overflow-y-scroll p-3 pb-6'>
                {messages.map((msg, index)=>(
                    <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>
                        {msg.image ? (
                            <img src={msg.image} alt="" className='max-w[230px] border 
                            border-gray-700 rounded-lg overflow-hidden mb-8'/>
                        ) : (
                            <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-voilet-500/30 text-white ${msg.senderId === authUser._id ? 'rounded-br-none':'rounded-bl-none'}`}>
                                {msg.text}</p>

                        )}
                        <div className='text-center text-xs'>
                            <img src={msg.senderId===  authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-7 rounded-full'/>
                            <p className='text-gray-500'>{msg.createdAt}</p>

                        </div>

                    </div>
                ))}

             </div>

{/* ------ Bottom------*/}

<div className='absolute bottom-0 left-0 flex items-center gap-3 p-3'>
    <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
        <input onChange={(e)=>setInput(e.target.value)} value={input}  onKeyDown={(e)=> e.key === "Enter" ? handleSendMessage(e) : null} type="text" placeholder = "Send a message" 
        className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-grey-400"/>
        <input onChange={handleSendImage} type="file" id='image' accept='image/png, image/jpeg' hidden onClick={(e) => handleFileSelect(e)}/>
        <label htmlFor="image">
            <img src={assets.gallery_icon} alt="" className="w-5 mr-2 cursor-pointer"/>
        </label>
    </div>
<img onClick={handleSendMessage} src={assets.send_button} alt="" className="w-7 cursor-pointer"/>
</div>
       
        </div>
    ) : (
        <div className ='flex flex-col items-center justify-center
        gap-2 text-gray-500 bg-white/10 max-md:hidden'>
            <img src={assets.logo_icon} className='max-w-16' alt=""/>
            <p className='text-lg font-medium text-white'> Chat anytime, Anywhere</p>
        </div>
    )
};
export default ChatContainer;



// {/* ------- Better code ------ */}
// import React, { useState, useRef } from "react";
// import assets, { messagesDummyData } from "../assets/assets";
// import { ChatContext } from '../../context/ChatContext';
// import { AuthContext } from '../../context/AuthContext';
// function ChatContainer() {
//   // ---------- State ----------
//   const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext)
//   const { authUser, onlineUsers} = useContext(AuthContext)
//   const scrollEnd = useRef()
//   const [input, setInput] = useState('');
  
//   // const [messages, setMessages] = useState(messagesDummyData);
//   // const [messageText, setMessageText] = useState("");
//   // const [selectedFile, setSelectedFile] = useState(null);

  

//   // ---------- Handle file select ----------
//   function handleFileSelect(e) {
//     const file = e.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file); // temporary preview
//       setSelectedFile(imageUrl);
//     }
//   }

//   // ---------- Handle send ----------
//   function handleSend() {
//     if (!messageText.trim() && !selectedFile) return;

//     const newMessage = {
//       senderId: "680f50e4f10f3cd28382ecf9",
//       text: messageText,
//       image: selectedFile,
//       createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//     };

//     setMessages([...messages, newMessage]);
//     setMessageText("");
//     setSelectedFile(null);
//     if (fileInputRef.current) fileInputRef.current.value = null;
//   }

//   // ---------- Remove selected image ----------
//   function handleRemoveImage() {
//     setSelectedFile(null);
//     if (fileInputRef.current) fileInputRef.current.value = null;
//   }

//   // ---------- No user selected ----------
//   if (!selectedUser) {
//     return (
//       <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden h-full">
//         <img src={assets.logo_icon} className="max-w-16" alt="" />
//         <p className="text-lg font-medium text-white">Chat anytime, Anywhere</p>
//       </div>
//     );
//   }

//   // ---------- Chat UI ----------
//   return (
//     <div className="h-full overflow-hidden relative backdrop-blur-lg flex flex-col">
//       {/* ------ Header ------- */}
//       <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
//         <img src={assets.profile_martin} alt="" className="w-8 rounded-full" />
//         <p className="flex-1 text-lg text-white flex items-center gap-2">
//           {selectedUser?.name || "Martin Johnson"}
//           <span className="w-2 h-2 rounded-full bg-green-500"></span>
//         </p>
//         <img
//           onClick={() => setSelectedUser(null)}
//           src={assets.arrow_icon}
//           alt=""
//           className="md:hidden w-6 cursor-pointer"
//         />
//         <img src={assets.help_icon} alt="" className="max-md:hidden w-5" />
//       </div>

//       {/* ------ Chat Area ------- */}
//       <div className="flex-1 overflow-y-auto p-3 pb-28">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`flex items-end gap-2 mb-3 ${
//               msg.senderId === "680f50e4f10f3cd28382ecf9"
//                 ? "justify-end"
//                 : "flex-row-reverse"
//             }`}
//           >
//             {msg.image ? (
//               <img
//                 src={msg.image}
//                 alt=""
//                 className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden"
//               />
//             ) : (
//               <p
//                 className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg break-all text-white ${
//                   msg.senderId === "680f50e4f10f3cd28382ecf9"
//                     ? "bg-violet-500/30 rounded-br-none"
//                     : "bg-gray-700/30 rounded-bl-none"
//                 }`}
//               >
//                 {msg.text}
//               </p>
//             )}
//             <div className="text-center text-xs text-gray-400">
//               <img
//                 src={
//                   msg.senderId === "680f50e4f10f3cd28382ecf9"
//                     ? assets.avtar_icon
//                     : assets.profile_martin
//                 }
//                 alt=""
//                 className="w-7 rounded-full"
//               />
//               <p>{msg.createdAt}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ------ Image Preview before sending ------ */}
//       {selectedFile && (
//         <div className="absolute bottom-16 left-0 w-full flex justify-center">
//           <div className="relative inline-block">
//             <img
//               src={selectedFile}
//               alt="Preview"
//               className="w-32 h-32 object-cover rounded-lg border border-gray-500 shadow-md"
//             />
//             <button
//               onClick={handleRemoveImage}
//               className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
//             >
//               ✕
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ------ Bottom Input Area ------ */}
//       <div className="absolute bottom-0 left-0 flex items-center gap-3 p-3 w-full bg-black/40 backdrop-blur-md">
//         <div className="flex-1 flex items-center bg-gray-100/10 px-3 rounded-full">
//           <input
//             type="text"
//             placeholder="Send a message"
//             value={messageText}
//             onChange={(e) => setMessageText(e.target.value)}
//             className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent"
//           />

//           <input
//             type="file"
//             id="image"
//             accept="image/png, image/jpeg"
//             hidden
//             ref={fileInputRef}
//             onChange={handleFileSelect}
//           />
//           <label htmlFor="image">
//             <img
//               src={assets.gallery_icon}
//               alt=""
//               className="w-5 mr-2 cursor-pointer"
//             />
//           </label>
//         </div>

//         <img
//           src={assets.send_button}
//           alt=""
//           className="w-7 cursor-pointer"
//           onClick={handleSend}
//         />
//       </div>
//     </div>
//   );
// }

// export default ChatContainer;
