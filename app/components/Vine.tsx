interface VineProps {
  /** Когда true — запускается анимация роста. До этого лоза полностью скрыта. */
  start?: boolean;
}

export default function Vine({ start = false }: VineProps) {
  return (
    <div className="vine-wrap" aria-hidden="true">
      <img
        src="/vine.svg"
        alt=""
        draggable={false}
        className={`vine-img${start ? " vine-img--start" : ""}`}
      />
    </div>
  );
}
