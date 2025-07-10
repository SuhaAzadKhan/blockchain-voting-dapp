import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-green-100 text-center">
      <h1 className="text-4xl font-bold mb-6">Blockchain Voting DApp</h1>
      <p className="mb-10 text-lg text-gray-700">Choose your role to continue</p>

      <div className="space-x-4">
        <Link
          to="/admin"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Admin
        </Link>
        <Link
          to="/user"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          Voter
        </Link>
      </div>
    </div>
  );
};

export default Landing;
