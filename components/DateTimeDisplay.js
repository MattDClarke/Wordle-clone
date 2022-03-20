import React from 'react';

export default function DateTimeDisplay({ value, type }) {
  return (
    <div className="countdown">
      <p>{value}</p>
      <span>{type}</span>
    </div>
  );
}
