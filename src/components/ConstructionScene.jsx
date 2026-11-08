import { useSite } from "@/lib/site";

const CSS = `
.cs .bob { animation: cs-bob 1.9s ease-in-out infinite; }
.cs .walk { animation: cs-walk 11s ease-in-out infinite; }
.cs .climb { animation: cs-climb 9s ease-in-out infinite; }
.cs .lamp-pulse { animation: cs-lamp 2.6s ease-in-out infinite; }
.cs .jib { animation: cs-jib 9s ease-in-out infinite alternate; }
.cs .cable { animation: cs-cable 24s linear infinite; }
.cs .cargo { animation: cs-cargo 24s linear infinite; }
.cs .spark-a { animation: cs-sparkA 0.5s steps(3) infinite; }
.cs .spark-b { animation: cs-sparkB 0.42s steps(3) infinite; }
.cs .blink { animation: cs-blink 2.2s ease-in-out infinite; }
.cs .holo { animation: cs-holo 18s linear infinite; }
.cs .beam-sweep { animation: cs-beam 24s linear infinite; }
.cs .dust { animation: cs-dust 12s ease-in-out infinite alternate; }
.cs .coneglow { animation: cs-cone 3.4s ease-in-out infinite; }
.cs .core-pulse { animation: cs-core 3s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.cs .lift-up { animation: cs-lift 8s ease-in-out infinite; }

@keyframes cs-bob { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-3px);} }
@keyframes cs-walk { 0%,100% { transform: translateX(0);} 50% { transform: translateX(56px);} }
@keyframes cs-climb { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-10px);} }
@keyframes cs-lamp { 0%,100% { opacity:.9;} 50% { opacity:.45;} }
@keyframes cs-jib { from { transform: rotate(-1.2deg);} to { transform: rotate(1.4deg);} }
@keyframes cs-cable { 0%,22% { transform: scaleY(1);} 34%,46% { transform: scaleY(5);} 60%,100% { transform: scaleY(1);} }
@keyframes cs-cargo { 0%,22% { transform: translateY(0); opacity:1;} 34% { transform: translateY(120px); opacity:1;} 46% { transform: translateY(120px); opacity:.35;} 60%,100% { transform: translateY(0); opacity:1;} }
@keyframes cs-sparkA { 0% { opacity:1;} 34% { opacity:.1;} 67% { opacity:.9;} 100% { opacity:.2;} }
@keyframes cs-sparkB { 0% { opacity:.15;} 50% { opacity:1;} 100% { opacity:.25;} }
@keyframes cs-blink { 0%,100% { opacity:1;} 50% { opacity:.2;} }
@keyframes cs-holo { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
@keyframes cs-beam { 0%,70% { opacity:0; transform: translateX(-260px);} 80% { opacity:.5;} 92%,100% { opacity:0; transform: translateX(260px);} }
@keyframes cs-dust { from { transform: translateY(0);} to { transform: translateY(-16px);} }
@keyframes cs-cone { 0%,100% { opacity:.9;} 50% { opacity:.5;} }
@keyframes cs-core { 0%,100% { transform: scale(1); opacity:1;} 50% { transform: scale(1.12); opacity:.85;} }
@keyframes cs-lift { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-7px);} }
@media (prefers-reduced-motion: reduce) {
  .cs * { animation: none !important; }
}
`;

