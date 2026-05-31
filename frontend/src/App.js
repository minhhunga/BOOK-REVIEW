import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Authors from './pages/Authors';
import Books from './pages/Books';
import Reviews from './pages/Reviews';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-indigo-700 text-white shadow-lg">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-8">
            <span className="text-xl font-bold tracking-wide">📚 Book Review</span>
            <NavLink
              to="/authors"
              className={({ isActive }) =>
                isActive ? 'font-semibold border-b-2 border-white pb-1' : 'opacity-80 hover:opacity-100'
              }
            >
              Authors
            </NavLink>
            <NavLink
              to="/books"
              className={({ isActive }) =>
                isActive ? 'font-semibold border-b-2 border-white pb-1' : 'opacity-80 hover:opacity-100'
              }
            >
              Books
            </NavLink>
            <NavLink
              to="/reviews"
              className={({ isActive }) =>
                isActive ? 'font-semibold border-b-2 border-white pb-1' : 'opacity-80 hover:opacity-100'
              }
            >
              Reviews
            </NavLink>
          </div>
        </nav>

        {/* Page content */}
        <main className="max-w-6xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Authors />} />
            <Route path="/authors" element={<Authors />} />
            <Route path="/books" element={<Books />} />
            <Route path="/reviews" element={<Reviews />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;