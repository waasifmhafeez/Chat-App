import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    selectedUser,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const messageEndRef = useRef(null);

  const { authUser } = useAuthStore();

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
    subscribeToMessages();

    return () => {
      unsubscribeFromMessages();
    };
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    console.log("Messages updated:", messages);
    console.log("authUser:", authUser);
  }, [messages]);

  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 flex flex-col overflow-auto ">
        {messages &&
          messages.length > 0 &&
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`chat  ${
                msg.senderId === authUser._id ? "chat-end" : "chat-start"
              }`}
              ref={messageEndRef}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      msg.senderId === authUser._id
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "avatar.png"
                    }
                    alt="User Avatar"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {msg?.createdAt ? formatMessageTime(msg.createdAt) : "00:00"}
                </time>
              </div>
              <div className="chat-bubble flex flex-col">
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="Message Attachment"
                    className="sm:max-w-[200px] mb-2 rounded-lg"
                  />
                )}
                {msg.text && <p>{msg.text}</p>}
              </div>
            </div>
          ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