function Worker({ x, y, vest = "#3B82F6", helmet = "#F5C518", skin = "#F4E0C8", flip = false, pose = "stand", anim = "bob", scale = 1 }) {
  const cx = x, cy = y;
  return (
    <g className={anim}>
      <g transform={`translate(${cx} ${cy}) ${flip ? "scale(-1,1)" : ""} scale(${scale})`}>
        {/* legs */}
        <path d="M-3.4 0 L-3.4 9 M3.4 0 L3.4 9" stroke="#C9CBD6" strokeWidth="3" strokeLinecap="round" fill="none" />
        {/* boots */}
        <path d="M-3.4 9 h-3 M3.4 9 h3" stroke="#1c1c26" strokeWidth="2.4" strokeLinecap="round" />
        {/* body vest */}
        <rect x="-5" y="-13" width="10" height="14" rx="3" fill={vest} stroke="rgba(0,0,0,0.3)" strokeWidth="0.6" />
        {/* reflective stripe */}
        <line x1="-5" y1="-7" x2="5" y2="-7" stroke="#F5C518" strokeWidth="1.6" opacity="0.95" />
        {/* head */}
        <circle cx="0" cy="-16.5" r="4.2" fill={skin} />
        {/* hard hat */}
        <path d="M-4.8 -17.8 a4.8 4.3 0 0 1 9.6 0 z" fill={helmet} stroke="#B8860B" strokeWidth="0.7" />
        <ellipse cx="0" cy="-17.4" rx="5.6" ry="1.3" fill={helmet} stroke="#B8860B" strokeWidth="0.6" />
        {/* arms */}
        {pose === "weld" && (
          <>
            <path d="M4.5 -11 L13 -7" stroke={vest} strokeWidth="3.2" strokeLinecap="round" />
            <path d="M-4.5 -11 L-6.5 -4" stroke={vest} strokeWidth="3.2" strokeLinecap="round" />
            <circle cx="14" cy="-6.5" r="1.6" fill="#FDE68A" />
          </>
        )}
        {pose === "climb" && (
          <>
            <path d="M4.5 -11 L8 -16" stroke={vest} strokeWidth="3.2" strokeLinecap="round" />
            <path d="M-4.5 -11 L-8 -7" stroke={vest} strokeWidth="3.2" strokeLinecap="round" />
          </>
        )}
        {pose === "point" && (
          <>
            <path d="M4.5 -11 L11 -14" stroke={vest} strokeWidth="3.2" strokeLinecap="round" />
            <path d="M-4.5 -11 L-6.5 -4" stroke={vest} strokeWidth="3.2" strokeLinecap="round" />
          </>
        )}
        {(pose === "stand" || pose === "tablet") && (
          <>
            <path d="M4.5 -11 L7 -4" stroke={vest} strokeWidth="3.2" strokeLinecap="round" />
            <path d="M-4.5 -11 L-7 -4" stroke={vest} strokeWidth="3.2" strokeLinecap="round" />
          </>
        )}
        {pose === "tablet" && <rect x="-2" y="-11" width="5.5" height="4" rx="1" fill="#0d0d16" stroke="#60A5FA" strokeWidth="1" />}
      </g>
    </g>
  );
}

function Cone({ x, y }) {
  return (
    <g className="coneglow">
      <polygon points={`${x},${y} ${x+9},${y} ${x+4.5},${y-15}`} fill="#F97316" stroke="#EA580C" strokeWidth="0.8" />
      <polygon points={`${x+1.8},${y-9} ${x+7.2},${y-9} ${x+6.2},${y-13} ${x+2.8},${y-13}`} fill="#FDE68A" opacity="0.9" />
      <rect x={x-1.5} y={y} width={12} height={2.6} rx="1.3" fill="#EA580C" />
    </g>
  );
}

