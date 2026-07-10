import Layout from "../components/Layout";
import StatCard from "../components/StatCard";

function Dashboard() {
  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6">
        <StatCard
          title="Reviews"
          value="12"
        />

        <StatCard
          title="Bugs Found"
          value="34"
        />

        <StatCard
          title="Repositories"
          value="8"
        />
      </div>
    </Layout>
  );
}

export default Dashboard;