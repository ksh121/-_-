import React from 'react';

const HorizonLine = ({ label }) => {
  return (
    <div className="flex items-center my-4">
      <div className="flex-grow border-t border-gray-300"></div>
      {label && (
        <span className="mx-4 text-gray-500 text-sm whitespace-nowrap">
          {label}
        </span>
      )}
      <div className="flex-grow border-t border-gray-300"></div>
    </div>
  );
};

export default HorizonLine;

