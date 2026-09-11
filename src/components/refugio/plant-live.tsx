export function PlantLive({
  src,
  alt = "",
  className = "",
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  return (
    <div className={`plant-live ${className}`}>
      <img src={src} alt={alt} className="plant-sway" draggable={false} />
      <span className="plant-dust" aria-hidden="true" />
      <span className="plant-dust plant-dust-slow" aria-hidden="true" />
    </div>
  );
}
