import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-white py-6 border-t border-[#E5E5EA]">
        <div className="container mx-auto px-4 md:px-6 text-center text-apple-gray">
          <p>BookStore &copy; {new Date().getFullYear()} - Designed by DUSHIME AIME</p>
        </div>
      </footer>
  )
}

export default Footer