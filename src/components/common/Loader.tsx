interface LoaderProps {
  text?: string;
  center?: boolean;
  overlay?: boolean;
  className?: string;
}

export const Loader = ({ text = "Cargando...", center = false, overlay = false, className = "" }: LoaderProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 text-base-content 
          ${center ? "w-full h-full" : ""} 
          ${overlay ? "fixed inset-0 z-50 bg-base-100/70 backdrop-blur-sm" : ""}
          ${className}`}>
      <span className={`loading loading-infinity loading-xl`} />
      {text && <span className="text-md">{text}</span>}
    </div>
  );
};
