export default function ProfileCard() {
    return (
      <div className="bg-black text-white p-4 rounded-lg shadow-lg w-1/2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Varun <span className="text-green-500">✔️</span></h3>
            <p className="text-gray-400">@Var23</p>
          </div>
          <button className="bg-purple-700 px-4 py-2 rounded-lg">Add Friend</button>
        </div>
        <p className="mt-4 text-sm text-gray-300">
          About<br />
          Lorem ipsum dolor sit amet, consectetur adipiscing elit ut.
        </p>
      </div>
    );
  }
  