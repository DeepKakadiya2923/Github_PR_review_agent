import Sidebar from "../components/Sidebar";

function Home() {
  return (
    <div className="layout">
      <Sidebar />

      <div className="content">
        <h1>Dashboard</h1>
      </div>
    </div>
  );
}

export default Home;