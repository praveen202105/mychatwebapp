export default function Sidebar() {
  return (
    <div className="w-full h-screen bg-black text-white flex flex-col">
      {/* Tabs */}
      <div className="flex space-x-4 p-4">
        <button className="bg-purple-700 px-4 py-2 rounded-lg font-medium">
          Random
        </button>
        <button className="px-4 py-2 rounded-lg font-medium">Friends</button>
      </div>

      {/* Online Users */}
      <div className="flex-1 p-4">
        <h3 className="text-sm font-semibold mb-2">Online Users</h3>
        <ul>
          <li className="flex items-center justify-between py-2">
            <span>Alice</span>
            <span>📹</span>
          </li>
          <li className="flex items-center justify-between py-2">
            <span>Varun</span>
            <span>📹</span>
          </li>
        </ul>
      </div>

      {/* Total Online Users */}
      <div className="p-4 border-t border-purple-700 flex justify-between text-sm">
        <span>Total Online Users</span>
        <span className="bg-purple-700 px-2 rounded-lg">2</span>
      </div>
    </div>
  );
}
