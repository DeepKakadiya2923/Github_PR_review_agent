import Layout from "../components/Layout";
import PRForm from "../components/PRForm";

function Review() {
  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-6">
        New Review
      </h1>

      <PRForm />
    </Layout>
  );
}

export default Review;