import { IoSend } from "react-icons/io5";

// 현재는 디자인만 GPT로 찍어낸 컴포넌트, 소켓 통신 로직을 구현해야 함
function ChatBox() {
  return (
    <div className="w-full bg-gray-800 shadow-lg">
      <div className="p-4 bg-gray-700 flex justify-between items-center rounded-t-lg">
        <h2 className="text-lg font-semibold text-white">채팅</h2>
      </div>
      <div className="flex h-[440px] flex-col overflow-y-scroll">
        <div className="flex-1 h-full p-4 space-y-4">
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white font-bold flex justify-center items-center">
              A
            </div>
            <p className="ml-3 text-sm text-gray-300">
              <span className="font-semibold text-white">Alice</span>:
              안녕하세요!
            </p>
          </div>
        </div>
      </div>
      <form className="w-full p-4 bg-gray-700 flex items-center gap-4 rounded-b-lg">
        <input
          type="text"
          placeholder="메시지를 입력하세요"
          className="flex-1 p-2 rounded-lg bg-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-10 h-10 p-2 flex justify-center items-center bg-blue-600 rounded-full text-white hover:bg-blue-500"
        >
          <IoSend />
        </button>
      </form>
    </div>
  );
}

export default ChatBox;
