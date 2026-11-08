import logoWhite from "@/assets/logo-white.png";
import markWhite from "@/assets/logo-mark-white.png";
import markDark from "@/assets/logo-mark-dark.png";

export function LogoLockup({ className = "h-7", alt = "AUTONOMOUS" }) {
  return <img src={logoWhite} alt={alt} className={`${className} w-auto`} draggable="false" />;
}

export function LogoMark({ className = "h-6", dark = false }) {
  return <img src={dark ? markDark : markWhite} alt="" className={`${className} w-auto`} draggable="false" />;
}

export default LogoLockup;
