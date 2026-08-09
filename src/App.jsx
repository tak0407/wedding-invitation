import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const weddingDate = new Date("2027-08-28T12:30:00+09:00");
const asset = (name) => `${import.meta.env.BASE_URL}assets/${name}`;

const calendarRows = [
  [1, 2, 3, 4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19, 20, 21],
  [22, 23, 24, 25, 26, 27, 28],
  [29, 30, 31, "", "", "", ""],
];

const googleCalendarUrl =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  "&text=%EA%B9%80%EA%B2%BD%ED%83%81%20%EA%B8%88%EC%A0%95%EB%AF%BC%20%EA%B2%B0%ED%98%BC%EC%8B%9D" +
  "&dates=20270828T033000Z/20270828T053000Z" +
  "&details=2027%EB%85%84%208%EC%9B%94%2028%EC%9D%BC%20%ED%86%A0%EC%9A%94%EC%9D%BC%20%EB%82%AE%2012%EC%8B%9C%2030%EB%B6%84%2C%20JW%EC%BB%A8%EB%B2%A4%EC%85%98%20%EC%9A%B8%EC%82%B0%20%EB%A3%A8%EB%AF%B8%EC%97%90%EB%A5%B4%ED%99%80" +
  "&location=JW%EC%BB%A8%EB%B2%A4%EC%85%98%20%EC%9A%B8%EC%82%B0%20%EB%A3%A8%EB%AF%B8%EC%97%90%EB%A5%B4%ED%99%80%2C%20%EC%9A%B8%EC%82%B0%EA%B4%91%EC%97%AD%EC%8B%9C%20%EB%B6%81%EA%B5%AC%20%EC%A7%84%EC%9E%A5%EC%9C%A0%ED%86%B5%EB%A1%9C%2035";

const kakaoMapUrl = "https://map.kakao.com/link/search/JW%EC%BB%A8%EB%B2%A4%EC%85%98%20%EC%9A%B8%EC%82%B0%EC%A0%90";
const naverMapUrl = "https://map.naver.com/p/search/JW%EC%BB%A8%EB%B2%A4%EC%85%98%20%EC%9A%B8%EC%82%B0%EC%A0%90";

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
  },
};

function revealProps(reduceMotion, amount = 0.16) {
  if (reduceMotion) return {};
  return {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, amount },
    variants: {
      hidden: { opacity: 0, y: 26 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.72,
          ease: [0.22, 1, 0.36, 1],
          when: "beforeChildren",
          staggerChildren: 0.1,
        },
      },
    },
  };
}

function MotionBlock({ as = "section", className, children, amount, ...props }) {
  const reduceMotion = useReducedMotion();
  const MotionTag = as === "div" ? motion.div : motion.section;
  return (
    <MotionTag className={`${className} reveal`} {...revealProps(reduceMotion, amount)} {...props}>
      {children}
    </MotionTag>
  );
}

function BokehCanvas() {
  const canvasRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    const cover = canvas.parentElement;
    const particles = [];
    let running = true;
    let animationFrame = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = cover.clientWidth * dpr;
      canvas.height = cover.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawnY() {
      return cover.clientHeight * (0.3 + Math.random() * 0.7);
    }

    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 8; i += 1) {
      particles.push({
        x: Math.random() * cover.clientWidth,
        y: spawnY(),
        r: 0.9 + Math.random() * 1.5,
        vy: -(0.06 + Math.random() * 0.14),
        vx: (Math.random() - 0.5) * 0.1,
        alpha: 0.08 + Math.random() * 0.16,
      });
    }

    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, cover.clientWidth, cover.clientHeight);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < cover.clientHeight * 0.28) {
          p.y = cover.clientHeight + 8;
          p.x = Math.random() * cover.clientWidth;
        }
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8);
        gradient.addColorStop(0, `rgba(255, 245, 214, ${p.alpha})`);
        gradient.addColorStop(1, "rgba(255, 245, 214, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 8, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrame = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      running = false;
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, [reduceMotion]);

  return <canvas ref={canvasRef} id="bokeh" aria-hidden="true" />;
}

