import {useEffect, useState} from 'react'
import axios from 'axios'

const App = () => {
  const [message, setMessage] = useState('Loading backend message...')

  useEffect(() => {
    axios
      .get('/api/message')
      .then((response) => response.data)
      .then(setMessage)
      .catch(() => setMessage('Failed to load backend message'))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">Learnix</h1>

          <div className="space-x-6 hidden md:flex">
            <a href="#" className="text-gray-600 hover:text-blue-600">Courses</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">Certificates</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">About</a>
          </div>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero / Intro */}
      <section className="flex items-center justify-center text-center px-6 py-20">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Learnix
          </h2>

          <p className="text-gray-600 text-lg">
            Learnix is an online learning platform designed for IT students and
            professionals. Explore curated courses, track your progress, and
            earn certificates that showcase your skills. With interactive
            lessons and modern tools, Learnix helps you build real-world
            knowledge and advance your career.
          </p>

          <p className="mt-4 text-lg font-semibold text-blue-600">{message}</p>

          <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
            Get Started
          </button>
        </div>
      </section>

    </div>
  );
};

export default App;