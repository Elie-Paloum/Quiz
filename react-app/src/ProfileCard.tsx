import React from 'react'
import './ProfileCard.css' // <- Import custom styles

function ProfileCard(props: any) {
  return (
    <div className="max-w-sm max-h-[380px] mx-auto bg-white shadow-lg rounded-lg overflow-hidden neon-hover">
      <div className="flex items-center justify-center h-48 bg-gray-200 dark:bg-gray-800">
        <img
          src={props.image}
          alt="hiss"
          className="rounded-full w-32 h-32 object-cover"
        />
      </div>
      <div className="p-6 dark:bg-gray-900 hover:bg-white">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{props.name}</h2>
        <p className="text-gray-600 mt-2 dark:text-gray-100">{props.role}</p>
        <p className="text-gray-500 mt-4 dark:text-gray-100">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
    </div>
  )
}

export default ProfileCard