function Cover() {
  const reduceMotion = useReducedMotion();
  const entrance = (delay) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1.05, delay, ease: [0.22, 1, 0.36, 1] },
        };

  return (
    <section className="cover">
      <div className="rays" aria-hidden="true" />
      <BokehCanvas />
      <div className="veil" aria-hidden="true" />
      <div className="sunbeam" aria-hidden="true" />
      <div className="string-lights" aria-hidden="true">
        {Array.from({ length: 11 }).map((_, index) => (
          <i key={index} />
        ))}
      </div>
      <motion.div className="fg seq-1 chandelier-art" aria-hidden="true" {...entrance(0.45)}>
        <motion.img
          src={asset("chandelier.webp")}
          alt=""
          width="640"
          height="427"
          animate={reduceMotion ? undefined : { y: [0, -5, 0], rotate: [-0.18, 0.18, -0.18] }}
          transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
        />
      </motion.div>
      <motion.div className="fg seq-2 arch-art" {...entrance(0.7)}>
        <img src={asset("arch-window.webp")} alt="" width="567" height="1270" />
        <div className="inner">
          <p className="small-word">빛이 먼저 닿는 곳</p>
          <h1 className="names-line">
            경탁
            <span className="and">그리고</span>
            정민
          </h1>
        </div>
      </motion.div>
      <motion.p className="fg seq-3 date-line" {...entrance(1.0)}>
        2027 · 08 · 28
      </motion.p>
      <motion.p className="fg seq-4 venue-line" {...entrance(1.15)}>
        <strong>토요일 낮 12시 30분</strong>
        <br />
        JW컨벤션 울산 루미에르홀
      </motion.p>
      <motion.div className="fg seq-5 scroll-hint" aria-hidden="true" {...entrance(1.35)}>
        <span>SCROLL</span>
      </motion.div>
    </section>
  );
}

