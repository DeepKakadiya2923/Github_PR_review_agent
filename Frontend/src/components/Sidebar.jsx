import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-slate-900 text-white p-5">
      <h1 className="text-2xl font-bold mb-8">
        PR Agent
      </h1>

      <nav className="flex flex-col gap-4">
        <Link
          to="/"
          className="hover:text-blue-400"
        >
          Dashboard
        </Link>

        <Link
          to="/review"
          className="hover:text-blue-400"
        >
          New Review
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;