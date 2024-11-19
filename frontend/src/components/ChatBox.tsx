import { Chat } from "@@types/rtcTypes";
import { FormEvent, useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";

interface Props {
  chats: Chat[];
  submitChat: (input: string) => void;
}

function ChatBox({ chats, submitChat }: Props) {
  const [input, setInput] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleChatEnter = (e: FormEvent) => {
    e.preventDefault();
    if (!input) return;
    submitChat(input);
    setInput("");
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats]);

  return (
    <div className="w-full bg-gray-800 shadow-lg">
      <div className="p-4 bg-gray-700 flex justify-between items-center rounded-t-lg">
        <h2 className="text-lg font-semibold text-slate-200">채팅</h2>
      </div>
      <div className="flex h-[320px] flex-col overflow-y-scroll">
        {chats.map(({ id, text }) => (
          <div className="p-3 space-y-4" ref={scrollRef}>
            <div className="items-start">
              <p className="ml-3 text-sm text-slate-200">
                <span className="text-slate-200">{id}</span> : {text}
              </p>
            </div>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleChatEnter}
        className="w-full p-4 bg-gray-700 flex items-center gap-4 rounded-b-lg"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요"
          className="flex-1 p-2 rounded-lg bg-gray-600 text-slate-200 placeholder-gray-400 focus:ring-2 focus:outline-none focus:ring-gray-400"
        />
        <button
          type="submit"
          className="w-10 h-10 p-2 flex justify-center items-center bg-blue-600 rounded-full text-slate-200 hover:bg-blue-500"
        >
          <IoSend />
        </button>
      </form>
    </div>
  );
}

export default ChatBox;