export default function ConstructionScene() {
  const { t } = useSite();
  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand-line bg-black" data-testid="construction-scene">
      <style>{CSS}</style>
      <svg viewBox="0 0 1600 620" className="cs construction-scene block h-auto w-full" role="img" aria-label={t("product.intro")}>
        <defs>
          <linearGradient id="gs-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#07070f" />
            <stop offset="70%" stopColor="#0b0b1a" />
            <stop offset="100%" stopColor="#07070d" />
          </linearGradient>
          <radialGradient id="gs-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#DBEAFE" />
            <stop offset="35%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.2" />
          </radialGradient>
          <radialGradient id="gs-burst" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#8B5CF6" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="gs-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#15151f" />
            <stop offset="100%" stopColor="#050508" />
          </linearGradient>
          <linearGradient id="gs-beam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
            <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gs-mat" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>

        <rect width="1600" height="620" fill="url(#gs-sky)" />

        <g className="dust" opacity="0.7">
          {[[120,90],[300,55],[520,130],[760,60],[980,140],[1200,80],[1420,120],[400,40],[1100,45],[180,210],[1360,60],[640,35]].map(([x,y],i)=>(
            <circle key={i} cx={x} cy={y} r={i%3===0?1.9:1.1} fill="#8B5CF6" opacity={0.5} />
          ))}
        </g>

        <ellipse cx="800" cy="585" rx="620" ry="80" fill="url(#gs-burst)" opacity="0.35" />

        {/* floor */}
        <rect x="0" y="545" width="1600" height="75" fill="url(#gs-floor)" />
        <line x1="0" y1="545" x2="1600" y2="545" stroke="#2b2b3f" strokeWidth="1.5" />
        <g stroke="#1d1d2c" strokeWidth="1">
          {Array.from({length: 17}).map((_,i)=>(<line key={i} x1={i*100} y1="620" x2={330 + i*55} y2="545" />))}
        </g>

        {/* ============ TOWER CRANE ============ */}
        <g>
          {/* mast lattice */}
          {Array.from({length: 9}).map((_,i)=>(
            <g key={i}>
              <line x1="1130" y1={545 - i*30} x2="1160" y2={545 - i*30 - 15} stroke="#3a3a54" strokeWidth="1.8" />
              <line x1="1160" y1={545 - i*30} x2="1130" y2={545 - i*30 - 15} stroke="#3a3a54" strokeWidth="1.8" />
            </g>
          ))}
          <line x1="1128" y1="545" x2="1128" y2="270" stroke="#2e2e44" strokeWidth="3.5" />
          <line x1="1162" y1="545" x2="1162" y2="270" stroke="#2e2e44" strokeWidth="3.5" />
          {/* operator cabin */}
          <g>
            <rect x="1120" y="236" width="52" height="36" rx="5" fill="#1c1c2c" stroke="#60A5FA" strokeWidth="1.8" />
            <rect x="1128" y="244" width="18" height="20" rx="2" fill="#0b1020" stroke="#60A5FA" strokeWidth="1" />
            <circle cx="1158" cy="250" r="3" fill="#60A5FA" />
            <circle cx="1158" cy="258" r="2.2" fill="#8B5CF6" />
          </g>
          {/* mast beacon */}
          <circle cx="1145" cy="234" r="4" fill="#EF4444" className="blink" />
          {/* jib */}
          <g className="jib" style={{transformOrigin: "1145px 236px"}}>
            <line x1="1040" y1="236" x2="1330" y2="236" stroke="#2e2e44" strokeWidth="8" strokeLinecap="round" />
            <line x1="1145" y1="236" x2="1145" y2="196" stroke="#3a3a54" strokeWidth="2.5" />
            {Array.from({length: 7}).map((_,i)=>(
              <line key={i} x1={1040 + i*40} y1="236" x2={1145} y2="198" stroke="#3a3a54" strokeWidth="1.2" />
            ))}
            <line x1="1280" y1="236" x2="1145" y2="198" stroke="#3a3a54" strokeWidth="1.2" />
            <rect x="1300" y="228" width="34" height="18" rx="3" fill="#22222e" stroke="#3a3a54" />
            <circle cx="1042" cy="232" r="4.5" fill="#60A5FA" />
          </g>
          {/* hoist: trolley on the jib, cable hangs DOWN to the suspended robot-arm part and lowers it.
              Cable scaleY(1→5) from its top and cargo translateY(0→120) share keyframes so they stay attached. */}
          <rect x="1230" y="232" width="20" height="9" rx="2" fill="#2a2a40" stroke="#60A5FA" strokeWidth="1" />
          <line className="cable" x1="1240" y1="240" x2="1240" y2="270" stroke="#4a4a6a" strokeWidth="2.4" style={{transformOrigin: "1240px 240px"}} />
          <g className="cargo">
            <path d="M1232 270 h16 M1240 270 v6" stroke="#6b6b90" strokeWidth="2" />
            <rect x="1216" y="276" width="48" height="60" rx="9" fill="#1a1a26" stroke="#60A5FA" strokeWidth="2" />
            <circle cx="1240" cy="306" r="9" fill="url(#gs-core)" />
            <circle cx="1240" cy="306" r="14" fill="none" stroke="#60A5FA" strokeWidth="1.2" strokeDasharray="2 5" />
          </g>
          <rect x="1108" y="537" width="74" height="11" rx="2" fill="#22222e" stroke="#3a3a54" />
        </g>

        {/* ============ LEFT SCAFFOLD ============ */}
        <g stroke="#34344c" strokeWidth="3" fill="none">
          {/* 4 levels */}
          <path d="M300 545 V300 M470 545 V300" />
          <path d="M300 300 H470 M300 360 H470 M300 425 H470 M300 490 H470 M300 545 H470" />
          {/* X braces */}
          <path d="M300 300 L470 360 M470 300 L300 360" />
          <path d="M300 360 L470 425 M470 360 L300 425" />
          <path d="M300 425 L470 490 M470 425 L300 490" />
          <path d="M300 490 L470 545 M470 490 L300 545" />
        </g>
        {/* scaffold platform deck */}
        <rect x="296" y="297" width="178" height="6" rx="2" fill="#24243a" stroke="#3a3a54" strokeWidth="1" />
        <rect x="296" y="357" width="178" height="6" rx="2" fill="#24243a" stroke="#3a3a54" strokeWidth="1" />
        {/* glowing rail on top deck */}
        <line x1="296" y1="297" x2="474" y2="297" stroke="#8B5CF6" strokeWidth="2" opacity="0.9" />

        {/* ============ LEFT CRANE (small mast) ============ */}
        <g>
          <line x1="200" y1="545" x2="200" y2="330" stroke="#2e2e44" strokeWidth="4" />
          <g className="jib" style={{transformOrigin: "200px 332px", animationDirection: "reverse"}}>
            <line x1="120" y1="332" x2="300" y2="332" stroke="#2b2b3e" strokeWidth="8" strokeLinecap="round" />
            <line x1="200" y1="332" x2="200" y2="300" stroke="#34344c" strokeWidth="2.5" />
            <line x1="130" y1="332" x2="200" y2="302" stroke="#34344c" strokeWidth="1.2" />
            <line x1="270" y1="332" x2="200" y2="302" stroke="#34344c" strokeWidth="1.2" />
          </g>
          <circle cx="200" cy="328" r="6" fill="#93C5FD" className="lamp-pulse" />
          <circle cx="200" cy="328" r="13" fill="#93C5FD" opacity="0.25" />
        </g>

        {/* ============ ROBOT ============ */}
        <ellipse cx="800" cy="548" rx="230" ry="14" fill="#8B5CF6" opacity="0.16" />
        <ellipse className="glow-burst" cx="800" cy="360" rx="260" ry="230" fill="url(#gs-burst)" opacity="0.4" />

        <g>
          {/* platform */}
          <rect x="640" y="540" width="320" height="13" rx="4" fill="#16161f" stroke="#3a3a54" strokeWidth="1.2" />
          <rect x="648" y="540" width="304" height="2.5" fill="url(#gs-mat)" opacity="0.6" />

          {/* legs */}
          <rect x="690" y="392" width="42" height="150" rx="11" fill="#1a1a24" stroke="#45455f" strokeWidth="2.2" />
          <rect x="808" y="392" width="42" height="150" rx="11" fill="#1a1a24" stroke="#45455f" strokeWidth="2.2" />
          <rect x="700" y="526" width="66" height="17" rx="4" fill="#1c1c28" stroke="#3a3a54" strokeWidth="1.4" />
          <rect x="794" y="526" width="66" height="17" rx="4" fill="#1c1c28" stroke="#3a3a54" strokeWidth="1.4" />
          <rect className="light l-strips" x="705" y="420" width="10" height="104" rx="5" fill="#3B82F6" opacity="0.95" />
          <rect className="light l-strips" x="825" y="420" width="10" height="104" rx="5" fill="#8B5CF6" opacity="0.95" />
          <line x1="696" y1="398" x2="726" y2="398" stroke="#5b5b80" strokeWidth="1.6" />
          <line x1="814" y1="398" x2="844" y2="398" stroke="#5b5b80" strokeWidth="1.6" />

          {/* torso */}
          <rect x="662" y="244" width="216" height="152" rx="20" fill="#1b1b27" stroke="#4a4a68" strokeWidth="2.4" />
          <line x1="680" y1="282" x2="860" y2="282" stroke="#2c2c3e" strokeWidth="2" />
          <circle className="core-pulse" cx="770" cy="330" r="24" fill="url(#gs-core)" />
          <circle cx="770" cy="330" r="34" fill="none" stroke="#60A5FA" strokeWidth="1.8" strokeDasharray="3 7" opacity="0.9" />
          <circle cx="770" cy="330" r="44" fill="none" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="2 9" opacity="0.5" />
          <rect className="light l-strips" x="692" y="372" width="66" height="9" rx="4.5" fill="#3B82F6" opacity="0.95" />
          <rect className="light l-strips" x="782" y="372" width="66" height="9" rx="4.5" fill="#8B5CF6" opacity="0.95" />
          <line x1="684" y1="252" x2="856" y2="252" stroke="#5b5b80" strokeWidth="1.6" />
          {/* shoulder bolts */}
          <circle cx="662" cy="260" r="4" fill="#60A5FA" opacity="0.8" />
          <circle cx="878" cy="260" r="4" fill="#A78BFA" opacity="0.8" />

          {/* left arm */}
          <rect x="588" y="252" width="56" height="132" rx="16" fill="#1b1b27" stroke="#4a4a68" strokeWidth="2.2" />
          <circle className="light l-strips" cx="616" cy="286" r="8" fill="#3B82F6" />
          <line x1="598" y1="260" x2="634" y2="260" stroke="#5b5b80" strokeWidth="1.4" />
          <rect x="600" y="384" width="32" height="16" rx="5" fill="#22222e" stroke="#3a3a54" />

          {/* right arm */}
          <rect x="896" y="252" width="56" height="132" rx="16" fill="#1b1b27" stroke="#4a4a68" strokeWidth="2.2" />
          <circle className="light l-strips" cx="924" cy="286" r="8" fill="#8B5CF6" />
          <line x1="906" y1="260" x2="942" y2="260" stroke="#5b5b80" strokeWidth="1.4" />
          <rect x="908" y="384" width="32" height="16" rx="5" fill="#22222e" stroke="#3a3a54" />

          {/* neck connecting head to torso (torso centre x=770) */}
          <rect x="748" y="236" width="44" height="16" rx="5" fill="#1c1c28" stroke="#4a4a68" strokeWidth="1.6" />

          {/* head — centred on torso */}
          <rect x="696" y="172" width="148" height="68" rx="17" fill="#1c1c2a" stroke="#4a4a6e" strokeWidth="2.4" />
          <rect className="light l-eyes" x="722" y="196" width="24" height="11" rx="5.5" fill="#93C5FD" />
          <rect className="light l-eyes" x="794" y="196" width="24" height="11" rx="5.5" fill="#C4B5FD" />
          <line x1="720" y1="184" x2="820" y2="184" stroke="#5b5b80" strokeWidth="2" />
          <line x1="770" y1="172" x2="770" y2="150" stroke="#5b5b80" strokeWidth="2.6" />
          <circle className="blink" cx="770" cy="146" r="5" fill="#EF4444" />
          {/* ear panels */}
          <rect x="684" y="190" width="10" height="34" rx="4" fill="#22222e" stroke="#3a3a54" />
          <rect x="846" y="190" width="10" height="34" rx="4" fill="#22222e" stroke="#3a3a54" />
        </g>

        {/* holo rings */}
        <g className="holo" style={{transformOrigin: "800px 410px"}}>
          <ellipse cx="800" cy="410" rx="300" ry="76" fill="none" stroke="#3B82F6" strokeWidth="1.1" strokeDasharray="4 11" opacity="0.3" />
        </g>
        <g className="holo" style={{transformOrigin: "800px 410px", animationDirection: "reverse"}}>
          <ellipse cx="800" cy="410" rx="360" ry="98" fill="none" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="2 15" opacity="0.25" />
        </g>

        <rect className="beam-sweep" x="660" y="330" width="280" height="5" rx="2.5" fill="url(#gs-beam)" />

        {/* ============ RIGHT LADDER + WORKER ============ */}
        <g stroke="#4a4a6a" strokeWidth="2.6" fill="none">
          <line x1="940" y1="542" x2="968" y2="438" />
          <line x1="960" y1="542" x2="988" y2="438" />
          <line x1="945" y1="526" x2="969" y2="526" /><line x1="950" y1="510" x2="974" y2="510" />
          <line x1="955" y1="494" x2="979" y2="494" /><line x1="960" y1="478" x2="984" y2="478" />
          <line x1="965" y1="462" x2="989" y2="462" /><line x1="970" y1="446" x2="994" y2="446" />
        </g>
        <g className="climb">
          <Worker x={952} y={498} vest="#A78BFA" pose="climb" flip scale={1.02} />
        </g>

        {/* ============ SCISSOR LIFT + WELDING WORKER ============ */}
        <g>
          {/* lift frame */}
          <g stroke="#3a3a54" strokeWidth="3" fill="none">
            <line x1="1020" y1="520" x2="1090" y2="430" /><line x1="1090" y1="520" x2="1020" y2="430" />
            <line x1="1035" y1="520" x2="1090" y2="452" /><line x1="1090" y1="452" x2="1035" y2="520" />
            <line x1="1020" y1="520" x2="1090" y2="520" />
          </g>
          <rect x="1014" y="518" width="82" height="12" rx="3" fill="#22222e" stroke="#3a3a54" />
          {/* platform */}
          <g className="lift-up">
            <rect x="1012" y="408" width="86" height="12" rx="3" fill="#24243a" stroke="#3a3a54" />
            <g stroke="#3a3a54" strokeWidth="2" fill="none">
              <line x1="1016" y1="408" x2="1016" y2="382" /><line x1="1056" y1="408" x2="1056" y2="382" />
              <line x1="1016" y1="382" x2="1094" y2="382" /><line x1="1094" y1="382" x2="1094" y2="408" />
              <line x1="1016" y1="395" x2="1094" y2="395" />
            </g>
            <Worker x={1056} y={406} vest="#60A5FA" pose="weld" flip scale={0.96} />
            {/* welding spark on arm */}
            <g className="spark-a" style={{transformOrigin: "1035px 378px"}}>
              <circle cx="1035" cy="378" r="3.6" fill="#FDE68A" />
              <circle cx="1035" cy="378" r="8" fill="#FDE68A" opacity="0.3" />
              <path d="M1035 372 l3 -6 M1035 384 l3 6 M1029 378 l-6 -3 M1041 378 l6 3" stroke="#FDE68A" strokeWidth="1.3" />
            </g>
          </g>
          {/* lift wheels */}
          <circle cx="1030" cy="532" r="7" fill="#22222e" stroke="#3a3a54" strokeWidth="1.6" />
          <circle cx="1080" cy="532" r="7" fill="#22222e" stroke="#3a3a54" strokeWidth="1.6" />
          <rect x="1018" y="524" width="76" height="6" rx="2" fill="#24243a" />
        </g>

        {/* ============ WORKERS ============ */}
        {/* on scaffold top deck (tablet) */}
        <Worker x={392} y={297} vest="#5FA4F5" pose="tablet" anim="bob" />
        {/* on scaffold mid deck (blueprint) */}
        <Worker x={392} y={357} vest="#A78BFA" pose="point" anim="bob" flip />
        {/* on robot left shoulder welding the head joint */}
        <g className="bob">
          <Worker x={672} y={235} vest="#F5C518" skin="#F4E0C8" pose="weld" scale={1.0} />
          <g className="spark-a">
            <circle cx="686" cy="227" r="3.4" fill="#FDE68A" />
            <circle cx="686" cy="227" r="8" fill="#FDE68A" opacity="0.3" />
            <path d="M686 221 l3 -6 M686 233 l3 6 M680 227 l-6 -3 M692 227 l6 3 M682 223 l-5 -5 M690 223 l5 -5" stroke="#FDE68A" strokeWidth="1.2" />
          </g>
        </g>
        {/* on robot right arm, pointing at the head */}
        <Worker x={867} y={235} vest="#60A5FA" pose="point" anim="bob" flip scale={0.98} />
        {/* ground left welding platform */}
        <g className="bob">
          <Worker x={700} y={528} vest="#3B82F6" pose="weld" scale={1.0} />
          <g className="spark-b" style={{transformOrigin: "714px 522px"}}>
            <circle cx="714" cy="522" r="3" fill="#FDE68A" />
            <circle cx="714" cy="522" r="7" fill="#FDE68A" opacity="0.3" />
          </g>
        </g>
        {/* ground right */}
        <Worker x={880} y={528} vest="#A78BFA" pose="point" anim="bob" flip />
        {/* walking with plank */}
        <g className="walk">
          <Worker x={560} y={536} vest="#5FA4F5" pose="stand" scale={1.0} />
          <rect x="548" y="524" width="24" height="3.2" rx="1.6" fill="#8B5CF6" opacity="0.95" />
        </g>
        {/* ground far left */}
        <Worker x={300} y={542} vest="#A1A1AA" pose="stand" anim="bob" flip />

        {/* ============ BLUEPRINT BOARD ============ */}
        <g>
          <line x1="416" y1="545" x2="416" y2="512" stroke="#3a3a54" strokeWidth="3" />
          <rect x="398" y="482" width="40" height="34" rx="3" fill="#0d0d18" stroke="#60A5FA" strokeWidth="1.4" />
          <path d="M405 494 h14 M405 501 h20 M412 488 h18" stroke="#60A5FA" strokeWidth="1.1" opacity="0.95" />
          <circle cx="416" cy="516" r="2" fill="#60A5FA" />
        </g>

        {/* ============ CRATES & BARRIERS ============ */}
        <g stroke="#3A3A54" strokeWidth="1.4">
          <rect x="308" y="522" width="30" height="23" rx="2" fill="#181822" />
          <rect x="342" y="528" width="22" height="17" rx="2" fill="#181822" />
          <line x1="308" y1="533" x2="338" y2="533" />
          <line x1="342" y1="536" x2="364" y2="536" />
          <rect x="1180" y="524" width="28" height="21" rx="2" fill="#181822" />
          <rect x="1212" y="530" width="20" height="15" rx="2" fill="#181822" />
        </g>
        {/* barrier with lights */}
        <g>
          <line x1="600" y1="545" x2="600" y2="516" stroke="#3a3a54" strokeWidth="2.5" />
          <line x1="656" y1="545" x2="656" y2="516" stroke="#3a3a54" strokeWidth="2.5" />
          <line x1="600" y1="522" x2="656" y2="522" stroke="#3a3a54" strokeWidth="2.5" />
          <line x1="600" y1="532" x2="656" y2="532" stroke="#3a3a54" strokeWidth="2.5" />
          <rect x="596" y="512" width="8" height="5" rx="1.5" fill="#F97316" className="coneglow" />
          <rect x="652" y="512" width="8" height="5" rx="1.5" fill="#F97316" className="coneglow" />
        </g>

        {/* traffic cones */}
        <Cone x={240} y={542} />
        <Cone x={1120} y={542} />
        <Cone x={1210} y={542} />

        <ellipse className="sweep" cx="800" cy="330" rx="200" ry="280" fill="#3B82F6" opacity="0" style={{mixBlendMode: "screen"}} />
        <rect className="loop-mask" width="1600" height="620" fill="#000000" opacity="0" />
      </svg>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />
      <p className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 md:block">
        {t("product.future")}
      </p>
    </div>
  );
}
