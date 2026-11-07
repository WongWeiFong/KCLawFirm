export function Loading({ text = "Loading..." }) {
  return <p className="status" role="status">{text}</p>;
}

export function ErrorNote({ text = "Something went wrong while loading this content. Please try again later." }) {
  return <p className="status error" role="alert">{text}</p>;
}
