export type AvatarProps = {
  src?: string;
  name: string;
  surname: string;
  size?: number;
};

function Avatar({ src, name, surname, size = 32 }: AvatarProps) {
  if (!src) {
    const initials = `${name[0]}${surname[0]}`.toUpperCase();
    return (
      <div
        className="rounded-circle bg-secondary-subtle flex-shrink-0 d-flex align-items-center justify-content-center fw-semibold text-secondary-emphasis"
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {initials}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={`${name} ${surname}`}
      className="rounded-circle flex-shrink-0"
      style={{ width: size, height: size, objectFit: "cover" }}
    />
  );
}

export default Avatar;
