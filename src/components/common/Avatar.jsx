export default function Avatar({ name, src }) {
  if (src) return <img className="portrait photo" src={src} alt={name} loading="lazy" />;
  const letters = name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  return <div className="portrait" aria-hidden="true">{letters}</div>;
}
