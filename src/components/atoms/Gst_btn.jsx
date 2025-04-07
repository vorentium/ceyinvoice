import { Link } from 'react-router-dom';

function GstBtn() {
  return (
    <Link to="/creator-studio" className="inline-block">
      <button className="bg-white text-black border-2 border-var-primary font-sans rounded-full px-6 py-3 h-auto w-auto flex items-center justify-center text-sm sm:text-base md:text-lg font-medium transition-all duration-300 hover:bg-var-primary hover:text-white focus:outline-none focus:ring-2 ring-var-primary focus:ring-opacity-50">
        GET STARTED NOW
      </button>
    </Link>
  );
}

export default GstBtn; 