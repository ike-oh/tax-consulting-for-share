import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '@/components/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/Footer';

// GSAP 플러그인 등록 (ssr: false로 클라이언트에서만 실행되므로 안전)
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
const binocularsImg = '/images/binoculars.jpg';
const compassImg = '/images/compass.png';
const teamworkImg = '/images/teamwork.jpg';
const expert1Img = '/images/expert1.png';
const expert2Img = '/images/expert2.png';
const expert3Img = '/images/expert3.png';
const cruiseImg = '/images/cruise.png';
const btnLeftActive = '/images/buttons/btn-left-active.png';
const btnLeftInactive = '/images/buttons/btn-left-inactive.png';
const btnRightActive = '/images/buttons/btn-right-active.png';
const btnRightInactive = '/images/buttons/btn-right-inactive.png';

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
  const [headerVariant, setHeaderVariant] = useState<'white' | 'transparent'>('white');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
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
  const blackOverlayRef = useRef<HTMLDivElement>(null);
  const visionContentRef = useRef<HTMLDivElement>(null);
  const visionDescriptionRef = useRef<HTMLDivElement>(null);
  const [highlightProgress, setHighlightProgress] = useState(0);
  const growthSectionRef = useRef<HTMLDivElement>(null);
  const growthVisionTextRef = useRef<HTMLHeadingElement>(null);
  const growthOverlayRef = useRef<HTMLDivElement>(null);
  const growthContentRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardsWrapperRef = useRef<HTMLDivElement>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [cardSlideWidth, setCardSlideWidth] = useState(695);
  const cardIndexRef = useRef(0);
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
  const expertsCardIndexRef = useRef(0);

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

  useEffect(() => {
    const updateSlideWidth = () => {
      const vw = window.innerWidth;
      // 모바일: 카드 너비 300px + gap 16px = 316px
      // 태블릿: 카드 너비 300px + gap 32px = 332px
      // 데스크탑: 카드 너비 663px + gap 32px = 695px
      if (vw <= 768) {
        setCardSlideWidth(316);
        setExpertsCardSlideWidth(252); // 240px + 12px gap
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

  useEffect(() => {
    cardIndexRef.current = cardIndex;
  }, [cardIndex]);

  useEffect(() => {
    expertsCardIndexRef.current = expertsCardIndex;
  }, [expertsCardIndex]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const vw = window.innerWidth;
      const visionWidth = vw > 1400 ? 373 : vw > 1024 ? 280 : vw > 768 ? 200 : 150;
      const growthWidth = vw > 1400 ? 320 : vw > 1024 ? 240 : vw > 768 ? 170 : 130;
      const crewWidth = vw > 1400 ? 320 : vw > 1024 ? 240 : vw > 768 ? 170 : 130;

      gsap.set(visionRowRef.current, { opacity: 0, x: -100 });
      gsap.set(growthRowRef.current, { opacity: 0, x: 100 });
      gsap.set(crewRowRef.current, { opacity: 0, x: -100 });

      // Let CSS clamp() handle responsive sizing for pills
      gsap.set(visionPillRef.current, { opacity: 1 });
      gsap.set(growthPillRef.current, { opacity: 1 });
      gsap.set(crewPillRef.current, { opacity: 1 });

      gsap.set(expandingVideoRef.current, {
        opacity: 0,
        visibility: 'hidden',
        scale: 0.2,
        borderRadius: '100px',
      });

      gsap.set(shipTextRef.current, { opacity: 0 });
      gsap.set([mainTitleRef.current, subTitleRef.current], { opacity: 0, y: 50 });
      gsap.set(financeOverlayRef.current, { opacity: 0 });
      gsap.set([leftContentRef.current, rightContentRef.current], { opacity: 0, y: 50 });
      gsap.set(yachtOverlayRef.current, { opacity: 0, display: 'none' });
      gsap.set(yachtContentRef.current, { opacity: 0, y: 50 });
      gsap.set(blackOverlayRef.current, { opacity: 0, display: 'none' });
      gsap.set(visionContentRef.current, { opacity: 0 });

      let visionScrollLocked = false;
      const preventScroll = (e: Event) => {
        if (visionScrollLocked) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      };

      const preventScrollKeys = (e: KeyboardEvent) => {
        if (visionScrollLocked) {
          const keys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
          if (keys.includes(e.key)) {
            e.preventDefault();
          }
        }
      };

      gsap.set(growthVisionTextRef.current, { opacity: 0 });
      gsap.set(growthOverlayRef.current, { opacity: 0 });
      gsap.set(growthContentRef.current, { opacity: 0 });
      gsap.set(cardsContainerRef.current, { opacity: 0 });

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

      // Solution 02 초기 설정
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

      const loadTl = gsap.timeline();
      loadTl.to(visionRowRef.current, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, 0.2);
      loadTl.to(growthRowRef.current, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, 0.7);
      loadTl.to(crewRowRef.current, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, 1.2);

      let isWaitingForClick = false;
      let hasExpanded = false;
      let showingFinance = false;
      let showingYacht = false;
      let showingVision = false;
      let scrollLocked = false;
      let lockedScrollY = 0;
      let currentHighlight = 0;

      const lockScroll = () => {
        if (scrollLocked) {
          window.scrollTo(0, lockedScrollY);
        }
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=600',
          pin: true,
          scrub: 1.5,
          invalidateOnRefresh: false,
          onUpdate: (self) => {
            if (self.progress >= 0.99 && !scrollLocked && !hasExpanded) {
              isWaitingForClick = true;
              scrollLocked = true;
              lockedScrollY = window.scrollY;
              window.addEventListener('scroll', lockScroll);
            }
          },
          onLeaveBack: () => {
            isWaitingForClick = false;
            scrollLocked = false;
            window.removeEventListener('scroll', lockScroll);
          },
        },
      });

      tl.to([visionRowRef.current, growthRowRef.current], { opacity: 0, duration: 0.3, ease: 'power2.out', immediateRender: false }, 0);
      tl.to(crewTextRef.current, { opacity: 0, width: 0, overflow: 'hidden', marginLeft: 0, marginRight: 0, padding: 0, duration: 0.3, ease: 'power2.out', immediateRender: false }, 0);
      tl.to([visionPillRef.current, growthPillRef.current], { opacity: 0, duration: 0.3, ease: 'power2.out', immediateRender: false }, 0);

      // Calculate vertical movement to center (X is handled by flex centering after text collapses)
      const pillRect = crewPillRef.current?.getBoundingClientRect();
      const windowCenterY = window.innerHeight / 2;
      const pillCenterY = pillRect ? pillRect.top + pillRect.height / 2 : 0;
      const moveY = windowCenterY - pillCenterY;

      // Animate pill to center (flex handles X centering, we only need Y)
      tl.to(crewPillRef.current, { y: moveY, duration: 0.5, ease: 'power2.out' }, 0.3);
      gsap.set(expandingVideoRef.current, { display: 'none' });

      const handleClick = () => {
        if (!isWaitingForClick) return;

        if (showingYacht && !showingVision) {
          showingVision = true;
          visionScrollLocked = true;
          document.body.style.overflow = 'hidden';
          window.addEventListener('scroll', preventScroll, { passive: false });
          window.addEventListener('touchmove', preventScroll, { passive: false });
          window.addEventListener('keydown', preventScrollKeys);

          gsap.set(blackOverlayRef.current, { display: 'block' });
          gsap.to(blackOverlayRef.current, {
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
            onComplete: () => {
              gsap.to(visionContentRef.current, {
                opacity: 1,
                duration: 0.8,
                delay: 0.3,
                ease: 'power2.out',
                onComplete: () => {
                  let highlightComplete = false;
                  const handleWheel = (e: WheelEvent) => {
                    e.preventDefault();
                    if (highlightComplete) return;
                    const delta = e.deltaY > 0 ? 2 : -2;
                    currentHighlight = Math.max(0, Math.min(100, currentHighlight + delta));
                    setHighlightProgress(currentHighlight);
                    if (currentHighlight >= 100) {
                      highlightComplete = true;
                    }
                  };

                  const handleVisionClick = (e: MouseEvent) => {
                    if (!highlightComplete) return;
                    e.stopPropagation();
                    window.removeEventListener('wheel', handleWheel);
                    window.removeEventListener('click', handleVisionClick);
                    visionScrollLocked = false;
                    document.body.style.overflow = '';
                    window.removeEventListener('scroll', preventScroll);
                    window.removeEventListener('touchmove', preventScroll);
                    window.removeEventListener('keydown', preventScrollKeys);
                    if (growthSectionRef.current) {
                      growthSectionRef.current.classList.add('active');
                    }
                    // hero 섹션 및 내부 요소들 숨기기
                    if (heroRef.current) {
                      heroRef.current.style.visibility = 'hidden';
                    }
                    if (expandingVideoRef.current) {
                      expandingVideoRef.current.style.display = 'none';
                    }
                    if (shipTextRef.current) {
                      shipTextRef.current.style.display = 'none';
                    }
                    scrollLocked = false;
                    window.removeEventListener('scroll', lockScroll);
                    setTimeout(() => {
                      growthSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  };

                  window.addEventListener('wheel', handleWheel, { passive: false });
                  window.addEventListener('click', handleVisionClick);
                },
              });
            },
          });
          return;
        }

        if (showingFinance && !showingYacht) {
          showingYacht = true;
          // Show yacht first, then fade out finance to prevent ship video flash
          gsap.set(yachtOverlayRef.current, { display: 'block', opacity: 1 });
          gsap.to(financeOverlayRef.current, { opacity: 0, duration: 0.5, ease: 'power2.out' });
          gsap.to(yachtContentRef.current, { opacity: 1, y: 0, duration: 0.5, delay: 0.3, ease: 'power2.out' });
          return;
        }

        if (hasExpanded && !showingFinance) {
          showingFinance = true;
          gsap.to(shipTextRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' });
          gsap.to(financeOverlayRef.current, { opacity: 1, duration: 0.3, delay: 0.2, ease: 'power2.out' });
          gsap.to(leftContentRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: 0.4,
            ease: 'power2.out',
            onComplete: () => {
              gsap.to(rightContentRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
            },
          });
          return;
        }

        if (!hasExpanded) {
          hasExpanded = true;
          gsap.set(crewTextRef.current, { display: 'none' });
          setHeaderVariant('transparent');
          gsap.to(crewPillRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' });
          gsap.set(expandingVideoRef.current, { display: 'block', visibility: 'visible', opacity: 0, scale: 1, borderRadius: 0 });
          gsap.to(expandingVideoRef.current, {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            onComplete: () => {
              gsap.to(shipTextRef.current, { opacity: 1, duration: 0.3, delay: 0.2, ease: 'power2.out' });
              gsap.to(mainTitleRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.3,
                delay: 0.2,
                ease: 'power2.out',
                onComplete: () => {
                  gsap.to(subTitleRef.current, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
                },
              });
            },
          });
        }
      };

      const heroElement = heroRef.current;
      if (heroElement) {
        heroElement.style.cursor = 'pointer';
        heroElement.addEventListener('click', handleClick);
      }

      let growthPhase = 0;
      let growthClickEnabled = false;

      const observeGrowth = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              document.body.style.overflow = 'hidden';
              setTimeout(() => {
                growthClickEnabled = true;
              }, 800);
            }
          });
        },
        { threshold: 0.5 }
      );

      if (growthSectionRef.current) {
        observeGrowth.observe(growthSectionRef.current);
      }

      let isGrowthClickProcessing = false;

      const handleGrowthClick = (e: MouseEvent) => {
        if (!growthClickEnabled) return;
        if (isGrowthClickProcessing) return;
        const target = e.target as HTMLElement;
        if (target.closest('button')) return;

        isGrowthClickProcessing = true;
        setTimeout(() => {
          isGrowthClickProcessing = false;
        }, 300);

        if (growthPhase === 0) {
          growthPhase = 1;
          gsap.to(growthVisionTextRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out' });
        } else if (growthPhase === 1) {
          growthPhase = 2;
          gsap.to(growthVisionTextRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' });
          gsap.to(growthOverlayRef.current, { opacity: 1, duration: 0.5, delay: 0.2, ease: 'power2.out' });
          gsap.to(growthContentRef.current, { opacity: 1, duration: 0.5, delay: 0.4, ease: 'power2.out' });
          gsap.to(cardsContainerRef.current, { opacity: 1, duration: 0.5, delay: 0.6, ease: 'power2.out' });
        } else if (growthPhase === 2) {
          const currentCardIndex = cardIndexRef.current;
          const maxCardIndex = SERVICE_CARDS.length - 1;
          if (currentCardIndex < maxCardIndex) {
            setCardIndex(currentCardIndex + 1);
          } else {
            growthPhase = 3;
            document.body.style.overflow = '';
            gsap.set(directionSectionRef.current, { display: 'flex', opacity: 1 });
            setTimeout(() => {
              directionSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
        }
      };

      const growthElement = growthSectionRef.current;
      if (growthElement) {
        growthElement.style.cursor = 'pointer';
        growthElement.addEventListener('click', handleGrowthClick);
      }

      let directionPhase = 0;
      let directionScrollLocked = false;
      let directionClickEnabled = false;

      const lockDirectionScroll = () => {
        if (directionScrollLocked && directionSectionRef.current) {
          const directionTop = directionSectionRef.current.offsetTop;
          if (window.scrollY < directionTop) {
            window.scrollTo(0, directionTop);
          }
        }
      };

      const startDirectionAutoSequence = () => {
        gsap.to(directionTextRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out' });
        setTimeout(() => {
          gsap.to(solutionOverlayRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out' });
          gsap.to(solutionContentRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out' });
          setTimeout(() => {
            gsap.to(solutionLabelRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out' });
            setTimeout(() => {
              gsap.to(solutionTitleRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out' });
              setTimeout(() => {
                gsap.to(solutionDescRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out' });
                directionPhase = 4;
                directionClickEnabled = true;
              }, 600);
            }, 600);
          }, 600);
        }, 300);
      };

      const observeDirection = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              directionScrollLocked = true;
              window.addEventListener('scroll', lockDirectionScroll);
              setTimeout(() => {
                directionClickEnabled = true;
              }, 500);
            }
          });
        },
        { threshold: 0.5 }
      );

      if (directionSectionRef.current) {
        observeDirection.observe(directionSectionRef.current);
      }

      const handleDirectionClick = () => {
        if (!directionClickEnabled) return;

        if (directionPhase === 0) {
          directionPhase = 1;
          directionClickEnabled = false;
          gsap.to(directionTextRef.current, {
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => {
              directionClickEnabled = true;
            },
          });
        } else if (directionPhase === 1) {
          directionPhase = 2;
          directionClickEnabled = false;
          startDirectionAutoSequence();
        } else if (directionPhase === 4) {
          directionPhase = 5;
          gsap.to(solutionGrid1Ref.current, {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => {
              const directionEl = directionSectionRef.current;
              if (!directionEl) return;

              let wheelAccumulator = 0;
              let row2Shown = false;
              let row3Shown = false;
              let row4Shown = false;

              const handleWheel = (e: WheelEvent) => {
                if (e.deltaY > 0) {
                  wheelAccumulator += e.deltaY;
                  if (!row2Shown && wheelAccumulator > 300) {
                    row2Shown = true;
                    gsap.to(solutionGrid2Ref.current, { opacity: 1, duration: 1, ease: 'power2.out' });
                  }
                  if (!row3Shown && wheelAccumulator > 700) {
                    row3Shown = true;
                    gsap.to(solutionGrid3Ref.current, { opacity: 1, duration: 1, ease: 'power2.out' });
                  }
                  if (!row4Shown && wheelAccumulator > 1100) {
                    row4Shown = true;
                    gsap.to(solutionGrid4Ref.current, {
                      opacity: 1,
                      duration: 1,
                      ease: 'power2.out',
                      onComplete: () => {
                        directionEl.removeEventListener('wheel', handleWheel);
                        // Solution 02 섹션으로 이동
                        directionScrollLocked = false;
                        window.removeEventListener('scroll', lockDirectionScroll);
                        if (solution02SectionRef.current) {
                          solution02SectionRef.current.style.display = 'flex';
                          setTimeout(() => {
                            solution02SectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                          }, 100);
                        }
                      },
                    });
                  }
                }
              };

              directionEl.addEventListener('wheel', handleWheel);
            },
          });
        }
      };

      const directionElement = directionSectionRef.current;
      if (directionElement) {
        directionElement.style.cursor = 'pointer';
        directionElement.addEventListener('click', handleDirectionClick);
      }

      // Solution 02 애니메이션 로직 - 시간차 자동 등장
      let solution02AnimationStarted = false;

      const startSolution02Animation = () => {
        if (solution02AnimationStarted) return;
        solution02AnimationStarted = true;

        const tl = gsap.timeline();

        // 라벨 표시
        tl.to(solution02LabelRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        });

        // 제목 표시
        tl.to(solution02TitleRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        }, '+=0.15');

        // 설명 표시
        tl.to(solution02DescRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        }, '+=0.15');

        // 타임라인 컨테이너 표시
        tl.to(timelineContainerRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        }, '+=0.15');

        // 각 스텝 순차 등장
        TIMELINE_STEPS.forEach((step, stepIndex) => {
          // 해당 스텝까지의 컬럼 헤더 표시
          const colsNeeded = step.cols;
          for (let i = 0; i < colsNeeded; i++) {
            const col = timelineColumnRefs.current[i];
            if (col) {
              tl.to(col, { opacity: 1, duration: 0.15, ease: 'power2.out' }, `step${stepIndex}`);
            }
          }

          // 해당 스텝 표시
          const stepEl = timelineStepRefs.current[stepIndex];
          if (stepEl) {
            tl.to(stepEl, { opacity: 1, duration: 0.3, ease: 'power2.out' }, `step${stepIndex}+=0.05`);
          }

          // 다음 스텝 전 딜레이
          tl.addLabel(`step${stepIndex + 1}`, '+=0.3');
        });

        // STEP 6까지 표시 후 멈춤, 클릭하면 SYSTEM으로 이동
        tl.call(() => {
          solution02ClickEnabled = true;
        }, [], '+=0.3');
      };

      let solution02ClickEnabled = false;

      const handleSolution02Click = () => {
        if (!solution02ClickEnabled) return;
        solution02ClickEnabled = false;

        if (systemSectionRef.current) {
          systemSectionRef.current.style.display = 'flex';
          setTimeout(() => {
            systemSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        }
      };

      const solution02Element = solution02SectionRef.current;
      if (solution02Element) {
        solution02Element.style.cursor = 'pointer';
        solution02Element.addEventListener('click', handleSolution02Click);
      }

      const observeSolution02 = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
              startSolution02Animation();
            }
          });
        },
        { threshold: 0.3 }
      );

      if (solution02SectionRef.current) {
        observeSolution02.observe(solution02SectionRef.current);
      }

      // SYSTEM section 애니메이션 로직
      let systemPhase = 0;
      let systemClickEnabled = false;
      let systemScrollLocked = false;
      let systemHighlightComplete = false;
      let currentSystemHighlight = 0;

      // SYSTEM 초기 설정
      // 모바일 여부에 따라 초기 설정
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        // 모바일: 큰 SYSTEM 텍스트가 뷰포트 중앙보다 약간 위에서 시작
        gsap.set(systemTextRef.current, {
          fontSize: '50px',
          position: 'fixed',
          top: '40vh',
          left: '50%',
          x: '-50%',
          y: '-50%'
        });
      } else {
        // 데스크톱: 중앙에서 시작
        gsap.set(systemTextRef.current, {
          fontSize: '265px',
          top: '50%',
          left: '50%',
          x: '-50%',
          y: '-50%'
        });
      }
      gsap.set(systemHeadlineRef.current, { opacity: 0 });
      gsap.set(systemDescRef.current, { opacity: 0 });
      gsap.set(systemVideoRef.current, {
        opacity: 0,
        width: '1058px',
        height: '579px',
        left: '50%',
        top: '50%',
        x: '-50%',
        y: '-50%'
      });
      gsap.set(systemCardsRef.current, { opacity: 0 });

      // SYSTEM 섹션 진입 시 텍스트 아래에서 중앙으로 애니메이션
      const observeSystemEntry = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
              gsap.to(systemTextRef.current, {
                top: '50%',
                duration: 1,
                ease: 'power2.out',
              });
              observeSystemEntry.disconnect();
            }
          });
        },
        { threshold: 0.3 }
      );

      if (systemSectionRef.current) {
        observeSystemEntry.observe(systemSectionRef.current);
      }

      const lockSystemScroll = () => {
        if (systemScrollLocked && systemSectionRef.current) {
          const sectionTop = systemSectionRef.current.offsetTop;
          if (window.scrollY < sectionTop) {
            window.scrollTo(0, sectionTop);
          }
        }
      };

      const observeSystem = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              systemScrollLocked = true;
              window.addEventListener('scroll', lockSystemScroll);
              // 모바일에서 스크롤 완전 잠금
              if (isMobile) {
                document.body.style.overflow = 'hidden';
              }
              setTimeout(() => {
                systemClickEnabled = true;
              }, 500);
            }
          });
        },
        { threshold: 0.5 }
      );

      if (systemSectionRef.current) {
        observeSystem.observe(systemSectionRef.current);
      }

      const handleSystemClick = () => {
        if (!systemClickEnabled) return;

        if (systemPhase === 0) {
          // Phase 1: SYSTEM 텍스트 작아지기
          systemPhase = 1;
          systemClickEnabled = false;

          if (isMobile) {
            // 모바일: 큰 SYSTEM → 작은 SYSTEM (중앙 유지)
            gsap.to(systemTextRef.current, {
              fontSize: '14px',
              letterSpacing: '0px',
              duration: 0.5,
              ease: 'power2.out',
              onComplete: () => {
                systemClickEnabled = true;
              },
            });
          } else {
            gsap.to(systemTextRef.current, {
              fontSize: '26px',
              top: '160px',
              y: '0%',
              letterSpacing: '-0.52px',
              duration: 0.8,
              ease: 'power2.out',
              onComplete: () => {
                systemClickEnabled = true;
              },
            });
          }
        } else if (systemPhase === 1) {
          // Phase 2: 헤드라인 등장
          systemPhase = 2;
          systemClickEnabled = false;

          if (isMobile) {
            // 모바일: SYSTEM 상단으로 이동 + 헤드라인 + 설명 동시 표시
            const tl = gsap.timeline({
              onComplete: () => {
                // 스크롤은 계속 잠금 상태 유지, 터치/휠로 하이라이트 애니메이션 시작
                systemPhase = 3;

                let touchStartY = 0;
                const systemEl = systemSectionRef.current;

                // 휠 이벤트 (Vision 섹션과 동일)
                const handleMobileWheel = (e: WheelEvent) => {
                  e.preventDefault();
                  if (systemHighlightComplete) return;
                  const delta = e.deltaY > 0 ? 3 : -3;
                  currentSystemHighlight = Math.max(0, Math.min(100, currentSystemHighlight + delta));
                  setSystemHighlightProgress(currentSystemHighlight);
                  if (currentSystemHighlight >= 100) {
                    systemHighlightComplete = true;
                    window.removeEventListener('wheel', handleMobileWheel);

                    // 모바일: 하이라이트 완료 후 비디오 섹션 표시
                    startMobileVideoSection();
                  }
                };

                // 터치 이벤트
                const handleTouchStart = (e: TouchEvent) => {
                  touchStartY = e.touches[0].clientY;
                };

                const handleTouchMove = (e: TouchEvent) => {
                  e.preventDefault();
                  if (systemHighlightComplete) return;

                  const touchY = e.touches[0].clientY;
                  const delta = Math.abs(touchStartY - touchY) * 0.5;
                  touchStartY = touchY;

                  currentSystemHighlight = Math.max(0, Math.min(100, currentSystemHighlight + delta));
                  setSystemHighlightProgress(currentSystemHighlight);

                  if (currentSystemHighlight >= 100) {
                    systemHighlightComplete = true;
                    if (systemEl) {
                      systemEl.removeEventListener('touchstart', handleTouchStart);
                      systemEl.removeEventListener('touchmove', handleTouchMove);
                    }
                    window.removeEventListener('wheel', handleMobileWheel);

                    // 모바일: 하이라이트 완료 후 비디오 섹션 표시
                    startMobileVideoSection();
                  }
                };

                // 모바일 비디오 섹션 시작 함수
                const startMobileVideoSection = () => {
                  // SYSTEM 텍스트, 헤드라인, 설명 페이드 아웃
                  gsap.to([systemTextRef.current, systemHeadlineRef.current, systemDescRef.current], {
                    opacity: 0,
                    duration: 0.5,
                    ease: 'power2.out',
                    onComplete: () => {
                      // 비디오 컨테이너 표시 (풀스크린)
                      gsap.set(systemVideoRef.current, {
                        position: 'relative',
                        top: 'auto',
                        left: 'auto',
                        x: 0,
                        y: 0,
                        width: '100%',
                        height: '191px',
                        borderRadius: '0',
                        opacity: 1
                      });

                      // 섹션 스타일 변경 (스크롤 가능하도록)
                      if (systemSectionRef.current) {
                        systemSectionRef.current.classList.add('mobile-video-mode');
                      }

                      // 카드 표시
                      gsap.to(systemCardsRef.current, {
                        opacity: 1,
                        duration: 0.5,
                        ease: 'power2.out',
                        onComplete: () => {
                          // 스크롤 잠금 해제 (카드 스크롤 가능하도록)
                          document.body.style.overflow = '';
                          systemScrollLocked = false;
                          window.removeEventListener('scroll', lockSystemScroll);

                          // 모바일 비디오 모드에서 클릭 시 TEAMWORK으로 이동
                          systemPhase = 10; // 모바일 비디오 모드
                          systemClickEnabled = true;
                          // TEAMWORK 섹션은 클릭 후에 표시 (스크롤 시 자동 전환 방지)
                        }
                      });
                    }
                  });
                };

                window.addEventListener('wheel', handleMobileWheel, { passive: false });
                if (systemEl) {
                  systemEl.addEventListener('touchstart', handleTouchStart, { passive: false });
                  systemEl.addEventListener('touchmove', handleTouchMove, { passive: false });
                }
              },
            });
            tl.to(systemTextRef.current, {
              position: 'absolute',
              top: '200px',
              duration: 0.5,
              ease: 'power2.out',
            });
            tl.to(systemHeadlineRef.current, {
              opacity: 1,
              duration: 0.5,
              ease: 'power2.out',
            }, '-=0.3');
            tl.to(systemDescRef.current, {
              opacity: 1,
              duration: 0.5,
              ease: 'power2.out',
            }, '-=0.3');
          } else {
            gsap.to(systemHeadlineRef.current, {
              opacity: 1,
              duration: 0.5,
              ease: 'power2.out',
              onComplete: () => {
                systemClickEnabled = true;
              },
            });
          }
        } else if (systemPhase === 2) {
          // Phase 3: 설명 등장
          systemPhase = 3;
          systemClickEnabled = false;
          gsap.to(systemDescRef.current, {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => {
              // 하이라이트 애니메이션 시작
              const handleWheel = (e: WheelEvent) => {
                e.preventDefault();
                if (systemHighlightComplete) return;
                const delta = e.deltaY > 0 ? 3 : -3;
                currentSystemHighlight = Math.max(0, Math.min(100, currentSystemHighlight + delta));
                setSystemHighlightProgress(currentSystemHighlight);
                if (currentSystemHighlight >= 100) {
                  systemHighlightComplete = true;
                  systemClickEnabled = true;
                  window.removeEventListener('wheel', handleWheel);
                }
              };
              window.addEventListener('wheel', handleWheel, { passive: false });
            },
          });
        } else if (systemPhase === 3 && systemHighlightComplete) {
          // Phase 4: 비디오 카드 등장, SYSTEM/헤드라인/설명 숨기기
          systemPhase = 4;
          systemClickEnabled = false;

          // SYSTEM, 헤드라인, 설명 페이드 아웃
          gsap.to([systemTextRef.current, systemHeadlineRef.current, systemDescRef.current], {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
          });

          // 비디오 등장 (부드럽게)
          gsap.to(systemVideoRef.current, {
            opacity: 1,
            duration: 1.2,
            delay: 0.5,
            ease: 'power2.inOut',
            onComplete: () => {
              systemClickEnabled = true;
            },
          });
        } else if (systemPhase === 4) {
          // Phase 5: 비디오 풀스크린 확장 (중앙 유지)
          systemPhase = 5;
          systemClickEnabled = false;
          gsap.to(systemVideoRef.current, {
            width: '100vw',
            height: '100vh',
            borderRadius: '0px',
            duration: 0.8,
            ease: 'power2.out',
            onComplete: () => {
              systemClickEnabled = true;
            },
          });
        } else if (systemPhase === 5) {
          // Phase 6: 비디오 왼쪽 절반으로 이동 (중간 50%만 보이도록 크롭), 카드 등장
          systemPhase = 6;

          // 비디오 컨테이너를 왼쪽으로 이동 (여백 포함, 둥근 모서리)
          // Calculate target dimensions dynamically to match CSS constraints
          const vh = window.innerHeight;
          const vw = window.innerWidth;
          const availableHeight = vh - 160; // Increased margin: 80px top + 80px bottom
          const targetRatio = 1.16;

          let targetWidth = availableHeight * targetRatio;
          let targetHeight = availableHeight;

          // Apply max-width constraint (55vw)
          const maxWidth = vw * 0.55;
          if (targetWidth > maxWidth) {
            targetWidth = maxWidth;
            targetHeight = targetWidth / targetRatio;
          }

          // Reset position to top-left to prevent "moving right" artifact during shrink
          // Since width/height are 100vw/100vh, visually this is identical to centered
          gsap.set(systemVideoRef.current, {
            left: 0,
            top: 0,
            xPercent: 0,
            yPercent: 0
          });

          // 비디오 컨테이너를 왼쪽으로 이동 (여백 포함, 둥근 모서리)
          gsap.to(systemVideoRef.current, {
            top: '80px', // Increased top margin
            left: '64px',
            xPercent: 0,
            yPercent: 0,
            width: targetWidth,
            height: targetHeight,
            borderRadius: '24px',
            duration: 0.8,
            ease: 'power2.out',
            onComplete: () => {
              // Add class to enforce responsive layout after animation
              if (systemVideoRef.current) {
                systemVideoRef.current.classList.add('is-layout-fixed');
              }
            }
          });

          // 비디오 컨테이너에 클래스 추가 (텍스트 스타일용)
          if (systemVideoRef.current) {
            systemVideoRef.current.classList.add('is-shrunk');
          }

          // 텍스트 크기 애니메이션 (GSAP로 부드럽게 연결)
          const videoText = systemVideoRef.current?.querySelector('.system-video-text');
          if (videoText) {
            gsap.to(videoText, {
              fontSize: '40px',
              duration: 0.8,
              ease: 'power2.out'
            });
          }

          gsap.to(systemCardsRef.current, {
            opacity: 1,
            duration: 0.8,
            delay: 0.3,
            ease: 'power2.out',
            onComplete: () => {
              // 스크롤 잠금 해제
              systemScrollLocked = false;
              window.removeEventListener('scroll', lockSystemScroll);
              document.body.style.overflow = '';
              systemClickEnabled = true;

              // TEAMWORK 섹션 표시
              if (teamworkSectionRef.current) {
                teamworkSectionRef.current.style.display = 'flex';
              }
            },
          });
        } else if (systemPhase === 6) {
          // Phase 7: TEAMWORK 섹션으로 이동
          systemPhase = 7;
          systemClickEnabled = false;

          if (teamworkSectionRef.current) {
            setTimeout(() => {
              teamworkSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
        } else if (systemPhase === 10) {
          // 모바일: 비디오/카드 모드에서 클릭 시 TEAMWORK으로 이동
          // 섹션 끝까지 스크롤했는지 확인
          if (systemSectionRef.current) {
            const section = systemSectionRef.current;
            const sectionBottom = section.offsetTop + section.offsetHeight;
            const scrollBottom = window.scrollY + window.innerHeight;

            // 섹션 하단에서 100px 이내일 때만 클릭 허용
            if (scrollBottom < sectionBottom - 100) {
              return; // 아직 끝까지 스크롤하지 않음
            }
          }

          systemPhase = 11;
          systemClickEnabled = false;

          // TEAMWORK 섹션 표시 후 스크롤
          if (teamworkSectionRef.current) {
            teamworkSectionRef.current.style.display = 'flex';
            setTimeout(() => {
              teamworkSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
        }
      };

      const systemElement = systemSectionRef.current;
      if (systemElement) {
        systemElement.style.cursor = 'pointer';
        systemElement.addEventListener('click', handleSystemClick);
      }

      // TEAMWORK section 애니메이션 로직
      let teamworkPhase = 1; // 헤드라인이 이미 보이는 상태로 시작
      let teamworkClickEnabled = false;
      let teamworkScrollLocked = false;

      // TEAMWORK 초기 설정 - 헤드라인은 바로 보임
      gsap.set(teamworkHeadlineRef.current, { opacity: 1 });
      gsap.set(teamworkBgRef.current, { opacity: 0 });
      gsap.set(teamworkTextRef.current, { opacity: 0 });

      const lockTeamworkScroll = () => {
        if (teamworkScrollLocked && teamworkSectionRef.current) {
          const sectionTop = teamworkSectionRef.current.offsetTop;
          if (window.scrollY < sectionTop) {
            window.scrollTo(0, sectionTop);
          }
        }
      };

      const observeTeamwork = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              teamworkScrollLocked = true;
              window.addEventListener('scroll', lockTeamworkScroll);
              setTimeout(() => {
                teamworkClickEnabled = true;
              }, 500);
            }
          });
        },
        { threshold: 0.5 }
      );

      if (teamworkSectionRef.current) {
        observeTeamwork.observe(teamworkSectionRef.current);
      }

      const handleTeamworkClick = () => {
        if (!teamworkClickEnabled) return;

        if (teamworkPhase === 1) {
          // Phase 2: 배경 이미지 등장, 헤드라인 페이드 아웃 (크로스페이드)
          teamworkPhase = 2;
          teamworkClickEnabled = false;

          // 동시에 실행되는 크로스페이드 애니메이션
          gsap.to(teamworkHeadlineRef.current, {
            opacity: 0,
            duration: 1.2,
            ease: 'power2.inOut',
          });
          gsap.to(teamworkBgRef.current, {
            opacity: 1,
            duration: 1.5,
            ease: 'power2.inOut',
            onComplete: () => {
              teamworkClickEnabled = true;
            },
          });
        } else if (teamworkPhase === 2) {
          // Phase 3: TEAMWORK 텍스트 등장
          teamworkPhase = 3;
          gsap.to(teamworkTextRef.current, {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            onComplete: () => {
              teamworkClickEnabled = true;
              // EXPERTS 섹션 표시
              if (expertsSectionRef.current) {
                expertsSectionRef.current.style.display = 'flex';
              }
            },
          });
        } else if (teamworkPhase === 3) {
          // Phase 4: EXPERTS 섹션으로 이동
          teamworkPhase = 4;
          teamworkClickEnabled = false;
          teamworkScrollLocked = false;
          window.removeEventListener('scroll', lockTeamworkScroll);
          document.body.style.overflow = '';

          if (expertsSectionRef.current) {
            setTimeout(() => {
              expertsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
        }
      };

      const teamworkElement = teamworkSectionRef.current;
      if (teamworkElement) {
        teamworkElement.style.cursor = 'pointer';
        teamworkElement.addEventListener('click', handleTeamworkClick);
      }

      // EXPERTS section 애니메이션 로직
      let expertsPhase = 0;
      let expertsClickEnabled = false;
      let expertsScrollLocked = false;

      // EXPERTS 초기 설정
      gsap.set(expertsHeadlineRef.current, { opacity: 0 });
      gsap.set(expertsNavRef.current, { opacity: 0 });
      gsap.set(expertsDescRef.current, { opacity: 0 });
      gsap.set(expertsCardsRef.current, { opacity: 0 });

      const lockExpertsScroll = () => {
        if (expertsScrollLocked && expertsSectionRef.current) {
          const sectionTop = expertsSectionRef.current.offsetTop;
          if (window.scrollY < sectionTop) {
            window.scrollTo(0, sectionTop);
          }
        }
      };

      const observeExperts = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              expertsScrollLocked = true;
              window.addEventListener('scroll', lockExpertsScroll);
              setTimeout(() => {
                expertsClickEnabled = true;
              }, 500);
            }
          });
        },
        { threshold: 0.5 }
      );

      if (expertsSectionRef.current) {
        observeExperts.observe(expertsSectionRef.current);
      }

      const handleExpertsClick = (e: MouseEvent) => {
        if (!expertsClickEnabled) return;
        const target = e.target as HTMLElement;
        if (target.closest('button')) return;

        if (expertsPhase === 0) {
          // Phase 1: 헤드라인, VIP 텍스트, 네비게이션 등장
          expertsPhase = 1;
          expertsClickEnabled = false;
          gsap.to(expertsHeadlineRef.current, {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
          });
          gsap.to(expertsDescRef.current, {
            opacity: 1,
            duration: 0.8,
            delay: 0.2,
            ease: 'power2.out',
          });
          gsap.to(expertsNavRef.current, {
            opacity: 1,
            duration: 0.8,
            delay: 0.4,
            ease: 'power2.out',
            onComplete: () => {
              expertsClickEnabled = true;
            },
          });
        } else if (expertsPhase === 1) {
          // Phase 2: 카드 등장
          expertsPhase = 2;
          expertsClickEnabled = false;
          gsap.to(expertsCardsRef.current, {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            onComplete: () => {
              expertsClickEnabled = true;
              // CHAMPAGNE 섹션 표시
              if (champagneSectionRef.current) {
                champagneSectionRef.current.style.display = 'flex';
              }
            },
          });
        } else if (expertsPhase === 2) {
          // Phase 3: CHAMPAGNE 섹션으로 이동
          expertsPhase = 3;
          expertsClickEnabled = false;
          expertsScrollLocked = false;
          window.removeEventListener('scroll', lockExpertsScroll);
          document.body.style.overflow = '';

          if (champagneSectionRef.current) {
            setTimeout(() => {
              champagneSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
        }
      };

      const expertsElement = expertsSectionRef.current;
      if (expertsElement) {
        expertsElement.style.cursor = 'pointer';
        expertsElement.addEventListener('click', handleExpertsClick);
      }

      // CHAMPAGNE section 애니메이션 로직
      let champagneClickEnabled = false;
      let champagneScrollLocked = false;
      let champagneCompleted = false;

      const lockChampagneScroll = () => {
        if (champagneScrollLocked && champagneSectionRef.current) {
          const sectionTop = champagneSectionRef.current.offsetTop;
          if (window.scrollY < sectionTop) {
            window.scrollTo(0, sectionTop);
          }
        }
      };

      const observeChampagne = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // 이미 CHAMPAGNE → CRUISE 전환이 완료된 경우 스크롤 잠금하지 않음
            if (entry.isIntersecting && entry.intersectionRatio > 0.5 && !champagneCompleted) {
              document.body.style.overflow = 'hidden';
              champagneScrollLocked = true;
              window.addEventListener('scroll', lockChampagneScroll);
              setTimeout(() => {
                champagneClickEnabled = true;
              }, 500);
            }
          });
        },
        { threshold: 0.5 }
      );

      if (champagneSectionRef.current) {
        observeChampagne.observe(champagneSectionRef.current);
      }

      const handleChampagneClick = () => {
        if (!champagneClickEnabled) return;

        champagneClickEnabled = false;
        champagneCompleted = true;

        // Hero 섹션 및 내부 요소들 숨김 (전환 전에 먼저 숨김)
        if (heroRef.current) {
          heroRef.current.style.visibility = 'hidden';
        }
        if (expandingVideoRef.current) {
          expandingVideoRef.current.style.display = 'none';
        }
        if (shipTextRef.current) {
          shipTextRef.current.style.display = 'none';
        }

        // CRUISE 섹션 표시
        if (cruiseSectionRef.current) {
          cruiseSectionRef.current.style.display = 'flex';
          gsap.set(cruiseSectionRef.current, { opacity: 0 });
        }

        // 크로스페이드 전환: CHAMPAGNE 페이드아웃 + CRUISE 페이드인
        gsap.to(champagneSectionRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
        });

        gsap.to(cruiseSectionRef.current, {
          opacity: 1,
          duration: 1.5,
          delay: 0.3,
          ease: 'power2.out',
          onComplete: () => {
            champagneScrollLocked = false;
            window.removeEventListener('scroll', lockChampagneScroll);
            document.body.style.overflow = '';

            // CHAMPAGNE 섹션 완전히 숨김 (스크롤 간섭 방지)
            if (champagneSectionRef.current) {
              champagneSectionRef.current.style.visibility = 'hidden';
              champagneSectionRef.current.style.pointerEvents = 'none';
            }

            // 스크롤 없이 바로 CRUISE 위치로 이동 (페이드인이 메인 전환 효과)
            if (cruiseSectionRef.current) {
              window.scrollTo(0, cruiseSectionRef.current.offsetTop);
            }
          },
        });
      };

      const champagneElement = champagneSectionRef.current;
      if (champagneElement) {
        champagneElement.style.cursor = 'pointer';
        champagneElement.addEventListener('click', handleChampagneClick);
      }

      // CRUISE section 애니메이션 로직
      let cruisePhase = 0;
      let cruiseClickEnabled = false;
      let cruiseScrollLocked = false;

      // CRUISE 초기 설정
      gsap.set(cruiseLeftTextRef.current, { opacity: 0 });
      gsap.set(cruiseRightTextRef.current, { opacity: 0 });

      const lockCruiseScroll = () => {
        if (cruiseScrollLocked && cruiseSectionRef.current) {
          const sectionTop = cruiseSectionRef.current.offsetTop;
          if (window.scrollY < sectionTop) {
            window.scrollTo(0, sectionTop);
          }
        }
      };

      const observeCruise = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // 이미 Phase 2가 완료된 경우 스크롤 잠금하지 않음
            if (entry.isIntersecting && entry.intersectionRatio > 0.5 && cruisePhase < 2) {
              document.body.style.overflow = 'hidden';
              cruiseScrollLocked = true;
              window.addEventListener('scroll', lockCruiseScroll);
              setTimeout(() => {
                cruiseClickEnabled = true;
              }, 500);
            }
          });
        },
        { threshold: 0.5 }
      );

      if (cruiseSectionRef.current) {
        observeCruise.observe(cruiseSectionRef.current);
      }

      const handleCruiseClick = () => {
        if (!cruiseClickEnabled) return;

        if (cruisePhase === 0) {
          // Phase 1: 왼쪽 텍스트 표시
          cruisePhase = 1;
          cruiseClickEnabled = false;
          gsap.to(cruiseLeftTextRef.current, {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            onComplete: () => {
              cruiseClickEnabled = true;
            },
          });
        } else if (cruisePhase === 1) {
          // Phase 2: 오른쪽 텍스트 표시 + 스크롤 잠금 해제
          cruisePhase = 2;
          cruiseClickEnabled = false;
          gsap.to(cruiseRightTextRef.current, {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            onComplete: () => {
              // FINAL 섹션 표시 및 스크롤 잠금 해제
              if (finalSectionRef.current) {
                finalSectionRef.current.style.display = 'flex';
              }
              // hero 섹션 숨기기 (yacht-overlay, vision-content가 보이지 않도록)
              if (heroRef.current) {
                heroRef.current.style.visibility = 'hidden';
              }
              cruiseScrollLocked = false;
              window.removeEventListener('scroll', lockCruiseScroll);
              document.body.style.overflow = '';
            },
          });
        }
      };

      const cruiseElement = cruiseSectionRef.current;
      if (cruiseElement) {
        cruiseElement.style.cursor = 'pointer';
        cruiseElement.addEventListener('click', handleCruiseClick);
      }

      return () => {
        if (heroElement) {
          heroElement.removeEventListener('click', handleClick);
        }
        if (growthElement) {
          growthElement.removeEventListener('click', handleGrowthClick);
        }
        if (directionElement) {
          directionElement.removeEventListener('click', handleDirectionClick);
        }
        if (solution02Element) {
          solution02Element.removeEventListener('click', handleSolution02Click);
        }
        if (systemElement) {
          systemElement.removeEventListener('click', handleSystemClick);
        }
        if (teamworkElement) {
          teamworkElement.removeEventListener('click', handleTeamworkClick);
        }
        if (expertsElement) {
          expertsElement.removeEventListener('click', handleExpertsClick);
        }
        if (champagneElement) {
          champagneElement.removeEventListener('click', handleChampagneClick);
        }
        if (cruiseElement) {
          cruiseElement.removeEventListener('click', handleCruiseClick);
        }
        window.removeEventListener('scroll', lockSystemScroll);
        window.removeEventListener('scroll', lockTeamworkScroll);
        window.removeEventListener('scroll', lockExpertsScroll);
        window.removeEventListener('scroll', lockChampagneScroll);
        window.removeEventListener('scroll', lockCruiseScroll);
      };

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="home-container" ref={containerRef}>
      <Header variant={headerVariant} onMenuClick={() => setIsMenuOpen(true)} />
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

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
          <video autoPlay muted loop playsInline>
            <source src={shipVideo1} type="video/mp4" />
          </video>
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

        <div className="black-overlay" ref={blackOverlayRef} />

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
                  <img className="expert-quote-icon" src="/images/quote-icon.svg" alt="quote" />
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

      {/* CHAMPAGNE Section */}
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

      {/* CRUISE Section */}
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
          <p>'1등 세무사'로 완성합니다</p>
        </div>
      </section>

      {/* FINAL Section */}
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
