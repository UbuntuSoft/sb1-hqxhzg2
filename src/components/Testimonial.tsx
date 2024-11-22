import React from 'react';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  image: string;
}

export default function Testimonial({ quote, author, role, image }: TestimonialProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center space-x-4">
        <img
          src={image}
          alt={author}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h4 className="font-semibold text-gray-900">{author}</h4>
          <p className="text-sm text-gray-600">{role}</p>
        </div>
      </div>
      <p className="mt-4 text-gray-600 italic">"{quote}"</p>
    </div>
  );
}