import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import Header from '@/components/common/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/common/Footer';
import FloatingButton from '@/components/common/FloatingButton';
import Button from '@/components/common/Button';
import Icon from '@/components/common/Icon';
import { get, post } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import styles from './detail.module.scss';

// Toast UI Viewer는 클라이언트 사이드에서만 로드
const Viewer = dynamic(
  () => import('@toast-ui/react-editor').then((mod) => mod.Viewer),
  { ssr: false }
);

interface InsightThumbnail {
  url: string;
}

interface InsightCategory {
  id: number;
  name: string;
  type: string;
}

interface InsightSubcategory {
  id: number;
  name: string;
  sections: string[];
}

interface InsightDetail {
  id: number;
  title: string;
  content: string;
  thumbnail?: InsightThumbnail;
  category: InsightCategory;
  subcategory?: InsightSubcategory;
  enableComments: boolean;
  isExposed: boolean;
  isMainExposed: boolean;
  createdAt?: string;
  updatedAt?: string;
  viewCount?: number;
}

interface InsightNavigation {
  id: number;
  title: string;
}

const InsightDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [insight, setInsight] = useState<InsightDetail | null>(null);
  const [prevInsight, setPrevInsight] = useState<InsightNavigation | null>(null);
  const [nextInsight, setNextInsight] = useState<InsightNavigation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchInsightDetail();
    }
  }, [id]);

  const fetchInsightDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      // 상세 데이터 가져오기
      const response = await get<InsightDetail>(
        `${API_ENDPOINTS.INSIGHTS}/${id}`
      );

      if (response.data) {
        setInsight(response.data);
        
        // 조회수 증가 (클라이언트에서만 실행)
        if (typeof window !== 'undefined') {
          try {
            await post(`${API_ENDPOINTS.INSIGHTS}/${id}/increment-view`);
          } catch (err) {
            // 조회수 증가 실패는 무시
          }
        }
        
        // 이전/다음 글 가져오기
        // 먼저 초기화
        setPrevInsight(null);
        setNextInsight(null);
        
        try {
          const navResponse = await get<{ items: InsightDetail[] }>(
            `${API_ENDPOINTS.INSIGHTS}?page=1&limit=100`
          );

          if (navResponse.data && navResponse.data.items) {
            const items = navResponse.data.items;
            const currentIndex = items.findIndex(item => item.id === Number(id));
            
            // 현재 글을 찾았을 때만 처리
            if (currentIndex >= 0) {
              // 이전 글 설정
              if (currentIndex > 0) {
                setPrevInsight({
                  id: items[currentIndex - 1].id,
                  title: items[currentIndex - 1].title
                });
              }
              
              // 다음 글 설정
              if (currentIndex < items.length - 1) {
                setNextInsight({
                  id: items[currentIndex + 1].id,
                  title: items[currentIndex + 1].title
                });
              }
            }
          }
        } catch (err) {
          // 네비게이션 실패는 무시
        }
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const handleBackToList = () => {
    router.push('/insights');
  };

  const handlePrevClick = () => {
    if (prevInsight && prevInsight.id) {
      router.push(`/insights/${prevInsight.id}`);
    }
  };

  const handleNextClick = () => {
    if (nextInsight && nextInsight.id) {
      router.push(`/insights/${nextInsight.id}`);
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

  if (error || !insight) {
    return (
      <div className={styles.page}>
        <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} />
        <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <div className={styles.container}>
          <div className={styles.error}>
            <p>{error || '인사이트를 찾을 수 없습니다.'}</p>
            <Button onClick={handleBackToList}>목록으로 돌아가기</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} />
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className={styles.floatingButtons}>
        <FloatingButton
          variant="consult"
          label="상담 신청하기"
          onClick={() => router.push('/consultation/apply')}
        />
        <FloatingButton
          variant="top"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        />
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.headerSection}>
            <div className={styles.category}>{typeof insight.subcategory?.name === 'string' ? insight.subcategory.name : (typeof insight.category?.name === 'string' ? insight.category.name : '카테고리명')}</div>
            <h1 className={styles.title}>{insight.title}</h1>
            <div className={styles.meta}>
              <div className={styles.metaLeft}>
                <span className={styles.author}>작성자명</span>
                <span className={styles.divider}>|</span>
                <span className={styles.date}>{formatDate(insight.createdAt)}</span>
              </div>
              <div className={styles.metaRight}>
                <img 
                  src="/images/insights/icons/printer.svg" 
                  alt="프린트" 
                  className={styles.icon}
                />
                <img 
                  src="/images/insights/icons/share.svg" 
                  alt="공유" 
                  className={styles.icon}
                />
              </div>
            </div>
          </div>

          <div className={styles.bodySection}>
            {insight.thumbnail && (
              <div className={styles.imageSection}>
                <img src={insight.thumbnail.url} alt={insight.title} />
              </div>
            )}
            <div className={styles.bodyContent}>
              <Viewer initialValue={insight.content} />
            </div>
          </div>

          <div className={styles.navigationSection}>
            <div className={styles.dividerLine} />
            <div className={styles.navigation}>
              <div className={styles.navItem} onClick={handlePrevClick}>
                {prevInsight ? (
                  <>
                    <Icon type="arrow-left-gray" size={24} className={styles.navIcon} />
                    <span className={styles.navLabel}>이전 글</span>
                    <span className={styles.navTitle}>{prevInsight.title}</span>
                  </>
                ) : (
                  <div className={styles.navEmpty}>이전 글이 없습니다</div>
                )}
              </div>
              <div className={styles.navItem} onClick={handleNextClick}>
                {nextInsight ? (
                  <>
                    <span className={styles.navTitle}>{nextInsight.title}</span>
                    <span className={styles.navLabel}>다음 글</span>
                    <Icon type="arrow-right-gray" size={24} className={styles.navIcon} />
                  </>
                ) : (
                  <div className={styles.navEmpty}>다음 글이 없습니다</div>
                )}
              </div>
            </div>
            <Button
              type="line-white"
              size="large"
              onClick={handleBackToList}
              leftIcon="list-white"
              className={styles.backButton}
            >
              목록보기
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default InsightDetailPage;

