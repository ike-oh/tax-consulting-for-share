import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Header, { HeaderVariant, HeaderSize } from '@/components/common/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/common/Footer';

// GSAP 플러그인 등록
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// 동영상 경로 (public 폴더)
const shipVideo1 = '/videos/ship1.mp4';
const visionVideo = '/videos/vision.mp4';
const growthVideo = '/videos/growth.mp4';
const crewVideo = '/videos/crew.mp4';
const yachtVideo = '/videos/yacht.mp4';
const financeVideo = '/videos/finance.mp4';
const card1Video = '/videos/card1.mp4';
const card2Video = '/videos/card2.mp4';
const card3Video = '/videos/card3.mp4';
const card4Video = '/videos/card4.mp4';
const card5Video = '/videos/card5.mp4';
const card6Video = '/videos/card6.mp4';
const systemVideo = '/videos/system.mp4';
const systemCard1Video = '/videos/system-card1.mp4';
const systemCard2Video = '/videos/system-card2.mp4';
const systemCard3Video = '/videos/system-card3.mp4';
const champagneVideo = '/videos/champagne.mp4';

// 이미지 경로 (public 폴더)
// 메인 히어로 배경 이미지
const mainHeroImage = '/images/main/hero/main-hero.jpg';

// 섹션별 이미지
const binocularsImg = '/images/main/sections/binoculars.jpg';
const compassImg = '/images/main/sections/compass.png';
const teamworkImg = '/images/main/sections/teamwork.jpg';
const cruiseImg = '/images/main/sections/cruise.png';

// 전문가 이미지
const expert1Img = '/images/main/experts/expert1.png';
const expert2Img = '/images/main/experts/expert2.png';
const expert3Img = '/images/main/experts/expert3.png';

// 버튼 이미지
const btnLeftActive = '/images/main/buttons/btn-left-active.png';
const btnLeftInactive = '/images/main/buttons/btn-left-inactive.png';
const btnRightActive = '/images/main/buttons/btn-right-active.png';
const btnRightInactive = '/images/main/buttons/btn-right-inactive.png';

// Solution 카드 데이터
const SOLUTION_ROW1 = [
  { title: '법인 전환', items: ['일반양수도', '포괄양수도', '현물출자', '중소기업통합'] },
  { title: '정관 정비', items: ['경영체도', '임원보수설계', '재규정설계'] },
  { title: '명의신탁', items: ['차명주식환원', '신탁확인소송'] },
  { title: '자기주식', items: ['이익금환원', '경영권보장'] },
  { title: '증여/상속\n컨설팅', items: ['주가관리', '배당(증권,정기,현물)', '감액배당'] },
  { title: '세무조사 대응', items: ['모의세무조사', '협업조사', '인력관리'] },
  { title: '성실신고', items: ['세액시뮬레이션'] },
];

const SOLUTION_ROW2 = [
  { title: '자금조달', items: ['증진공', '보증기관', '정책자금'] },
  { title: '벤처기업/\n이노비즈', items: ['창업기업', '세액감면', '정책자금'] },
  { title: '기업부설연구소/\n전담부서', items: ['세액공제', '병역특례', '세액감면'] },
  { title: '산업재산권', items: ['자본구조개선', '이익금 환원', '특허'] },
  { title: 'ISO', items: ['정부과제', '경영효율화'] },
  { title: 'ESG컨설팅', items: ['지속가능경영보고서', '공급망관리'] },
  { title: '기업신용평가', items: ['재무제표분석', '결산전략', '대손전략'] },
];

const SOLUTION_ROW3 = [
  { title: '경리지원\n(아웃소싱)', items: ['통합경영지원시스템', '인력지원'] },
  { title: '외부감사', items: ['감사대응전략', '외감회피', '분할'] },
  { title: '임금 설계', items: ['임직원보상설계', '스톡옵션'] },
  { title: 'KPI', items: ['성과관리지표', '정량·정성분석시스템'] },
  { title: '사내근로\n복지기금', items: ['직원보상관리', '세무관리'] },
  { title: '경정청구', items: ['고용관련세액공제', '지방세', '양도소득세'] },
  { title: '고용지원금', items: ['청년고용지원금', '고용유지지원금', '프리랜서'] },
];

const SOLUTION_ROW4 = [
  { title: 'M&A', items: ['전략수립', '가치극대화', '파이낸싱'] },
  { title: 'IPO', items: ['TIPS', 'VC', 'AC', '기술특례'] },
  { title: '가업승계', items: ['가업상속', '가족법인', '사업무관자산'] },
  { title: '부동산세무', items: ['주택과세', '임대사업자등록세율편'] },
  { title: '부동산개발', items: ['프로젝트리츠', '중소기업통합', 'PFV'] },
  { title: '금융자산관리', items: ['예적금', '채권', '주식', '보험'] },
  { title: '신탁', items: ['사전증여', '차등상속', '경영권승계', '공익신탁'] },
];

// 서비스 카드 데이터
const SERVICE_CARDS = [
  { title: '고객 360° 진단 시스템', subtitle: '전방위적 분석 및 경영진단', video: card1Video },
  { title: '전담 파트너제 운영', subtitle: '상시 관리 즉각 대응', video: card2Video },
  { title: '사전 리스크 진단 & 사후 모니터링 루틴', subtitle: '리스크 점검 후 개선사항 피드백', video: card3Video },
  { title: '실시간 커뮤니케이션', subtitle: '즉각적인 대응이 가능한 시스템', video: card4Video },
  { title: '맞춤형 경영데이터 리포트', subtitle: '업종·규모별로 My Report', video: card5Video },
  { title: '전문가 협업 프로토콜', subtitle: '빈틈없는 통합솔루션 제공', video: card6Video },
];

// 타임라인 데이터 (Solution 02)
const TIMELINE_STEPS = [
  { step: '01', title: '통합적 관점', tags: ['One-Stop Learning'], cols: 1 },
  { step: '02', title: '실무 중심 커리큘럼', tags: ['Work-ready', '커리큘럼명'], cols: 2 },
  { step: '03', title: '크로스펑셔널 멘토링', tags: ['전문가 네트워크'], cols: 3 },
  { step: '04', title: '프로세스 기반 교육', tags: ['문제 해결 프레임워크', '커리큘럼명'], cols: 3 },
  { step: '05', title: '평가-성과 연계', tags: ['학습 → 실적 전환'], cols: 4 },
  { step: '06', title: '유연한 전달 방식', tags: ['On-Off Line', '하이브리드'], cols: 5, highlight: true },
];

