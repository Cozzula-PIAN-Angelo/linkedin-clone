import { useState } from "react";

export type AvatarProps = {
  src?: string;
  name: string;
  surname: string;
  size?: number;
  /** Cornice decorativa (es. anello d'oro nel tema fantasy) per l'avatar principale */
  ringed?: boolean;
  className?: string;
};

function Avatar({
  src,
  name,
  surname,
  size = 32,
  ringed = false,
  className = "",
}: AvatarProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const wrapperClass = `avatar-wrapper flex-shrink-0${ringed ? " avatar-ringed" : ""}`;

  if (!src || imgFailed) {
    const initials = `${name[0]}${surname[0]}`.toUpperCase();
    return (
      <div className={wrapperClass} style={{ width: size, height: size }}>
        <div
          className={`rounded-circle bg-secondary-subtle d-flex align-items-center justify-content-center fw-semibold text-secondary-emphasis w-100 h-100 ${className}`}
          style={{ fontSize: size * 0.4 }}
        >
          {initials}
        </div>
      </div>
    );
  }
  return (
    <div className={wrapperClass} style={{ width: size, height: size }}>
      <img
        src={src}
        alt={`${name} ${surname}`}
        className={`rounded-circle w-100 h-100 ${className}`}
        style={{ objectFit: "cover" }}
        onError={() => setImgFailed(true)}
      />
    </div>
  );
}

export default Avatar;
