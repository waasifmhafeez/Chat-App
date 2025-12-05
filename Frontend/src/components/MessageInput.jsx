import { Image, Send, X } from "lucide-react";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useChatStore } from "../store/useChatStore";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please select a valid image file.");
      return;
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    try {
      await sendMessage({ text: text.trim(), image: imagePreview });
      setText("");
      removeImage();
    } catch (error) {
      console.log(
        "Error in handleSendMessage MessageInput. Failed to send message",
        error
      );
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-300"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 bg-base-300 rounded-full size-5 flex items-center justify-center"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2    "
      >
        <div className="flex-1 flex gap-2 ">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
          />
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`hidden sm:flex btn btn-circle  ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            } `}
          >
            <Image size={20} />
          </button>
        </div>
        <div>
          <button
            type="submit"
            className="btn btn-sm btn-circle "
            disabled={!text.trim() && !imagePreview}
          >
            <Send sixze={22} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