// 전문가 카드 데이터
const EXPERTS_CARDS = [
  { name: '박준서', role: '세무사', quote: '창업 초기부터 성장 단계까지,\n든든한 파트너가 되겠습니다.', image: expert1Img },
  { name: '박준서', role: '세무사', quote: '체계적이고\n신뢰할 수 있는 회계 관리', image: expert2Img },
  { name: '박준서', role: '세무사', quote: '적용할 수 있는 실질적인\n세무 서비스를 제공합니다.', image: expert3Img },
  { name: '박준서', role: '세무사', quote: '창업 초기부터 성장 단계까지,\n든든한 파트너가 되겠습니다.', image: expert1Img },
  { name: '박준서', role: '세무사', quote: '체계적이고\n신뢰할 수 있는 회계 관리', image: expert2Img },
];

const Home: React.FC = () => {
  const [headerVariant, setHeaderVariant] = useState<HeaderVariant>('white');
  const [headerSize, setHeaderSize] = useState<HeaderSize>('web');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Hero section refs
  const heroRef = useRef<HTMLDivElement>(null);
  const visionRowRef = useRef<HTMLDivElement>(null);
  const growthRowRef = useRef<HTMLDivElement>(null);
  const crewRowRef = useRef<HTMLDivElement>(null);
  const visionPillRef = useRef<HTMLDivElement>(null);
  const growthPillRef = useRef<HTMLDivElement>(null);
  const crewPillRef = useRef<HTMLDivElement>(null);
  const crewTextRef = useRef<HTMLHeadingElement>(null);
  const expandingVideoRef = useRef<HTMLDivElement>(null);
  const shipTextRef = useRef<HTMLDivElement>(null);
  const mainTitleRef = useRef<HTMLHeadingElement>(null);
  const subTitleRef = useRef<HTMLHeadingElement>(null);
  const financeOverlayRef = useRef<HTMLDivElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);
  const yachtOverlayRef = useRef<HTMLDivElement>(null);
  const yachtContentRef = useRef<HTMLDivElement>(null);
  const visionContentRef = useRef<HTMLDivElement>(null);
  const visionDescriptionRef = useRef<HTMLDivElement>(null);
  const [highlightProgress, setHighlightProgress] = useState(0);

  // Growth section refs
  const growthSectionRef = useRef<HTMLDivElement>(null);
  const growthVisionTextRef = useRef<HTMLHeadingElement>(null);
  const growthOverlayRef = useRef<HTMLDivElement>(null);
  const growthContentRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardsWrapperRef = useRef<HTMLDivElement>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [cardSlideWidth, setCardSlideWidth] = useState(695);

  // Direction section refs
  const directionSectionRef = useRef<HTMLDivElement>(null);
  const directionTextRef = useRef<HTMLHeadingElement>(null);
  const solutionOverlayRef = useRef<HTMLDivElement>(null);
  const solutionContentRef = useRef<HTMLDivElement>(null);
  const solutionLabelRef = useRef<HTMLSpanElement>(null);
  const solutionTitleRef = useRef<HTMLHeadingElement>(null);
  const solutionDescRef = useRef<HTMLParagraphElement>(null);
  const solutionGrid1Ref = useRef<HTMLDivElement>(null);
  const solutionGrid2Ref = useRef<HTMLDivElement>(null);
  const solutionGrid3Ref = useRef<HTMLDivElement>(null);
  const solutionGrid4Ref = useRef<HTMLDivElement>(null);

  // Solution 02 refs
  const solution02SectionRef = useRef<HTMLDivElement>(null);
  const solution02LabelRef = useRef<HTMLSpanElement>(null);
  const solution02TitleRef = useRef<HTMLHeadingElement>(null);
  const solution02DescRef = useRef<HTMLParagraphElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const timelineGridRef = useRef<HTMLDivElement>(null);
  const timelineStepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineColumnRefs = useRef<(HTMLDivElement | null)[]>([]);

  // SYSTEM section refs
  const systemSectionRef = useRef<HTMLDivElement>(null);
  const systemTextRef = useRef<HTMLHeadingElement>(null);
  const systemHeadlineRef = useRef<HTMLHeadingElement>(null);
  const systemDescRef = useRef<HTMLParagraphElement>(null);
  const systemVideoRef = useRef<HTMLDivElement>(null);
  const systemCardsRef = useRef<HTMLDivElement>(null);
  const [systemHighlightProgress, setSystemHighlightProgress] = useState(0);

  // TEAMWORK section refs
  const teamworkSectionRef = useRef<HTMLDivElement>(null);
  const teamworkHeadlineRef = useRef<HTMLHeadingElement>(null);
  const teamworkBgRef = useRef<HTMLDivElement>(null);
  const teamworkTextRef = useRef<HTMLHeadingElement>(null);

  // EXPERTS section refs
  const expertsSectionRef = useRef<HTMLDivElement>(null);
  const expertsHeadlineRef = useRef<HTMLDivElement>(null);
  const expertsDescRef = useRef<HTMLDivElement>(null);
  const expertsCardsRef = useRef<HTMLDivElement>(null);
  const expertsNavRef = useRef<HTMLDivElement>(null);
  const [expertsCardIndex, setExpertsCardIndex] = useState(0);
  const [expertsCardSlideWidth, setExpertsCardSlideWidth] = useState(316);

  // CHAMPAGNE section refs
  const champagneSectionRef = useRef<HTMLDivElement>(null);
  const champagneTextRef = useRef<HTMLDivElement>(null);

  // CRUISE section refs
  const cruiseSectionRef = useRef<HTMLDivElement>(null);
  const cruiseLeftTextRef = useRef<HTMLDivElement>(null);
  const cruiseRightTextRef = useRef<HTMLDivElement>(null);

  // FINAL section refs
  const finalSectionRef = useRef<HTMLDivElement>(null);
  const finalContentRef = useRef<HTMLDivElement>(null);

  // 반응형 슬라이드 너비 업데이트
  // 헤더 크기 업데이트 (리사이즈)
  useEffect(() => {
    const updateHeaderSize = () => {
      const isMobile = window.innerWidth <= 768;
      setHeaderSize(isMobile ? 'mobile' : 'web');
    };

    updateHeaderSize();
    window.addEventListener('resize', updateHeaderSize);
    return () => window.removeEventListener('resize', updateHeaderSize);
  }, []);

  useEffect(() => {
    const updateSlideWidth = () => {
      const vw = window.innerWidth;
      if (vw <= 768) {
        setCardSlideWidth(316);
        setExpertsCardSlideWidth(252);
      } else if (vw <= 1024) {
        setCardSlideWidth(432);
        setExpertsCardSlideWidth(316);
      } else {
        setCardSlideWidth(695);
        setExpertsCardSlideWidth(316);
      }
    };

    updateSlideWidth();
    window.addEventListener('resize', updateSlideWidth);
    return () => window.removeEventListener('resize', updateSlideWidth);
  }, []);

  // Lenis 스무스 스크롤 초기화
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    } as any); // 타입 에러 방지를 위한 임시 처리

    // GSAP ScrollTrigger와 연동
    lenis.on('scroll', ScrollTrigger.update);

    function raf(time: DOMHighResTimeStamp) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // ScrollTrigger 새로고침 (약간의 지연 후)
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      lenis.destroy();
    };
  }, []);

  // 초기 로드 시 VISION/GROWTH/CREW 등장 애니메이션
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!visionRowRef.current || !growthRowRef.current || !crewRowRef.current) return;

    // 초기 로드 애니메이션 타임라인
    const initialTl = gsap.timeline({ delay: 0.3 });

    // VISION: 왼쪽에서 나타나기
    initialTl.to(visionRowRef.current, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, 0);
    initialTl.to(visionPillRef.current, {
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out'
    }, 0);

    // GROWTH: 오른쪽에서 나타나기
    initialTl.to(growthRowRef.current, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, 0.2);
    initialTl.to(growthPillRef.current, {
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out'
    }, 0.2);

    // CREW: 왼쪽에서 나타나기
    initialTl.to(crewRowRef.current, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, 0.4);
    initialTl.to(crewPillRef.current, {
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out'
    }, 0.4);
    initialTl.to(crewTextRef.current, {
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out'
    }, 0.4);

    return () => {
      initialTl.kill();
    };
  }, []);

  // 메인 스크롤 애니메이션
  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth <= 768;
      
      // 헤더 크기 설정
      setHeaderSize(isMobile ? 'mobile' : 'web');

      // ===== HERO SECTION =====
      // 초기 상태 설정 - 모두 숨김 및 위치 설정
      gsap.set(visionRowRef.current, { opacity: 0, x: -100 }); // 왼쪽에서 시작
      gsap.set(growthRowRef.current, { opacity: 0, x: 100 }); // 오른쪽에서 시작
      gsap.set(crewRowRef.current, { opacity: 0, x: -100 }); // 왼쪽에서 시작
      gsap.set([visionPillRef.current, growthPillRef.current, crewPillRef.current], { opacity: 0 });
      gsap.set(crewTextRef.current, { opacity: 0, width: 'auto' });
      gsap.set(expandingVideoRef.current, { opacity: 0, display: 'none', visibility: 'hidden' });
      gsap.set(shipTextRef.current, { opacity: 0 });
      gsap.set([mainTitleRef.current, subTitleRef.current], { opacity: 0, y: 50 });
      gsap.set(financeOverlayRef.current, { opacity: 0 });
      gsap.set([leftContentRef.current, rightContentRef.current], { opacity: 0, y: 50 });
      gsap.set(yachtOverlayRef.current, { opacity: 0 });
      gsap.set(yachtContentRef.current, { opacity: 0, y: 50 });
      gsap.set(visionContentRef.current, { opacity: 0 });

      // Hero 타임라인 - 스크롤 기반
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=25000',
          pin: true,
          scrub: 4,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            // 헤더 변경
            if (self.progress > 0.1) {
              setHeaderVariant('transparent');
            } else {
              setHeaderVariant('white');
            }
            // 하이라이트 진행률 (Vision content 부분)
            if (self.progress > 0.75 && self.progress < 0.95) {
              const highlightProg = (self.progress - 0.75) / 0.2 * 100;
              setHighlightProgress(Math.min(100, highlightProg));
            }
          },
        },
      });

      // Phase 1: VISION/GROWTH/CREW 텍스트 사라짐 (0% - 2%)
      // 초기 로드 애니메이션으로 이미 나타난 상태에서 시작
      heroTl.to([visionRowRef.current, growthRowRef.current, crewRowRef.current], {
        opacity: 0,
        x: 0, // x 위치는 유지 (초기 로드 애니메이션으로 이미 0으로 이동함)
        duration: 0.02
      }, 0);
      heroTl.to(crewTextRef.current, {
        opacity: 0,
        width: 0,
        marginLeft: 0,
        marginRight: 0,
        duration: 0.02
      }, 0);
      heroTl.to([visionPillRef.current, growthPillRef.current], {
        opacity: 0,
        duration: 0.02
      }, 0);

      // Phase 2: 크루 pill 중앙 이동 후 비디오 확장 (2% - 20%)
      heroTl.to(crewPillRef.current, {
        opacity: 0,
        duration: 0.05
      }, 0.02);
      heroTl.to(expandingVideoRef.current, {
        opacity: 1,
        display: 'block',
        visibility: 'visible',
        duration: 0.15
      }, 0.04);

      // Phase 3: Ship 텍스트 등장 (20% - 30%) - Figma 디자인에 맞게
      heroTl.to(shipTextRef.current, { opacity: 1, duration: 0.08 }, 0.20);
      heroTl.to(mainTitleRef.current, { opacity: 1, y: 0, duration: 0.08 }, 0.22);
      heroTl.to(subTitleRef.current, { opacity: 1, y: 0, duration: 0.08 }, 0.24);

      // Phase 4: Finance overlay 등장 (30% - 45%)
      heroTl.to(shipTextRef.current, { opacity: 0, duration: 0.05 }, 0.30);
      heroTl.to(financeOverlayRef.current, { opacity: 1, duration: 0.05 }, 0.32);
      heroTl.to(leftContentRef.current, { opacity: 1, y: 0, duration: 0.05 }, 0.35);
      heroTl.to(rightContentRef.current, { opacity: 1, y: 0, duration: 0.05 }, 0.40);

      // Phase 5: Yacht overlay 등장 (45% - 60%)
      heroTl.to(financeOverlayRef.current, { opacity: 0, duration: 0.05 }, 0.45);
      heroTl.to(yachtOverlayRef.current, { opacity: 1, duration: 0.05 }, 0.47);
      heroTl.to(yachtContentRef.current, { opacity: 1, y: 0, duration: 0.05 }, 0.50);

      // Phase 6: Vision content 등장 (60% - 100%)
      heroTl.to(yachtOverlayRef.current, { opacity: 0, duration: 0.1 }, 0.60);
      heroTl.to(expandingVideoRef.current, { opacity: 0, duration: 0.1 }, 0.60);
      heroTl.to(visionContentRef.current, { opacity: 1, duration: 0.1 }, 0.65);

      // ===== GROWTH SECTION =====
      gsap.set(growthVisionTextRef.current, { opacity: 0 });
      gsap.set(growthOverlayRef.current, { opacity: 0 });
      gsap.set(growthContentRef.current, { opacity: 0 });
      gsap.set(cardsContainerRef.current, { opacity: 0 });

      const growthTl = gsap.timeline({
        scrollTrigger: {
          trigger: growthSectionRef.current,
          start: 'top top',
          end: '+=18000',
          pin: true,
          scrub: 4,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            // 카드 인덱스 업데이트 (스크롤에 따라)
            if (self.progress > 0.5) {
              const cardProgress = (self.progress - 0.5) / 0.5;
              const newIndex = Math.floor(cardProgress * SERVICE_CARDS.length);
              setCardIndex(Math.min(newIndex, SERVICE_CARDS.length - 1));
            }
          },
        },
      });

      growthTl.to(growthVisionTextRef.current, { opacity: 1, duration: 0.15 }, 0);
      growthTl.to(growthVisionTextRef.current, { opacity: 0, duration: 0.1 }, 0.2);
      growthTl.to(growthOverlayRef.current, { opacity: 1, duration: 0.1 }, 0.25);
      growthTl.to(growthContentRef.current, { opacity: 1, duration: 0.1 }, 0.30);
      growthTl.to(cardsContainerRef.current, { opacity: 1, duration: 0.1 }, 0.35);

      // ===== DIRECTION SECTION =====
      gsap.set(directionTextRef.current, { opacity: 0 });
      gsap.set(solutionOverlayRef.current, { opacity: 0 });
      gsap.set(solutionContentRef.current, { opacity: 0 });
      gsap.set(solutionLabelRef.current, { opacity: 0 });
      gsap.set(solutionTitleRef.current, { opacity: 0 });
      gsap.set(solutionDescRef.current, { opacity: 0 });
      gsap.set(solutionGrid1Ref.current, { opacity: 0 });
      gsap.set(solutionGrid2Ref.current, { opacity: 0 });
      gsap.set(solutionGrid3Ref.current, { opacity: 0 });
      gsap.set(solutionGrid4Ref.current, { opacity: 0 });

      const directionTl = gsap.timeline({
        scrollTrigger: {
          trigger: directionSectionRef.current,
          start: 'top top',
          end: '+=20000',
          pin: true,
          scrub: 4,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      directionTl.to(directionTextRef.current, { opacity: 1, duration: 0.1 }, 0);
      directionTl.to(directionTextRef.current, { opacity: 0, duration: 0.05 }, 0.15);
      directionTl.to(solutionOverlayRef.current, { opacity: 1, duration: 0.05 }, 0.18);
      directionTl.to(solutionContentRef.current, { opacity: 1, duration: 0.05 }, 0.20);
      directionTl.to(solutionLabelRef.current, { opacity: 1, duration: 0.05 }, 0.25);
      directionTl.to(solutionTitleRef.current, { opacity: 1, duration: 0.05 }, 0.30);
      directionTl.to(solutionDescRef.current, { opacity: 1, duration: 0.05 }, 0.35);
      directionTl.to(solutionGrid1Ref.current, { opacity: 1, duration: 0.1 }, 0.45);
      directionTl.to(solutionGrid2Ref.current, { opacity: 1, duration: 0.1 }, 0.55);
      directionTl.to(solutionGrid3Ref.current, { opacity: 1, duration: 0.1 }, 0.65);
      directionTl.to(solutionGrid4Ref.current, { opacity: 1, duration: 0.1 }, 0.75);

      // ===== SOLUTION 02 SECTION =====
      gsap.set(solution02LabelRef.current, { opacity: 0 });
      gsap.set(solution02TitleRef.current, { opacity: 0 });
      gsap.set(solution02DescRef.current, { opacity: 0 });
      gsap.set(timelineContainerRef.current, { opacity: 0 });
      timelineColumnRefs.current.forEach((col) => {
        if (col) gsap.set(col, { opacity: 0 });
      });
      timelineStepRefs.current.forEach((step) => {
        if (step) gsap.set(step, { opacity: 0 });
      });

      const solution02Tl = gsap.timeline({
        scrollTrigger: {
          trigger: solution02SectionRef.current,
          start: 'top top',
          end: '+=18000',
          pin: true,
          scrub: 4,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      solution02Tl.to(solution02LabelRef.current, { opacity: 1, duration: 0.1 }, 0);
      solution02Tl.to(solution02TitleRef.current, { opacity: 1, duration: 0.1 }, 0.1);
      solution02Tl.to(solution02DescRef.current, { opacity: 1, duration: 0.1 }, 0.2);
      solution02Tl.to(timelineContainerRef.current, { opacity: 1, duration: 0.1 }, 0.3);

      // 타임라인 스텝 순차 등장
      TIMELINE_STEPS.forEach((step, index) => {
        const startTime = 0.4 + index * 0.1;
        const colsNeeded = step.cols;
        for (let i = 0; i < colsNeeded; i++) {
          const col = timelineColumnRefs.current[i];
          if (col) {
            solution02Tl.to(col, { opacity: 1, duration: 0.05 }, startTime);
          }
        }
        const stepEl = timelineStepRefs.current[index];
        if (stepEl) {
          solution02Tl.to(stepEl, { opacity: 1, duration: 0.08 }, startTime + 0.02);
        }
      });

      // ===== SYSTEM SECTION =====
      gsap.set(systemTextRef.current, {
        fontSize: isMobile ? '50px' : '265px',
        opacity: 1
      });
      gsap.set(systemHeadlineRef.current, { opacity: 0 });
      gsap.set(systemDescRef.current, { opacity: 0 });
      gsap.set(systemVideoRef.current, { opacity: 0 });
      gsap.set(systemCardsRef.current, { opacity: 0 });

      const systemTl = gsap.timeline({
        scrollTrigger: {
          trigger: systemSectionRef.current,
          start: 'top top',
          end: '+=20000',
          pin: true,
          scrub: 4,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            // 시스템 하이라이트 진행률
            if (self.progress > 0.25 && self.progress < 0.45) {
              const highlightProg = (self.progress - 0.25) / 0.2 * 100;
              setSystemHighlightProgress(Math.min(100, highlightProg));
            }
          },
        },
      });

      // SYSTEM 텍스트 축소
      systemTl.to(systemTextRef.current, {
        fontSize: isMobile ? '14px' : '26px',
        duration: 0.15
      }, 0);

      // 헤드라인, 설명 등장
      systemTl.to(systemHeadlineRef.current, { opacity: 1, duration: 0.1 }, 0.15);
      systemTl.to(systemDescRef.current, { opacity: 1, duration: 0.1 }, 0.25);

      // 텍스트 사라지고 비디오 등장
      systemTl.to([systemTextRef.current, systemHeadlineRef.current, systemDescRef.current], {
        opacity: 0,
        duration: 0.1
      }, 0.50);
      systemTl.to(systemVideoRef.current, { opacity: 1, duration: 0.15 }, 0.55);

      // 비디오 크기 조정 및 카드 등장
      systemTl.to(systemVideoRef.current, {
        width: isMobile ? '100%' : '55vw',
        height: isMobile ? '191px' : 'calc(100vh - 160px)',
        left: isMobile ? '0' : '64px',
        borderRadius: '24px',
        duration: 0.15
      }, 0.70);
      systemTl.to(systemCardsRef.current, { opacity: 1, duration: 0.15 }, 0.80);

      // ===== TEAMWORK SECTION =====
      gsap.set(teamworkHeadlineRef.current, { opacity: 1 });
      gsap.set(teamworkBgRef.current, { opacity: 0 });
      gsap.set(teamworkTextRef.current, { opacity: 0 });

      const teamworkTl = gsap.timeline({
        scrollTrigger: {
          trigger: teamworkSectionRef.current,
          start: 'top top',
          end: '+=12000',
          pin: true,
          scrub: 4,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      teamworkTl.to(teamworkHeadlineRef.current, { opacity: 0, duration: 0.2 }, 0);
      teamworkTl.to(teamworkBgRef.current, { opacity: 1, duration: 0.3 }, 0.1);
      teamworkTl.to(teamworkTextRef.current, { opacity: 1, duration: 0.2 }, 0.5);

      // ===== EXPERTS SECTION =====
      gsap.set(expertsHeadlineRef.current, { opacity: 0 });
      gsap.set(expertsDescRef.current, { opacity: 0 });
      gsap.set(expertsNavRef.current, { opacity: 0 });
      gsap.set(expertsCardsRef.current, { opacity: 0 });

      const expertsTl = gsap.timeline({
        scrollTrigger: {
          trigger: expertsSectionRef.current,
          start: 'top top',
          end: '+=14000',
          pin: true,
          scrub: 4,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            // 전문가 카드 인덱스 업데이트
            if (self.progress > 0.6) {
              const cardProgress = (self.progress - 0.6) / 0.4;
              const newIndex = Math.floor(cardProgress * EXPERTS_CARDS.length);
              setExpertsCardIndex(Math.min(newIndex, EXPERTS_CARDS.length - 1));
            }
          },
        },
      });

      expertsTl.to(expertsHeadlineRef.current, { opacity: 1, duration: 0.15 }, 0);
      expertsTl.to(expertsDescRef.current, { opacity: 1, duration: 0.15 }, 0.15);
      expertsTl.to(expertsNavRef.current, { opacity: 1, duration: 0.1 }, 0.30);
      expertsTl.to(expertsCardsRef.current, { opacity: 1, duration: 0.15 }, 0.40);

      // ===== CHAMPAGNE SECTION =====
      gsap.set(champagneTextRef.current, { opacity: 0 });

      const champagneTl = gsap.timeline({
        scrollTrigger: {
          trigger: champagneSectionRef.current,
          start: 'top top',
          end: '+=10000',
          pin: true,
          scrub: 4,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      champagneTl.to(champagneTextRef.current, { opacity: 1, duration: 0.3 }, 0.2);

      // ===== CRUISE SECTION =====
      gsap.set(cruiseLeftTextRef.current, { opacity: 0 });
      gsap.set(cruiseRightTextRef.current, { opacity: 0 });

      const cruiseTl = gsap.timeline({
        scrollTrigger: {
          trigger: cruiseSectionRef.current,
          start: 'top top',
          end: '+=12000',
          pin: true,
          scrub: 4,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      cruiseTl.to(cruiseLeftTextRef.current, { opacity: 1, duration: 0.3 }, 0);
      cruiseTl.to(cruiseRightTextRef.current, { opacity: 1, duration: 0.3 }, 0.4);

      // ===== FINAL SECTION =====
      gsap.set(finalContentRef.current, { opacity: 0, y: 50 });

      const finalTl = gsap.timeline({
        scrollTrigger: {
          trigger: finalSectionRef.current,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 2,
          invalidateOnRefresh: true,
        },
      });

      finalTl.to(finalContentRef.current, { opacity: 1, y: 0, duration: 1 }, 0);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="home-container" ref={containerRef}>
      <Header 
        variant={headerVariant} 
        size={headerSize}
        onMenuClick={() => setIsMenuOpen(true)}
        isFixed={true}
      />
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* HERO SECTION */}
      <section className="hero-section" ref={heroRef}>
        <div className="hero-content">
          <div className="text-row" ref={visionRowRef}>
            <div className="video-pill" ref={visionPillRef}>
              <video autoPlay muted loop playsInline>
                <source src={visionVideo} type="video/mp4" />
              </video>
            </div>
            <h2 className="hero-text">VISION</h2>
          </div>

          <div className="text-row" ref={growthRowRef}>
            <h2 className="hero-text">GROWTH</h2>
            <div className="video-pill" ref={growthPillRef}>
              <video autoPlay muted loop playsInline>
                <source src={growthVideo} type="video/mp4" />
              </video>
            </div>
          </div>

          <div className="text-row" ref={crewRowRef}>
            <div className="video-pill" ref={crewPillRef}>
              <video autoPlay muted loop playsInline>
                <source src={crewVideo} type="video/mp4" />
              </video>
            </div>
            <h2 className="hero-text" ref={crewTextRef}>CREW</h2>
          </div>
        </div>

        <div className="expanding-video" ref={expandingVideoRef}>
          <img src={mainHeroImage} alt="Main Hero Background" className="hero-background-image" />
          <div className="video-overlay" />
        </div>

        <div className="ship-text-content" ref={shipTextRef}>
          <h1 className="main-title" ref={mainTitleRef}>모두 컨설팅과 함께라면,</h1>
          <h2 className="sub-title" ref={subTitleRef}>세무사의 항해는<br className="mobile-br" />1등의 여정이 됩니다.</h2>
        </div>

        <div className="finance-overlay" ref={financeOverlayRef}>
          <div className="finance-video-background">
            <video autoPlay muted loop playsInline>
              <source src={financeVideo} type="video/mp4" />
            </video>
          </div>
          <div className="finance-content">
            <div className="left-content" ref={leftContentRef}>
              <h2 className="finance-title">복잡한 재무의 바다,<br />혼자라면<br />길을 잃기 쉽습니다.</h2>
            </div>
            <div className="right-content" ref={rightContentRef}>
              <p className="right-title">하지만 함께라면,<br />그 길은 곧<br /><strong>수익의 항로</strong>로 이어집니다.</p>
              <div className="right-description">보험·펀드·신탁·법인자산관리까지<br />세무사의 전문성을 확장시키는<br />종합 재무설계 트레이닝 플랫폼.<br />배움이 생산성을 만들고,<br />생산성이 곧 자연스러운 수익으로 이어집니다.</div>
              <p className="right-cta">당신의 첫 항해,<br />지금 함께 시작하세요.</p>
            </div>
          </div>
        </div>

        <div className="yacht-overlay" ref={yachtOverlayRef}>
          <div className="yacht-video-background">
            <video autoPlay muted loop playsInline>
              <source src={yachtVideo} type="video/mp4" />
            </video>
          </div>
          <div className="yacht-content" ref={yachtContentRef}>
            <h2 className="yacht-title">최고가 되는 공식,<br />우리는 그 답을 알고 있습니다</h2>
          </div>
        </div>

        <div className="vision-content" ref={visionContentRef}>
          <h2 className="vision-title">우리는 단순히<br className="mobile-br" /><span className="nowrap">멀리 보는 것이 아니라,</span><br /><span className="mobile-spacer" />정확히 &apos;어디로<br className="mobile-br" /><span className="nowrap">향해야 하는지&apos; 를 봅니다</span></h2>
          <div className="vision-description" ref={visionDescriptionRef}>
            {(() => {
              const lines = [
                "모두컨설팅의 비전은",
                "세무사의 경쟁력을 현재의 지식이 아닌",
                "'미래의 설계 능력'으로 확장하는 것입니다."
              ];
              const text = lines.join('');
              const totalChars = text.length;
              const highlightedChars = Math.floor((highlightProgress / 100) * totalChars);

              let charIndex = 0;
              return lines.map((line, lineIndex) => (
                <span key={lineIndex} className="nowrap">
                  {line.split('').map((char) => {
                    const currentIndex = charIndex++;
                    return (
                      <span key={currentIndex} className={`highlight-char ${currentIndex < highlightedChars ? 'active' : ''}`}>
                        {char}
                      </span>
                    );
                  })}
                  {lineIndex < lines.length - 1 && <br />}
                </span>
              ));
            })()}
          </div>
        </div>
      </section>

      {/* GROWTH SECTION */}
      <section className="growth-section" ref={growthSectionRef}>
        <div className="growth-background">
          <img src={binocularsImg} alt="Binoculars looking at the sea" />
        </div>
        <h2 className="growth-vision-text" ref={growthVisionTextRef}>Vision</h2>
        <div className="growth-overlay" ref={growthOverlayRef} />
        <div className="growth-content" ref={growthContentRef}>
          <div className="growth-left-content">
            <div className="growth-main-title">
              <p>Thinking like</p>
              <p>your company.</p>
              <p>Acting as your partner.</p>
            </div>
            <div className="growth-description">
              <p>고객의 성장은 우리의 성장입니다.</p>
              <p>고객의 어려움 앞에서 한발 더 다가가고,</p>
              <p>해결의 순간까지 함께 머무는 것 —</p>
              <p>그것이 우리가 &apos;내 회사처럼&apos; 일한다는 뜻입니다.</p>
            </div>
          </div>
          <div className="cards-container" ref={cardsContainerRef}>
            <div className="cards-navigation">
              <button
                className="nav-button"
                disabled={cardIndex === 0}
                onClick={(e) => {
                  e.stopPropagation();
                  setCardIndex(Math.max(0, cardIndex - 1));
                }}
              >
                <img src={cardIndex === 0 ? btnLeftInactive : btnLeftActive} alt="Previous" />
              </button>
              <button
                className="nav-button"
                disabled={cardIndex >= SERVICE_CARDS.length - 1}
                onClick={(e) => {
                  e.stopPropagation();
                  setCardIndex(Math.min(SERVICE_CARDS.length - 1, cardIndex + 1));
                }}
              >
                <img src={cardIndex >= SERVICE_CARDS.length - 1 ? btnRightInactive : btnRightActive} alt="Next" />
              </button>
            </div>
            <div className="cards-wrapper" ref={cardsWrapperRef} style={{ transform: `translateX(-${cardIndex * cardSlideWidth}px)` }}>
              {SERVICE_CARDS.map((card, index) => (
                <div className="service-card" key={index}>
                  <div className="card-header">
                    <h3 className="card-title">{card.title}</h3>
                    <ul className="card-subtitle">
                      <li>{card.subtitle}</li>
                    </ul>
                  </div>
                  <div className="card-image">
                    <video autoPlay muted loop playsInline>
                      <source src={card.video} type="video/mp4" />
                    </video>
                  </div>
                </div>
              ))}
            </div>
            <div className="cards-progress">
              <div className="cards-progress-bar" style={{ width: `${((cardIndex + 1) / SERVICE_CARDS.length) * 100}%` }} />
            </div>
          </div>
        </div>
      </section>

      {/* DIRECTION SECTION */}
      <section className="direction-section" ref={directionSectionRef}>
        <div className="direction-background">
          <img src={compassImg} alt="Compass" />
        </div>
        <h2 className="direction-text" ref={directionTextRef}>Direction</h2>
        <div className="solution-overlay" ref={solutionOverlayRef} />
        <div className="solution-content" ref={solutionContentRef}>
          <span className="solution-label" ref={solutionLabelRef}>Solution 01</span>
          <h2 className="solution-title" ref={solutionTitleRef}>End-to-End<br className="mobile-br" />Strategic Solution</h2>
          <p className="solution-description" ref={solutionDescRef}>
            세무사의 전문성을 기반으로,<br className="mobile-br" /> 보험·펀드·신탁·법인 재무까지 아우르는<br />
            통합형 실무 트레이닝 시스템을 제공합니다.<br />
            세무사의 판단력과 실행력을 동시에 강화합니다.
          </p>
          <div className="solution-grid solution-grid-left" ref={solutionGrid1Ref}>
            <div className="solution-marquee-wrapper">
              {[...SOLUTION_ROW1, ...SOLUTION_ROW1].map((card, index) => (
                <div className="solution-card" key={index}>
                  <h4 className="solution-card-title" style={{ whiteSpace: 'pre-line' }}>{card.title}</h4>
                  <ul className="solution-card-items">
                    {card.items.map((item, i) => (<li key={i}>{item}</li>))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="solution-grid solution-grid-right" ref={solutionGrid2Ref}>
            <div className="solution-marquee-wrapper">
              {[...SOLUTION_ROW2, ...SOLUTION_ROW2].map((card, index) => (
                <div className="solution-card" key={index}>
                  <h4 className="solution-card-title" style={{ whiteSpace: 'pre-line' }}>{card.title}</h4>
                  <ul className="solution-card-items">
                    {card.items.map((item, i) => (<li key={i}>{item}</li>))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="solution-grid solution-grid-left" ref={solutionGrid3Ref}>
            <div className="solution-marquee-wrapper">
              {[...SOLUTION_ROW3, ...SOLUTION_ROW3].map((card, index) => (
                <div className="solution-card" key={index}>
                  <h4 className="solution-card-title" style={{ whiteSpace: 'pre-line' }}>{card.title}</h4>
                  <ul className="solution-card-items">
                    {card.items.map((item, i) => (<li key={i}>{item}</li>))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="solution-grid solution-grid-right" ref={solutionGrid4Ref}>
            <div className="solution-marquee-wrapper">
              {[...SOLUTION_ROW4, ...SOLUTION_ROW4].map((card, index) => (
                <div className="solution-card" key={index}>
                  <h4 className="solution-card-title" style={{ whiteSpace: 'pre-line' }}>{card.title}</h4>
                  <ul className="solution-card-items">
                    {card.items.map((item, i) => (<li key={i}>{item}</li>))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTION 02 SECTION */}
      <section className="solution02-section" ref={solution02SectionRef}>
        <div className="solution02-background" />
        <div className="solution02-content">
          <span className="solution02-label" ref={solution02LabelRef}>Solution 02</span>
          <h2 className="solution02-title" ref={solution02TitleRef}>Integrated Strategic Solution</h2>
          <p className="solution02-description" ref={solution02DescRef}>
            고객의 여정을 처음부터 끝까지 함께하며, 완전한 수익 창출 솔루션을 제시합니다.
          </p>

          <div className="timeline-container" ref={timelineContainerRef}>
            <div className="timeline-grid" ref={timelineGridRef}>
              {/* 컬럼 헤더 */}
              <div className="timeline-header">
                {[1, 2, 3, 4, 5].map((num, index) => (
                  <div
                    key={index}
                    className="timeline-column-header"
                    ref={(el) => { timelineColumnRefs.current[index] = el; }}
                  >
                    DAY 0{num}
                  </div>
                ))}
              </div>

              {/* 세로 구분선 */}
              <div className="timeline-edge-line timeline-edge-left" />
              <div className="timeline-edge-line timeline-edge-right" />
              <div className="timeline-columns">
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <div key={index} className="timeline-column-line" />
                ))}
              </div>

              {/* 타임라인 스텝들 */}
              <div className="timeline-steps">
                {TIMELINE_STEPS.map((step, index) => (
                  <div
                    key={index}
                    className={`timeline-step timeline-step-${index + 1}`}
                    ref={(el) => { timelineStepRefs.current[index] = el; }}
                    style={{ gridColumn: `1 / span ${step.cols}` }}
                  >
                    <div className="step-header">
                      <span className="step-number">STEP {step.step}</span>
                      <span className="step-line">
                        <span className="line-dot" />
                        <span className="line-bar" />
                        <span className="line-arrow" />
                      </span>
                      <span className="step-title">{step.title}</span>
                    </div>
                    <div className="step-tags">
                      {step.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className={`step-tag ${step.highlight && tagIndex === step.tags.length - 1 ? 'highlight' : ''}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SYSTEM SECTION */}
      <section className="system-section" ref={systemSectionRef}>
        <div className="system-background" />

        <h2 className="system-text" ref={systemTextRef}>SYSTEM</h2>

        <h3 className="system-headline" ref={systemHeadlineRef}>
          가장 짧은 시간에<br className="mobile-br" /> 가장 빠른 속도로<br />
          본업의 성장과<br className="mobile-br" /> 소득 증대 시스템 구축
        </h3>

        <p className="system-description" ref={systemDescRef}>
          {(() => {
            const line1 = "모두 컨설팅은 전문직 맞춤형 법인 ";
            const dbText = "DB";
            const line2 = "와";
            const line3 = "실전 케이스로 당신의 지식을";
            const line4 = "바로 실행으로 전환합니다.";
            const fullText = line1 + dbText + line2 + line3 + line4;
            const totalChars = fullText.length;
            const highlightedChars = Math.floor((systemHighlightProgress / 100) * totalChars);

            let charIndex = 0;
            const renderChars = (text: string, isDB = false) => {
              return text.split('').map((char) => {
                const currentIndex = charIndex++;
                return (
                  <span key={currentIndex} className={`system-highlight-char ${isDB ? 'db-char ' : ''}${currentIndex < highlightedChars ? 'active' : ''}`}>
                    {char}
                  </span>
                );
              });
            };

            return (
              <>
                {renderChars(line1)}
                {renderChars(dbText, true)}
                {renderChars(line2)}
                <br className="mobile-br" />
                {renderChars(line3)}
                <br className="mobile-br" />
                {renderChars(line4)}
              </>
            );
          })()}
        </p>

        <div className="system-video-container" ref={systemVideoRef}>
          <div className="system-video-wrapper">
            <video autoPlay muted loop playsInline>
              <source src={systemVideo} type="video/mp4" />
            </video>
          </div>
          <div className="system-video-overlay">
            <p className="system-video-text">
              Income<br />
              Expansion System
            </p>
          </div>
        </div>

        <div className="system-cards" ref={systemCardsRef}>
          <div className="system-card">
            <div className="system-card-image">
              <video autoPlay muted loop playsInline>
                <source src={systemCard1Video} type="video/mp4" />
              </video>
            </div>
            <div className="system-card-content">
              <span className="system-card-label">Expert</span>
              <h4 className="system-card-title">전문가로부터 전문가에게</h4>
              <p className="system-card-desc">
                우리는 단순히 정보를 전달하지 않습니다.<br />
                컨설팅 현장에서 직접 문제를 해결한 전문가가, 복잡한 상황 속 핵심 포인트와 실무 전략을 지속적으로 나누어, 고객과 학습자가 <strong>스스로 문제를 해결할 수 있는 힘</strong>을 기르도록 돕습니다.
              </p>
            </div>
          </div>

          <div className="system-card">
            <div className="system-card-image">
              <video autoPlay muted loop playsInline>
                <source src={systemCard2Video} type="video/mp4" />
              </video>
            </div>
            <div className="system-card-content">
              <span className="system-card-label">Save Toolkit</span>
              <h4 className="system-card-title">컨설팅 실행 툴셋</h4>
              <p className="system-card-desc">
                실무에서 바로 쓰는 도구들을 한 곳에서 만나보세요.<br />
                세무, 기업 분석, 경리, 보고서, 영업, 교육까지 — <strong>taxbot-R, cretop, wecake, CEO클리닉, AP제안서, 파인즈</strong>가 필요한 업무를 손쉽게 지원합니다.
              </p>
            </div>
          </div>

          <div className="system-card">
            <div className="system-card-image">
              <video autoPlay muted loop playsInline>
                <source src={systemCard3Video} type="video/mp4" />
              </video>
            </div>
            <div className="system-card-content">
              <span className="system-card-label">Strategic Collaboration</span>
              <h4 className="system-card-title">함께 만드는 성과</h4>
              <p className="system-card-desc">
                법률, 노무, M&A, 부동산, IT 등 각 분야 전문가들과 함께,<br />
                단순 조언이 아닌 <strong>실제 실행 가능한 솔루션</strong>을 제공합니다.<br />
                협업을 통해 더 큰 시너지를 만들고, 고객의 목표 달성을 돕습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TEAMWORK SECTION */}
      <section className="teamwork-section" ref={teamworkSectionRef}>
        <div className="teamwork-background" ref={teamworkBgRef}>
          <img src={teamworkImg} alt="Teamwork - People collaborating on ship" />
        </div>

        <h2 className="teamwork-headline" ref={teamworkHeadlineRef}>
          이제는 전문가들과<br />
          함께 협업하는<br />
          팀워크의 시대
        </h2>

        <h2 className="teamwork-text" ref={teamworkTextRef}>
          <span className="teamwork-text-line">TEAM</span>
          <span className="teamwork-text-line">WORK</span>
        </h2>
      </section>

      {/* EXPERTS SECTION */}
      <section className="experts-section" ref={expertsSectionRef}>
        <div className="experts-headline" ref={expertsHeadlineRef}>
          <h2>세무사·회계사·노무사·변호사 등</h2>
          <h2>각 분야의 전문가들과 협업하여</h2>
          <h2>입체적인 재무 설계 솔루션을</h2>
          <h2>제공합니다.</h2>
        </div>

        <div className="experts-desc" ref={expertsDescRef}>
          <p>
            VIP 고객은 이제 단편적 자문이 아니라<br />
            다각적 전략 컨설팅을 원합니다.<br />
            모두컨설팅은 이 시대의 요구에 맞는<br />
            &apos;팀 단위의 항해&apos; 플랫폼을 제공합니다.
          </p>
        </div>

        <div className="experts-nav" ref={expertsNavRef}>
          <button
            className="nav-button"
            disabled={expertsCardIndex === 0}
            onClick={(e) => {
              e.stopPropagation();
              setExpertsCardIndex(Math.max(0, expertsCardIndex - 1));
            }}
          >
            <img src={expertsCardIndex === 0 ? btnLeftInactive : btnLeftActive} alt="Previous" />
          </button>
          <button
            className="nav-button"
            disabled={expertsCardIndex >= EXPERTS_CARDS.length - 1}
            onClick={(e) => {
              e.stopPropagation();
              setExpertsCardIndex(Math.min(EXPERTS_CARDS.length - 1, expertsCardIndex + 1));
            }}
          >
            <img src={expertsCardIndex >= EXPERTS_CARDS.length - 1 ? btnRightInactive : btnRightActive} alt="Next" />
          </button>
        </div>

        <div className="experts-cards" ref={expertsCardsRef}>
          <div
            className="experts-cards-wrapper"
            style={{ transform: `translateX(-${expertsCardIndex * expertsCardSlideWidth}px)` }}
          >
            {EXPERTS_CARDS.map((expert, index) => (
              <div className="expert-card" key={index}>
                <div className="expert-image">
                  <img src={expert.image} alt={expert.name} />
                </div>
                <div className="expert-info">
                  <img className="expert-quote-icon" src="/images/main/icons/quote-icon.svg" alt="quote" />
                  <p className="expert-quote">{expert.quote}</p>
                  <div className="expert-name-row">
                    <span className="expert-name">{expert.name}</span>
                    <span className="expert-role">{expert.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHAMPAGNE SECTION */}
      <section className="champagne-section" ref={champagneSectionRef}>
        <video
          className="champagne-video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={champagneVideo} type="video/mp4" />
        </video>
        <div className="champagne-content" ref={champagneTextRef}>
          <h2>입증된 전문성,</h2>
          <h2>성과로 이어지는 수익 구조</h2>
        </div>
      </section>

      {/* CRUISE SECTION */}
      <section className="cruise-section" ref={cruiseSectionRef}>
        <div className="cruise-background">
          <img src={cruiseImg} alt="Cruise ship at sunset" />
        </div>
        <div className="cruise-left-text" ref={cruiseLeftTextRef}>
          <p>모두컨설팅은</p>
          <p>누적된 실적, 데이터,</p>
          <p>네트워크를 기반으로</p>
        </div>
        <div className="cruise-right-text" ref={cruiseRightTextRef}>
          <p>당신의 브랜드를</p>
          <p>&apos;1등 세무사&apos;로 완성합니다</p>
        </div>
      </section>

      {/* FINAL SECTION */}
      <section className="final-section" ref={finalSectionRef}>
        <div className="final-content" ref={finalContentRef}>
          <h2 className="final-title">모두가 함께하고 있습니다.</h2>
          <h2 className="final-subtitle">이제, 당신만 오시면 완성됩니다</h2>
          <button className="final-cta">모두컨설팅과 함께하기 &gt;</button>
        </div>
        <Footer />
      </section>
    </div>
  );
};

export default Home;
