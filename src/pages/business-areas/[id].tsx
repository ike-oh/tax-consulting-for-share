import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import Header from '@/components/common/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/common/Footer';
import FloatingButton from '@/components/common/FloatingButton';
import PageHeader from '@/components/common/PageHeader';
import ContentBox from '@/components/common/ContentBox';
import Icon from '@/components/common/Icon';
import { get } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import styles from './detail.module.scss';

// Toast UI Viewer는 클라이언트 사이드에서만 로드
const Viewer = dynamic(
  () => import('@toast-ui/react-editor').then((mod) => mod.Viewer),
  { ssr: false }
);

interface SectionContent {
  content: string;
  section: string;
}

interface BusinessAreaDetail {
  id: number;
  name: string;
  subDescription: string;
  image: {
    id: number;
    url: string;
  };
  majorCategory: {
    id: number;
    name: string;
    sections: string[];
    isExposed: boolean;
    displayOrder: number;
  };
  minorCategory: {
    id: number;
    name: string;
    isExposed: boolean;
  };
  overview: string;
  sectionContents: SectionContent[];
  youtubeUrls: string[];
  isMainExposed: boolean;
  isExposed: boolean;
  displayOrder: number;
}

interface Expert {
  id: number;
  name: string;
  position: string;
  tel?: string;
  email?: string;
  imageUrl?: string;
  tags?: string[]; // 전문 분야 태그
}

interface InsightItem {
  id: number;
  title: string;
  content: string;
  thumbnail?: {
    url: string;
  };
  createdAt?: string;
  category?: string | { id: number; name: string; type: string }; // 카테고리 (문자열 또는 객체)
  author?: string; // 작성자
}

interface InsightResponse {
  items: InsightItem[];
  total: number;
}

const BusinessAreaDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [data, setData] = useState<BusinessAreaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [relatedNews, setRelatedNews] = useState<InsightItem[]>([]);
  const [expertsPage, setExpertsPage] = useState(0);
  const [newsPage, setNewsPage] = useState(0);
  const [youtubePage, setYoutubePage] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const checkpointRef = useRef<HTMLDivElement>(null);
  const executionRef = useRef<HTMLDivElement>(null);
  const casesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      fetchBusinessAreaDetail();
      fetchRelatedData();
      setImageError(false); // 새 데이터 로드 시 이미지 에러 상태 초기화
    }
  }, [id]);

  // 섹션 활성화 감지 (목차 하이라이트용)
  useEffect(() => {
    if (!data) return;

    const sections = [
      { id: 'checkpoint', ref: checkpointRef },
      { id: 'execution', ref: executionRef },
      { id: 'cases', ref: casesRef },
    ].filter(section => {
      if (section.id === 'checkpoint') return data.majorCategory.sections.includes('체크포인트');
      if (section.id === 'execution') return data.majorCategory.sections.includes('함께 실행방안');
      if (section.id === 'cases') return data.majorCategory.sections.includes('케이스');
      return false;
    });

    const observers: IntersectionObserver[] = [];

    sections.forEach(({ id, ref }) => {
      if (!ref.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
              setActiveSection(id);
            }
          });
        },
        { 
          threshold: [0, 0.3, 0.5, 1],
          rootMargin: '-20% 0px -60% 0px'
        }
      );

      observer.observe(ref.current);
      observers.push(observer);
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [data]);

  const fetchBusinessAreaDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await get<BusinessAreaDetail>(
        `${API_ENDPOINTS.BUSINESS_AREAS}/${id}`
      );

      if (response.data) {
        setData(response.data);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedData = async () => {
    try {
      // 관련 업무 세무사 가져오기 (임시로 members API 사용)
      try {
        const membersResponse = await get<{ items: Expert[] }>(
          `${API_ENDPOINTS.MEMBERS}?limit=4`
        );
        if (membersResponse.data?.items) {
          setExperts(membersResponse.data.items);
        }
      } catch (err) {
        // 실패 시 빈 배열
        setExperts([]);
      }

      // 관련 소식 가져오기
      try {
        const newsResponse = await get<InsightResponse>(
          `${API_ENDPOINTS.INSIGHTS}?page=1&limit=4`
        );
        if (newsResponse.data?.items) {
          setRelatedNews(newsResponse.data.items);
        }
      } catch (err) {
        // 실패 시 빈 배열
        setRelatedNews([]);
      }
    } catch (err) {
      console.error('관련 데이터를 불러오는 중 오류:', err);
    }
  };

  const getSectionContent = (sectionName: string): string => {
    if (!data?.sectionContents) return '';
    const section = data.sectionContents.find(
      (sc) => sc.section === sectionName
    );
    return section?.content || '';
  };

  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleTopClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConsultClick = () => {
    router.push('/consultation/apply');
  };

  const handleExpertPrev = () => {
    if (expertsPage > 0) {
      setExpertsPage(expertsPage - 1);
    }
  };

  const handleExpertNext = () => {
    if (expertsPage < Math.ceil(experts.length / 4) - 1) {
      setExpertsPage(expertsPage + 1);
    }
  };

  const handleNewsPrev = () => {
    if (newsPage > 0) {
      setNewsPage(newsPage - 1);
    }
  };

  const handleNewsNext = () => {
    if (newsPage < Math.ceil(relatedNews.length / 4) - 1) {
      setNewsPage(newsPage + 1);
    }
  };

  const handleYoutubePrev = () => {
    if (youtubePage > 0 && data?.youtubeUrls) {
      setYoutubePage(youtubePage - 1);
    }
  };

  const handleYoutubeNext = () => {
    if (data?.youtubeUrls && youtubePage < Math.ceil(data.youtubeUrls.length / 4) - 1) {
      setYoutubePage(youtubePage + 1);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} />
        <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <div className={styles.container}>
          <div className={styles.loading}>로딩 중...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.page}>
        <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} />
        <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <div className={styles.container}>
          <div className={styles.error}>
            <p>{error || '업무 분야를 찾을 수 없습니다.'}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Breadcrumb 생성
  const breadcrumbs = [
    { label: '업무 분야', href: '/business-areas/hierarchical' },
    { label: data.majorCategory.name, href: '/business-areas/hierarchical' },
    { label: data.minorCategory.name, href: '/business-areas/hierarchical' },
    { label: data.name }, // 현재 페이지는 링크 없음
  ];

  return (
    <div className={styles.page}>
      <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} />
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className={styles.container}>
        {/* Page Header with Breadcrumb */}
        <div className={styles.pageHeaderWrapper}>
          <PageHeader
            title={data.name}
            breadcrumbs={breadcrumbs}
            size="web"
          />
        </div>
      </div>

      {/* Hero Section - Full Width */}
      <div className={styles.heroSection}>
        {data.image?.url && !imageError ? (
          <img 
            src={data.image.url} 
            alt={data.name}
            className={styles.heroImage}
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <span>{data.name}</span>
          </div>
        )}
        <div className={styles.heroOverlay} />
        <p className={styles.heroLabel}>(업무 분야)</p>
        <h1 className={styles.heroTitle}>PRACTICE AREAS</h1>
        <div className={styles.heroContent}>
          <div className={styles.heroTitleRow}>
            <h2 className={styles.heroSubtitle}>{data.name}</h2>
          </div>
          {data.subDescription && (
            <p className={styles.heroDescription}>{data.subDescription}</p>
          )}
        </div>
      </div>

      {/* Overview Section - Below Hero Image */}
      {data.overview && (
        <div className={styles.overviewSectionWrapper}>
          <div className={styles.overviewContainer}>
            <section className={styles.overviewSection}>
              <div className={styles.overviewHeader}>
                <h2 className={styles.overviewTitle}>OVERVIEW</h2>
              </div>
              <div className={styles.overviewContent}>
                <div className={styles.overviewContentLayout}>
                  <div className={styles.overviewContentInner}>
                    <Viewer initialValue={data.overview} />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      <div className={styles.container}>
        {/* Left Sidebar Navigation */}
        <div className={styles.sidebarNav}>
          {data.majorCategory.sections.includes('체크포인트') && (
            <a 
              href="#checkpoint" 
              className={`${styles.navItem} ${activeSection === 'checkpoint' ? styles.active : ''}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('checkpoint')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className={styles.navLine} />
              <span className={styles.navText}>체크포인트</span>
            </a>
          )}
          {data.majorCategory.sections.includes('함께 실행방안') && (
            <a 
              href="#execution" 
              className={`${styles.navItem} ${activeSection === 'execution' ? styles.active : ''}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('execution')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className={styles.navLine} />
              <span className={styles.navText}>함께 실행방안</span>
            </a>
          )}
          {data.majorCategory.sections.includes('케이스') && (
            <a 
              href="#cases" 
              className={`${styles.navItem} ${activeSection === 'cases' ? styles.active : ''}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className={styles.navLine} />
              <span className={styles.navText}>케이스</span>
            </a>
          )}
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Check Point Section */}
          {data.majorCategory.sections.includes('체크포인트') && (
            <section id="checkpoint" ref={checkpointRef} className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>CHECK POINT</h2>
              </div>
              <div className={styles.sectionContent}>
                <ContentBox>
                  <div className={styles.checkPointContent}>
                    {getSectionContent('체크포인트') && (
                      <div className={styles.contentText}>
                        <Viewer initialValue={getSectionContent('체크포인트')} />
                      </div>
                    )}
                  </div>
                </ContentBox>
              </div>
            </section>
          )}

          {/* Execution Strategy Section */}
          {data.majorCategory.sections.includes('함께 실행방안') && (
            <section id="execution" ref={executionRef} className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>EXECUTION STRATEGY</h2>
              </div>
              <div className={styles.sectionContent}>
                <h3 className={styles.subSectionTitle}>함께 실행방안</h3>
                <ContentBox>
                  <div className={styles.executionContent}>
                    {getSectionContent('함께 실행방안') && (
                      <div className={styles.contentText}>
                        <Viewer initialValue={getSectionContent('함께 실행방안')} />
                      </div>
                    )}
                  </div>
                </ContentBox>
              </div>
            </section>
          )}

          {/* Cases Section */}
          {data.majorCategory.sections.includes('케이스') && (
            <section id="cases" ref={casesRef} className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>CASES</h2>
              </div>
              <div className={styles.sectionContent}>
                <h3 className={styles.subSectionTitle}>케이스</h3>
                <ContentBox>
                  <div className={styles.casesContent}>
                    {getSectionContent('케이스') && (
                      <div className={styles.contentText}>
                        <Viewer initialValue={getSectionContent('케이스')} />
                      </div>
                    )}
                  </div>
                </ContentBox>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Contact Section - Full Width like Overview */}
      <div className={styles.contactSectionWrapper}>
        <div className={styles.contactContainer}>
          <section className={styles.contactSection}>
            <div className={styles.contactBanner}>
              <div className={styles.contactBannerOverlay} />
              <div className={styles.contactContent}>
                <div className={styles.contactText}>
                  <h2 className={styles.contactMainTitle}>CONTACT</h2>
                  <p className={styles.contactDescription}>
                    경험과 전문성을 바탕으로,<br />
                    맞춤형 세무 해답을 제시합니다
                  </p>
                </div>
                <button
                  className={styles.consultButton}
                  onClick={handleConsultClick}
                >
                  구성원 신청
                  <Icon type="arrow-right2-white" size={24} />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Related Experts Section - Full Width */}
      {experts.length > 0 && (
        <div className={styles.fullWidthSection}>
          <div className={styles.fullWidthContainer}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionHeaderContent}>
                <div>
                  <h2 className={styles.sectionTitle}>RELATED EXPERTS</h2>
                  <p className={styles.sectionSubtitle}>관련 업무 세무사</p>
                </div>
                <div className={styles.navigationButtons}>
                  <button
                    className={styles.navButton}
                    onClick={handleExpertPrev}
                    disabled={expertsPage === 0}
                  >
                    <Icon type="arrow-left2-white" size={20} />
                  </button>
                  <button
                    className={styles.navButton}
                    onClick={handleExpertNext}
                    disabled={expertsPage >= Math.ceil(experts.length / 4) - 1}
                  >
                    <Icon type="arrow-right2-white" size={20} />
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.expertsContent}>
              <div
                className={styles.expertsGrid}
                style={{
                  transform: `translateX(-${expertsPage * 100}%)`,
                }}
              >
                {Array.from({ length: Math.ceil(experts.length / 4) }).map((_, pageIndex) => (
                  <div key={pageIndex} className={styles.expertsPage}>
                    {experts.slice(pageIndex * 4, (pageIndex + 1) * 4).map((expert, index) => (
                      <div key={expert.id || index} className={styles.expertCard}>
                        <div className={styles.expertImage}>
                          <img
                            src={expert.imageUrl || '/images/common/default-avatar.png'}
                            alt={expert.name}
                          />
                        </div>
                        <div className={styles.expertInfo}>
                          <div className={styles.expertNameRow}>
                            <p className={styles.expertName}>{expert.name}</p>
                            <p className={styles.expertPositionLabel}>{expert.position}</p>
                          </div>
                          <div className={styles.expertContact}>
                            {expert.tel && (
                              <div className={styles.expertContactItem}>
                                <span className={styles.expertContactLabel}>TEL</span>
                                <span className={styles.expertContactValue}>{expert.tel}</span>
                              </div>
                            )}
                            {expert.email && (
                              <div className={styles.expertContactItem}>
                                <span className={styles.expertContactLabel}>EMAIL</span>
                                <span className={styles.expertContactValue}>{expert.email}</span>
                              </div>
                            )}
                          </div>
                          {expert.tags && expert.tags.length > 0 && (
                            <div className={styles.expertTags}>
                              {expert.tags.map((tag, tagIndex) => (
                                <span key={tagIndex} className={styles.expertTag}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>
          </div>
        </div>
        )}

        {/* YouTube Section - Full Width */}
        {data.youtubeUrls && data.youtubeUrls.length > 0 && (
          <div className={styles.fullWidthSection}>
            <div className={styles.fullWidthContainer}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionHeaderContent}>
                <div>
                  <h2 className={styles.sectionTitle}>YOUTUBE</h2>
                  <p className={styles.sectionSubtitle}>함께공식 유튜브</p>
                </div>
                <div className={styles.navigationButtons}>
                  <button
                    className={styles.navButton}
                    onClick={handleYoutubePrev}
                    disabled={youtubePage === 0}
                  >
                    <Icon type="arrow-left2-white" size={20} />
                  </button>
                  <button
                    className={styles.navButton}
                    onClick={handleYoutubeNext}
                    disabled={youtubePage >= Math.ceil(data.youtubeUrls.length / 4) - 1}
                  >
                    <Icon type="arrow-right2-white" size={20} />
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.youtubeContent}>
              <div
                className={styles.youtubeGrid}
                style={{
                  transform: `translateX(-${youtubePage * 100}%)`,
                }}
              >
                {Array.from({ length: Math.ceil(data.youtubeUrls.length / 4) }).map((_, pageIndex) => (
                  <div key={pageIndex} className={styles.youtubePage}>
                    {data.youtubeUrls.slice(pageIndex * 4, (pageIndex + 1) * 4).map((url, index) => {
                      const videoId = extractYouTubeId(url);
                      if (!videoId) return null;
                      return (
                        <div key={index} className={styles.youtubeCard}>
                          <div className={styles.youtubeThumbnail}>
                            <img
                              src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                              alt={`YouTube video ${index + 1}`}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                              }}
                            />
                          </div>
                          <div className={styles.youtubeInfo}>
                            <p className={styles.youtubeChannel}>세무법인함께 TV</p>
                            <p className={styles.youtubeTitle}>
                              {/* YouTube API를 통해 제목을 가져올 수 있지만, 여기서는 URL만 있으므로 기본 텍스트 사용 */}
                              세무 관련 정보를 제공하는 영상입니다
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </section>
          </div>
        </div>
        )}

        {/* Related News Section - Full Width */}
        {relatedNews.length > 0 && (
          <div className={styles.fullWidthSection}>
            <div className={styles.fullWidthContainer}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionHeaderContent}>
                <div>
                  <h2 className={styles.sectionTitle}>RELATED NEWS</h2>
                  <p className={styles.sectionSubtitle}>관련 소식</p>
                </div>
                <div className={styles.navigationButtons}>
                  <button
                    className={styles.navButton}
                    onClick={handleNewsPrev}
                    disabled={newsPage === 0}
                  >
                    <Icon type="arrow-left2-white" size={20} />
                  </button>
                  <button
                    className={styles.navButton}
                    onClick={handleNewsNext}
                    disabled={newsPage >= Math.ceil(relatedNews.length / 4) - 1}
                  >
                    <Icon type="arrow-right2-white" size={20} />
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.newsContent}>
              <div
                className={styles.newsGrid}
                style={{
                  transform: `translateX(-${newsPage * 100}%)`,
                }}
              >
                {Array.from({ length: Math.ceil(relatedNews.length / 4) }).map((_, pageIndex) => (
                  <div key={pageIndex} className={styles.newsPage}>
                    {relatedNews.slice(pageIndex * 4, (pageIndex + 1) * 4).map((news) => (
                      <div
                        key={news.id}
                        className={styles.newsCard}
                        onClick={() => router.push(`/insights/${news.id}`)}
                      >
                        {news.thumbnail && (
                          <div className={styles.newsThumbnail}>
                            <img src={news.thumbnail.url} alt={news.title} />
                          </div>
                        )}
                        <div className={styles.newsInfo}>
                          <div className={styles.newsHeader}>
                            {news.category && (
                              <p className={styles.newsCategory}>
                                {typeof news.category === 'string' 
                                  ? news.category 
                                  : (typeof news.category === 'object' && news.category?.name 
                                    ? news.category.name 
                                    : '카테고리')}
                              </p>
                            )}
                            <h3 className={styles.newsTitle}>{news.title}</h3>
                          </div>
                          <div className={styles.newsMeta}>
                            {news.author && (
                              <>
                                <span className={styles.newsAuthor}>{news.author}</span>
                                <span className={styles.newsSeparator}>•</span>
                              </>
                            )}
                            {news.createdAt && (
                              <span className={styles.newsDate}>{formatDate(news.createdAt)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>
          </div>
        </div>
        )}

      <Footer />

      {/* Floating Buttons */}
      <div className={styles.floatingButtons}>
        <FloatingButton
          variant="consult"
          label="상담 신청하기"
          onClick={handleConsultClick}
        />
        <FloatingButton variant="top" onClick={handleTopClick} />
      </div>
    </div>
  );
};

export default BusinessAreaDetailPage;

