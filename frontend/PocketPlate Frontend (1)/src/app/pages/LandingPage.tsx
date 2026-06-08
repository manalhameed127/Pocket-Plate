import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);
  const hasNavigated = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;
      const progress = Math.min(window.scrollY / totalHeight, 1);

      setScrollProgress(progress);

      if (progress > 0.82 && !hasNavigated.current) {
        hasNavigated.current = true;
        setTimeout(() => {
          window.scrollTo(0, 0);
          navigate("/home");
        }, 360);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, [navigate]);

  const scale = 1 + scrollProgress * 5.15;
  const bodyOpacity =
    scrollProgress < 0.64
      ? 1
      : Math.max(0, 1 - (scrollProgress - 0.64) / 0.18);
  const tummyScale =
    scrollProgress > 0.48
      ? Math.min((scrollProgress - 0.48) / 0.34, 1)
      : 0;
  const popScale =
    scrollProgress > 0.62
      ? Math.min((scrollProgress - 0.62) / 0.18, 1)
      : 0;

  return (
    <div className="relative" style={{ height: "310vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-gradient-to-b from-[#EDF1F1] via-[#F8FAFA] to-[#E7EEEE]">
        <div
          className="absolute top-3 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-0.5 text-center"
          style={{
            opacity: Math.max(0, 1 - scrollProgress * 6),
          }}
        >
          <div className="font-serif text-xl font-semibold tracking-tight text-[#1A1A2E] md:text-2xl">
            Pocket<span className="text-[#FF6B35]">Plate</span>
          </div>
          <div className="text-[11px] font-semibold tracking-wide text-[#4A4560] md:text-xs">
            AI-powered budget food ordering
          </div>
        </div>

        <div
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
          style={{
            opacity: Math.max(0, 1 - scrollProgress * 8),
          }}
        >
          <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#4A4560]/50">
            scroll into belly
          </span>
          <div className="h-9 w-0.5 animate-pulse bg-gradient-to-b from-[#4A4560]/40 to-transparent" />
        </div>

        <div
          className="absolute inset-0 z-[3] flex items-center justify-center pointer-events-none"
          style={{ opacity: bodyOpacity }}
        >
          <svg
            className="h-auto w-[450px] max-w-[78vw] drop-shadow-[0_35px_55px_rgba(26,26,46,0.18)] will-change-transform"
            style={{
              transform: `translate3d(0, ${28 - scrollProgress * 96}px, 0) scale(${scale})`,
              transformOrigin: "50% 56%",
            }}
            viewBox="0 0 520 660"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient
                id="bodyGrad"
                cx="42%"
                cy="30%"
                r="72%"
              >
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="45%" stopColor="#F9F9F8" />
                <stop offset="82%" stopColor="#E9E7E4" />
                <stop offset="100%" stopColor="#D8D7D4" />
              </radialGradient>
              <radialGradient
                id="headGrad"
                cx="44%"
                cy="28%"
                r="78%"
              >
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="62%" stopColor="#F7F7F6" />
                <stop offset="100%" stopColor="#DFDFDC" />
              </radialGradient>
              <linearGradient
                id="limbGrad"
                x1="0%"
                x2="100%"
                y1="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="58%" stopColor="#F1F0EE" />
                <stop offset="100%" stopColor="#D8D7D4" />
              </linearGradient>
              <radialGradient
                id="bellyGlow"
                cx="50%"
                cy="48%"
                r="52%"
              >
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="58%" stopColor="#FFFFFF" stopOpacity="0.42" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </radialGradient>
              <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow
                  dx="0"
                  dy="12"
                  stdDeviation="18"
                  floodColor="#A9B0B0"
                  floodOpacity="0.28"
                />
              </filter>
            </defs>

            <ellipse
              cx="260"
              cy="636"
              rx="142"
              ry="19"
              fill="rgba(83,96,100,0.13)"
            />

            <g filter="url(#softShadow)">
              <path
                d="M118 231 C72 258 44 334 47 423 C50 511 86 578 133 570 C174 563 180 513 165 459 C151 408 152 350 174 302 C195 257 165 204 118 231Z"
                fill="url(#limbGrad)"
              />
              <path
                d="M402 231 C448 258 476 334 473 423 C470 511 434 578 387 570 C346 563 340 513 355 459 C369 408 368 350 346 302 C325 257 355 204 402 231Z"
                fill="url(#limbGrad)"
              />

              <path
                d="M170 516 C169 581 195 638 236 640 C265 641 270 607 264 558 C258 508 245 479 215 481 C186 483 171 492 170 516Z"
                fill="url(#limbGrad)"
              />
              <path
                d="M350 516 C351 581 325 638 284 640 C255 641 250 607 256 558 C262 508 275 479 305 481 C334 483 349 492 350 516Z"
                fill="url(#limbGrad)"
              />
              <path
                d="M260 523 C254 559 253 608 260 641"
                fill="none"
                stroke="#D2D0CC"
                strokeWidth="2"
                opacity="0.5"
              />
              <path
                d="M183 618 C202 612 224 613 249 619"
                fill="none"
                stroke="#D4D2CF"
                strokeWidth="1.4"
                opacity="0.45"
              />
              <path
                d="M271 619 C296 613 318 612 337 618"
                fill="none"
                stroke="#D4D2CF"
                strokeWidth="1.4"
                opacity="0.45"
              />

              <path
                d="M260 151 C136 151 69 248 82 385 C95 523 172 596 260 596 C348 596 425 523 438 385 C451 248 384 151 260 151Z"
                fill="url(#bodyGrad)"
              />
              <ellipse
                cx="260"
                cy="379"
                rx="184"
                ry="172"
                fill="url(#bellyGlow)"
              />
              <path
                d="M121 355 C164 320 221 303 260 304 C299 303 356 320 399 355"
                fill="none"
                stroke="#DCDAD7"
                strokeWidth="1.4"
                opacity="0.35"
              />

              <ellipse
                cx="260"
                cy="103"
                rx="82"
                ry="54"
                fill="url(#headGrad)"
              />
              <ellipse
                cx="232"
                cy="76"
                rx="37"
                ry="14"
                fill="white"
                opacity="0.56"
              />

              <circle cx="224" cy="99" r="11" fill="#050505" />
              <circle cx="296" cy="99" r="11" fill="#050505" />
              <path
                d="M235 100 C252 104 270 104 286 100"
                fill="none"
                stroke="#050505"
                strokeWidth="4"
                strokeLinecap="round"
              />

              <g opacity="0.5">
                <circle
                  cx="326"
                  cy="249"
                  r="22"
                  fill="#F4F4F2"
                  stroke="#D7D5D1"
                  strokeWidth="2"
                />
                <path
                  d="M314 244 C322 239 330 239 338 245"
                  fill="none"
                  stroke="#C9C7C2"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M314 252 C322 258 330 258 338 252"
                  fill="none"
                  stroke="#C9C7C2"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>

              <path
                d="M70 447 C80 487 100 521 130 538"
                fill="none"
                stroke="#D6D4D0"
                strokeWidth="1.4"
                opacity="0.45"
              />
              <path
                d="M450 447 C440 487 420 521 390 538"
                fill="none"
                stroke="#D6D4D0"
                strokeWidth="1.4"
                opacity="0.45"
              />
            </g>
          </svg>
        </div>

        {popScale > 0 && (
          <div
            className="absolute left-1/2 top-[57%] z-[4] h-[34vmax] w-[34vmax] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80 pointer-events-none will-change-transform"
            style={{
              transform: `translate3d(-50%, -50%, 0) scale(${0.3 + popScale * 1.25})`,
              opacity: Math.max(0, 1 - popScale),
            }}
          />
        )}

        {tummyScale > 0 && (
          <div
            className="absolute left-1/2 top-[57%] z-[5] h-[150vmax] w-[150vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white pointer-events-none will-change-transform"
            style={{
              transform: `translate3d(-50%, -50%, 0) scale(${tummyScale})`,
              opacity: 1,
            }}
          />
        )}
      </div>
    </div>
  );
}
