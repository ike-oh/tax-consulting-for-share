import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/common/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/common/Footer';
import PageHeader from '@/components/common/PageHeader';
import FloatingButton from '@/components/common/FloatingButton';
import Icon from '@/components/common/Icon';
import { get } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import styles from './hierarchical.module.scss';

interface SectionContent {
  content: string;
  section: string;
}

interface BusinessItem {
  id: number;
  name: string;
  subDescription?: string;
  image?: {
    id: number;
    url: string;
  };
  overview?: string;
  sectionContents?: SectionContent[];
  youtubeUrls?: string[];
  youtubeCount?: number;
  isMainExposed?: boolean;
  isExposed?: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface MinorCategory {
  id: number;
  name: string;
  isExposed: boolean;
  items: BusinessItem[];
}

interface MajorCategory {
  id: number;
  name: string;
  sections: string[];
  isExposed: boolean;
  displayOrder: number;
}

interface HierarchicalData {
  majorCategory: MajorCategory;
  minorCategories: MinorCategory[];
}

const HierarchicalPage: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [data, setData] = useState<HierarchicalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // URL 쿼리 파라미터에서 탭 읽기
  const tabFromQuery = router.query.tab as string;
  const initialTab = tabFromQuery === 'consulting' ? 'consulting' : 'hierarchical';
  const [activeTab, setActiveTab] = useState<'hierarchical' | 'consulting'>(initialTab);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set([1])); // 첫 번째 카테고리 기본 펼침

  // URL 쿼리 파라미터가 변경되면 탭 업데이트
  useEffect(() => {
    if (tabFromQuery === 'consulting') {
      setActiveTab('consulting');
    } else if (tabFromQuery === 'hierarchical' || !tabFromQuery) {
      setActiveTab('hierarchical');
    }
  }, [tabFromQuery]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await get<HierarchicalData[]>(
          `${API_ENDPOINTS.BUSINESS_AREAS_HIERARCHICAL}?limit=20&page=1`
        );

        if (response.error) {
          setError(response.error);
        } else if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setData(response.data[0]);
        } else {
          setError('데이터를 불러올 수 없습니다.');
        }
      } catch (err) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleItemClick = (item: BusinessItem) => {
    router.push(`/business-areas/${item.id}`);
  };

  const handleTopClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConsultClick = () => {
    // 상담 신청하기 로직
    router.push('/consultation/apply');
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} />
        <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.page}>
        <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} />
        <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <div className={styles.error}>{error || '데이터를 불러올 수 없습니다.'}</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} />
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <div className={styles.container}>
        <PageHeader
          title="업무분야"
          breadcrumbs={[{ label: '업무 분야' }]}
          tabs={[
            { id: 'hierarchical', label: '업종별' },
            { id: 'consulting', label: '컨설팅' }
          ]}
          activeTabId={activeTab}
          onTabChange={(id) => setActiveTab(id as 'hierarchical' | 'consulting')}
        />

        {/* Categories List */}
        {activeTab === 'hierarchical' && (
          <div className={styles.categoriesContainer}>
            <div className={styles.categoriesGrid}>
              {/* Left Column */}
              <div className={styles.leftColumn}>
                {data.minorCategories.filter((_, index) => index % 2 === 0).map((minorCategory) => {
                  const isExpanded = expandedCategories.has(minorCategory.id);
                  const items = minorCategory.items || [];

                  return (
                    <div key={minorCategory.id} className={styles.categoryColumn}>
                      <div
                        className={`${styles.categoryHeader} ${isExpanded ? styles.categoryHeaderExpanded : ''}`}
                        onClick={() => toggleCategory(minorCategory.id)}
                      >
                        <span className={styles.categoryName}>{minorCategory.name}</span>
                        <button className={styles.categoryToggle}>
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            className={`${styles.chevronIcon} ${isExpanded ? styles.chevronIconRotated : ''}`}
                          >
                            <path
                              d="M6 9L12 15L18 9"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>

                      {isExpanded && items.length > 0 && (
                        <div className={styles.categoryItems}>
                          {items.map((item, index) => (
                            <div
                              key={item.id}
                              className={`${styles.categoryItem} ${index === 0 ? styles.categoryItemFirst : ''}`}
                              onClick={() => handleItemClick(item)}
                            >
                              <span className={styles.itemName}>{item.name}</span>
                              <Icon type="arrow-right2-gray" size={16} className={styles.arrowIcon} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Right Column */}
              <div className={styles.rightColumn}>
                {data.minorCategories.filter((_, index) => index % 2 === 1).map((minorCategory) => {
                  const isExpanded = expandedCategories.has(minorCategory.id);
                  const items = minorCategory.items || [];

                  return (
                    <div key={minorCategory.id} className={styles.categoryColumn}>
                      <div
                        className={`${styles.categoryHeader} ${isExpanded ? styles.categoryHeaderExpanded : ''}`}
                        onClick={() => toggleCategory(minorCategory.id)}
                      >
                        <span className={styles.categoryName}>{minorCategory.name}</span>
                        <button className={styles.categoryToggle}>
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            className={`${styles.chevronIcon} ${isExpanded ? styles.chevronIconRotated : ''}`}
                          >
                            <path
                              d="M6 9L12 15L18 9"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>

                      {isExpanded && items.length > 0 && (
                        <div className={styles.categoryItems}>
                          {items.map((item, index) => (
                            <div
                              key={item.id}
                              className={`${styles.categoryItem} ${index === 0 ? styles.categoryItemFirst : ''}`}
                              onClick={() => handleItemClick(item)}
                            >
                              <span className={styles.itemName}>{item.name}</span>
                              <Icon type="arrow-right2-gray" size={16} className={styles.arrowIcon} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

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

export default HierarchicalPage;

