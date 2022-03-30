import React from 'react';

export default function DateTimeDisplay({ value }) {
  return (
    <span style={{ padding: '0 0.1rem' }}>
      {value < 10 ? '0' : ''}
      {value}
    </span>
  );
}