function DdayCounter() {
  const reduceMotion = useReducedMotion();
  const counterRef = useRef(null);
  const isInView = useInView(counterRef, { once: true, amount: 0.8 });
  const [days, setDays] = useState("—");

  useEffect(() => {
    if (!isInView && !reduceMotion) return undefined;
    const remaining = Math.ceil((weddingDate - new Date()) / 86400000);
    if (remaining <= 0 || reduceMotion) {
      setDays(remaining);
      return undefined;
    }

    let start = 0;
    let frame = 0;
    const duration = 1400;

    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setDays(Math.round(remaining * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = requestAnimationFrame(step);
    }

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [isInView, reduceMotion]);

  if (days === 0) {
    return (
      <motion.p ref={counterRef} className="dday-counter" variants={itemVariants}>
        <strong>오늘</strong>, 결혼합니다
      </motion.p>
    );
  }

  if (typeof days === "number" && days < 0) {
    return (
      <motion.p ref={counterRef} className="dday-counter" variants={itemVariants}>
        결혼한 지 <strong>{Math.abs(days)}</strong>일 되었습니다
      </motion.p>
    );
  }

  return (
    <motion.p ref={counterRef} className="dday-counter" variants={itemVariants}>
      예식까지 <strong>{days}</strong>일 남았습니다
    </motion.p>
  );
}

function Divider() {
  return <motion.img variants={itemVariants} className="divider-art" src={asset("divider.webp")} alt="" width="900" height="116" />;
}

function SectionHeading({ english, korean }) {
  return (
    <motion.div variants={itemVariants} className="section-heading">
      <span className="eyebrow" aria-hidden="true">{english}</span>
      <h2>{korean}</h2>
    </motion.div>
  );
}

function Ceremony() {
  const reduceMotion = useReducedMotion();

  return (
    <MotionBlock id="ceremony" className="when-where">
      <Divider />
      <SectionHeading english="CEREMONY" korean="예식 안내" />
      <motion.p variants={itemVariants} className="big-date">2027년 8월 28일 토요일</motion.p>
      <motion.p variants={itemVariants} className="time">낮 12시 30분 · JW컨벤션 울산 루미에르홀</motion.p>

      <motion.div variants={itemVariants} className="calendar-frame">
        <i aria-hidden="true" />
        <i aria-hidden="true" />
        <i aria-hidden="true" />
        <i aria-hidden="true" />
        <table className="calendar" aria-label="2027년 8월 달력">
          <caption>AUGUST 2027</caption>
          <thead>
            <tr>
              <th className="sun" scope="col">
                S
              </th>
              <th scope="col">M</th>
              <th scope="col">T</th>
              <th scope="col">W</th>
              <th scope="col">T</th>
              <th scope="col">F</th>
              <th scope="col">S</th>
            </tr>
          </thead>
          <tbody>
            {calendarRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((day, dayIndex) => (
                  <td key={`${rowIndex}-${dayIndex}`} className={`${dayIndex === 0 ? "sun" : ""} ${day === 28 ? "dday" : ""}`}>
                    {day === 28 ? (
                      <motion.span
                        className="day-mark"
                        initial={reduceMotion ? undefined : { scale: 0.72, opacity: 0 }}
                        whileInView={reduceMotion ? undefined : { scale: 1, opacity: 1 }}
                        viewport={{ once: true, amount: 0.9 }}
                        transition={{ type: "spring", stiffness: 180, damping: 16, delay: 0.28 }}
                      >
                        {day}
                      </motion.span>
                    ) : day}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <DdayCounter />
      <motion.nav variants={itemVariants} className="action-row" aria-label="예식 일정 저장">
        <a className="action-link primary" href={asset("wedding.ics")}>
          캘린더에 저장
        </a>
        <a className="action-link" target="_blank" rel="noopener noreferrer" href={googleCalendarUrl}>
          구글 캘린더
        </a>
      </motion.nav>
    </MotionBlock>
  );
}

function Gallery() {
  return (
    <MotionBlock className="gallery">
      <SectionHeading english="MOMENTS" korean="우리의 순간" />
      <motion.div variants={itemVariants} className="gallery-hero">PHOTO 01</motion.div>
      <motion.div variants={itemVariants} className="gallery-grid">
        {[2, 3].map((number) => (
          <motion.div variants={itemVariants} className="ph" key={number}>PHOTO 0{number}</motion.div>
        ))}
      </motion.div>
      <motion.p variants={itemVariants} className="gallery-note">웨딩 촬영 후 사진이 들어갈 자리입니다.</motion.p>
    </MotionBlock>
  );
}

function Directions() {
  return (
    <MotionBlock className="where">
      <SectionHeading english="DIRECTIONS" korean="오시는 길" />
      <motion.p variants={itemVariants} className="venue-title">JW컨벤션 울산 루미에르홀</motion.p>
      <motion.div variants={itemVariants} className="venue-map">
        <span className="hall">JW컨벤션 울산점 · 루미에르홀</span>
        <span className="addr">울산광역시 북구 진장유통로 35</span>
        <a className="tel-link" href="tel:0522899851">TEL 052-289-9851</a>
        <nav className="action-row" aria-label="지도 열기">
          <a className="action-link" target="_blank" rel="noopener noreferrer" href={kakaoMapUrl}>
            카카오맵
          </a>
          <a className="action-link" target="_blank" rel="noopener noreferrer" href={naverMapUrl}>
            네이버지도
          </a>
        </nav>
      </motion.div>
      <motion.dl variants={itemVariants} className="directions">
        <motion.div variants={itemVariants}>
          <dt>BUS</dt>
          <dd>태화강역에서 버스 또는 택시로 이동하실 수 있습니다.</dd>
        </motion.div>
        <motion.div variants={itemVariants}>
          <dt>KTX</dt>
          <dd>KTX 울산역에서는 차량 이동을 권장드립니다. 출발 전 지도 앱에서 최신 경로를 확인해 주세요.</dd>
        </motion.div>
        <motion.div variants={itemVariants}>
          <dt>CAR</dt>
          <dd>
            내비게이션에 JW컨벤션 울산점을 검색해 주세요.
            <br />
            하객 주차는 최대 2시간 30분 무료입니다.
          </dd>
        </motion.div>
      </motion.dl>
    </MotionBlock>
  );
}

export default function App() {
  useEffect(() => {
    document.body.classList.add("loaded");
    return () => document.body.classList.remove("loaded");
  }, []);

  return (
    <div className="page">
      <div className="draft-badge">초대장 초안 — 웨딩 사진·연락처는 확인 후 추가</div>
      <Cover />

      <MotionBlock as="div" className="interlude">
        <motion.p variants={itemVariants}>
          루미에르, 빛이라는 이름의 홀에서
          <br />
          경탁과 정민이 서약합니다.
          <span className="la">la lumière — the light</span>
        </motion.p>
        <motion.img variants={itemVariants} className="garland-art" src={asset("rose-garland.webp")} alt="" width="800" height="296" />
      </MotionBlock>

      <MotionBlock className="greeting">
        <Divider />
        <SectionHeading english="INVITATION" korean="초대합니다" />
        <motion.p variants={itemVariants}>
          밝은 정오의 빛이 드는 곳에서
          <br />
          저희 두 사람이 부부의 첫걸음을 시작합니다.
        </motion.p>
        <motion.p variants={itemVariants}>
          귀한 걸음으로 함께해 주신다면
          <br />
          오래도록 따뜻한 마음으로 간직하겠습니다.
        </motion.p>
        <motion.div variants={itemVariants} className="parents">
          <h3 className="sr-only">혼주 성함</h3>
          <p>
            김임수 · 정예원의 장남 <strong>경탁</strong>
          </p>
          <p>
            금병서 · 배태숙의 딸 <strong>정민</strong>
          </p>
        </motion.div>
        <motion.p variants={itemVariants} className="couple-sign">김경탁 · 금정민 올림</motion.p>
      </MotionBlock>

      <Ceremony />
      <Gallery />
      <Directions />

      <footer>
        <img
          className="garland-art"
          src={asset("rose-garland.webp")}
          alt=""
          width="800"
          height="296"
          style={{ margin: "0 auto 24px", width: "min(210px, 56vw)" }}
        />
        <p className="lumiere-word">LUMIÈRE</p>
        <div className="dot" aria-hidden="true" />
        <p>가장 밝은 정오의 빛 아래에서, 경탁 그리고 정민</p>
      </footer>
    </div>
  );
}
