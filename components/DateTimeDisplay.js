import React from 'react';

export default function DateTimeDisplay({ value }) {
  console.log(typeof value);
  return (
    <span style={{ padding: '0 0.1rem' }}>
      {value < 10 ? '0' : ''}
      {value}
    </span>
  );
}
