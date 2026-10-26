export default function Initials({ name }) {
  const letters = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <div className="portrait" aria-hidden="true">
      {letters}
    </div>
  );
}
