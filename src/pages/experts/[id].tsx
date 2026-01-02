import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import Header from '@/components/common/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/common/Footer';
import FloatingButton from '@/components/common/FloatingButton';
import PageHeader from '@/components/common/PageHeader';
import Icon from '@/components/common/Icon';
import { get } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import styles from './detail.module.scss';

// Toast UI Viewer는 클라이언트 사이드에서만 로드
const Viewer = dynamic(
  () => import('@toast-ui/react-editor').then((mod) => mod.Viewer),
  { ssr: false }
);

interface MemberDetail {
  id: number;
  name: string;
  mainPhoto?: {
    id: number;
    url: string;
  };
  subPhoto?: {
    id: number;
    url: string;
  };
  workAreas: string[] | Array<{ id: number; value: string }>;
  affiliation: string;
  phoneNumber: string;
  email: string;
  vcard?: {
    id: number;
    url: string;
  };
  pdf?: {
    id: number;
    url: string;
  };
  oneLineIntro: string;
  expertIntro: string;
  mainCases: string;
  education: string;
  careerAndAwards: string;
  booksActivitiesOther: string;
  isExposed: boolean;
  displayOrder: number;
}

interface InsightItem {
  id: number;
  title: string;
  content: string;
  thumbnail?: {
    url: string;
  };
  createdAt?: string;
  category?: string | { id: number; name: string; type: string };
  author?: string;
}

interface InsightResponse {
  items: InsightItem[];
  total: number;
}

const ExpertDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [data, setData] = useState<MemberDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedNews, setRelatedNews] = useState<InsightItem[]>([]);
  const [newsPage, setNewsPage] = useState(0);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (id) {
      fetchExpertDetail();
      fetchRelatedNews();
    }
  }, [id]);

  const fetchExpertDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await get<MemberDetail>(
        `${API_ENDPOINTS.MEMBERS}/${id}`
      );

      if (response.data) {
        setData(response.data);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError('전문가 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedNews = async () => {
    try {
      const response = await get<InsightResponse>(
        `${API_ENDPOINTS.INSIGHTS}?page=1&limit=4`
      );

      if (response.data) {
        setRelatedNews(response.data.items || []);
      }
    } catch (err) {
      console.error('관련 소식을 불러오는 중 오류:', err);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const handleTopClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConsultClick = () => {
    router.push('/consultation/apply');
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

  const handleDownloadVCard = () => {
    if (data?.vcard?.url) {
      window.open(data.vcard.url, '_blank');
    }
  };

  const handleDownloadPDF = () => {
    if (data?.pdf?.url) {
      window.open(data.pdf.url, '_blank');
    }
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
            <p>{error || '전문가를 찾을 수 없습니다.'}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Breadcrumb 생성
  const breadcrumbs = [
    { label: '전문가', href: '/experts' },
    { label: data.name },
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
        {data.mainPhoto?.url && !imageError ? (
          <img 
            src={data.mainPhoto.url} 
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
        <div className={styles.heroContent}>
          <div className={styles.heroInfo}>
            <div className={styles.heroNameRow}>
              <h1 className={styles.heroName}>{data.name}</h1>
              <span className={styles.heroPosition}>세무사</span>
            </div>
            <div className={styles.heroContact}>
              {data.phoneNumber && (
                <div className={styles.heroContactItem}>
                  <Icon type="call" size={20} />
                  <span className={styles.heroContactLabel}>{data.phoneNumber}</span>
                </div>
              )}
              {data.email && (
                <div className={styles.heroContactItem}>
                  <Icon type="mail" size={20} />
                  <span className={styles.heroContactLabel}>{data.email}</span>
                </div>
              )}
              {data.affiliation && (
                <div className={styles.heroContactItem}>
                  <Icon type="location" size={20} />
                  <span className={styles.heroContactLabel}>{data.affiliation}</span>
                </div>
              )}
            </div>
            {data.workAreas && data.workAreas.length > 0 && (
              <div className={styles.heroWorkAreas}>
                <p className={styles.heroWorkAreasLabel}>주요 업무 분야</p>
                <div className={styles.heroWorkAreasTags}>
                  {data.workAreas.map((area, index) => (
                    <span key={index} className={styles.heroWorkAreaTag}>
                      {typeof area === 'string' ? area : (area?.value || String(area?.id || ''))}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className={styles.heroActions}>
            {data.vcard && (
              <button className={styles.actionButton} onClick={handleDownloadVCard}>
                <Icon type="document" size={20} />
                <span>연락처 저장</span>
              </button>
            )}
            {data.pdf && (
              <button className={styles.actionButton} onClick={handleDownloadPDF}>
                <Icon type="document" size={20} />
                <span>이력서 다운로드</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {/* About the Expert Section */}
          {data.expertIntro && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>About the Expert</h2>
              <div className={styles.sectionContent}>
                <Viewer initialValue={data.expertIntro} />
              </div>
            </section>
          )}

          {/* Main Cases Section */}
          {data.mainCases && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>주요 처리 사례</h2>
              <div className={styles.sectionContent}>
                <Viewer initialValue={data.mainCases} />
              </div>
            </section>
          )}

          {/* Education Section */}
          {data.education && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>학력</h2>
              <div className={styles.sectionContent}>
                <Viewer initialValue={data.education} />
              </div>
            </section>
          )}

          {/* Career and Awards Section */}
          {data.careerAndAwards && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>경력 및 수상 실적</h2>
              <div className={styles.sectionContent}>
                <Viewer initialValue={data.careerAndAwards} />
              </div>
            </section>
          )}

          {/* Books, Activities, Other Section */}
          {data.booksActivitiesOther && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>저서·활동·기타</h2>
              <div className={styles.sectionContent}>
                <Viewer initialValue={data.booksActivitiesOther} />
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            {data.subPhoto?.url && (
              <div className={styles.sidebarImage}>
                <img src={data.subPhoto.url} alt={data.name} />
              </div>
            )}
            <div className={styles.sidebarInfo}>
              <h3 className={styles.sidebarName}>{data.name}</h3>
              <p className={styles.sidebarPosition}>세무사</p>
              {data.oneLineIntro && (
                <p className={styles.sidebarIntro}>{data.oneLineIntro}</p>
              )}
              <div className={styles.sidebarContact}>
                {data.phoneNumber && (
                  <div className={styles.sidebarContactItem}>
                    <Icon type="call" size={16} />
                    <span>{data.phoneNumber}</span>
                  </div>
                )}
                {data.email && (
                  <div className={styles.sidebarContactItem}>
                    <Icon type="mail" size={16} />
                    <span>{data.email}</span>
                  </div>
                )}
                {data.affiliation && (
                  <div className={styles.sidebarContactItem}>
                    <Icon type="location" size={16} />
                    <span>{data.affiliation}</span>
                  </div>
                )}
              </div>
              {data.workAreas && data.workAreas.length > 0 && (
                <div className={styles.sidebarWorkAreas}>
                  <p className={styles.sidebarWorkAreasLabel}>주요 업무 분야</p>
                  <div className={styles.sidebarWorkAreasTags}>
                    {data.workAreas.map((area, index) => (
                      <span key={index} className={styles.sidebarWorkAreaTag}>
                        {typeof area === 'string' ? area : (area?.value || String(area?.id || ''))}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related News Section */}
      {relatedNews.length > 0 && (
        <div className={styles.relatedNewsSection}>
          <div className={styles.relatedNewsContainer}>
            <div className={styles.relatedNewsHeader}>
              <h2 className={styles.relatedNewsTitle}>RELATED NEWS</h2>
              <p className={styles.relatedNewsSubtitle}>관련 소식</p>
              <div className={styles.relatedNewsNavigation}>
                <button
                  className={styles.newsNavButton}
                  onClick={handleNewsPrev}
                  disabled={newsPage === 0}
                >
                  <Icon type="arrow-left-white" size={24} />
                </button>
                <button
                  className={styles.newsNavButton}
                  onClick={handleNewsNext}
                  disabled={newsPage >= Math.ceil(relatedNews.length / 4) - 1}
                >
                  <Icon type="arrow-right-white" size={24} />
                </button>
              </div>
            </div>
            <div className={styles.relatedNewsGrid}>
              {Array.from({ length: Math.ceil(relatedNews.length / 4) }).map((_, pageIndex) => (
                <div
                  key={pageIndex}
                  className={styles.relatedNewsPage}
                  style={{ display: pageIndex === newsPage ? 'grid' : 'none' }}
                >
                  {relatedNews.slice(pageIndex * 4, (pageIndex + 1) * 4).map((news) => (
                    <div
                      key={news.id}
                      className={styles.relatedNewsCard}
                      onClick={() => router.push(`/insights/${news.id}`)}
                    >
                      {news.thumbnail?.url && (
                        <div className={styles.relatedNewsImage}>
                          <img src={news.thumbnail.url} alt={news.title} />
                        </div>
                      )}
                      <div className={styles.relatedNewsContent}>
                        {news.category && (
                          <p className={styles.relatedNewsCategory}>
                            {typeof news.category === 'string' 
                              ? news.category 
                              : (typeof news.category === 'object' && news.category?.name 
                                ? news.category.name 
                                : '카테고리')}
                          </p>
                        )}
                        <h3 className={styles.relatedNewsTitle}>{news.title}</h3>
                        <div className={styles.relatedNewsMeta}>
                          {news.author && (
                            <>
                              <span className={styles.relatedNewsAuthor}>{news.author}</span>
                              <span className={styles.relatedNewsSeparator}>•</span>
                            </>
                          )}
                          {news.createdAt && (
                            <span className={styles.relatedNewsDate}>{formatDate(news.createdAt)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
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
        <FloatingButton
          variant="top"
          onClick={handleTopClick}
        />
      </div>
    </div>
  );
};

export default ExpertDetailPage;

