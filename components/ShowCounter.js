import DateTimeDisplay from './DateTimeDisplay';

export default function ShowCounter({ hours, minutes, seconds }) {
  return (
    <div className="show-counter">
      <DateTimeDisplay value={hours} type="Hours" />
      <p>:</p>
      <DateTimeDisplay value={minutes} type="Mins" />
      <p>:</p>
      <DateTimeDisplay value={seconds} type="Seconds" />
    </div>
  );
}
