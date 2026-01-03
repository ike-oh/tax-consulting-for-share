import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/common/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/common/Footer';
import PageHeader from '@/components/common/PageHeader';
import FloatingButton from '@/components/common/FloatingButton';
import Icon from '@/components/common/Icon';
import Card from '@/components/common/Card';
import { get } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import styles from './experts.module.scss';

interface Expert {
  id?: number;
  name: string;
  position?: string;
  affiliation?: string;
  tel?: string;
  phoneNumber?: string;
  email: string;
  imageUrl?: string;
  mainPhoto?: {
    id: number;
    url: string;
  };
}

interface Category {
  id: number;
  name: string;
  isExposed: boolean;
  majorCategoryId: number;
  majorCategoryName: string;
}

interface MembersResponse {
  items?: Expert[];
  data?: Expert[];
  total?: number;
  page?: number;
  limit?: number;
}

const ExpertsPage: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string>('분야를 선택해주세요');
  const [selectedFieldId, setSelectedFieldId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingExperts, setIsLoadingExperts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const personalSubCategories = [
    '연금 저축',
    'IRP',
    '건강/실손/암',
    '상속/증여',
  ];

  const businessSubCategories = [
    '화재',
    '배상책임',
    '경영자 보험',
    '임직원 복지 보험',
  ];

  // 분야 목록 가져오기
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      setError(null);
      try {
        const response = await get<Category[]>(API_ENDPOINTS.BUSINESS_AREAS_CATEGORIES);
        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          // isExposed가 true인 분야만 필터링
          const exposedCategories = response.data.filter(cat => cat.isExposed);
          setCategories(exposedCategories);
        }
      } catch (err) {
        setError('분야 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // 선택된 분야에 따라 전문가 목록 가져오기
  useEffect(() => {
    if (selectedFieldId === null) {
      setExperts([]);
      return;
    }

    const fetchExperts = async () => {
      setIsLoadingExperts(true);
      setError(null);
      try {
        const url = `${API_ENDPOINTS.MEMBERS}?page=1&limit=20&workArea=${selectedFieldId}`;
        console.log('Fetching experts from:', url);
        const response = await get<Expert[] | MembersResponse>(url);
        console.log('API Response:', response);
        
        if (response.error) {
          console.error('API Error:', response.error);
          setError(response.error);
          setExperts([]);
        } else if (response.data) {
          // 응답이 배열인 경우와 객체인 경우 모두 처리
          let expertsList: Expert[] = [];
          if (Array.isArray(response.data)) {
            expertsList = response.data;
          } else {
            const membersResponse = response.data as MembersResponse;
            // items 필드 우선 확인, 없으면 data 필드 확인
            expertsList = membersResponse.items || membersResponse.data || [];
          }
          console.log('Parsed experts list:', expertsList);
          setExperts(expertsList);
        } else {
          console.warn('No data in response');
          setExperts([]);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('전문가 목록을 불러오는 중 오류가 발생했습니다.');
        setExperts([]);
      } finally {
        setIsLoadingExperts(false);
      }
    };

    fetchExperts();
  }, [selectedFieldId]);

  const handleFieldSelect = (category: Category) => {
    setSelectedField(category.name);
    setSelectedFieldId(category.id);
    setIsDropdownOpen(false);
    // 선택된 분야로 스크롤
    setTimeout(() => {
      const expertsSection = document.getElementById('experts-list-section');
      if (expertsSection) {
        expertsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };


  const handleTopClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConsultClick = () => {
    router.push('/consultation/apply');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className={styles.expertsPage}>
      <Header
        variant="transparent"
        size="web"
        onMenuClick={() => setIsMenuOpen(true)}
        onLogoClick={() => router.push('/')}
      />
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className={styles.pageContent}>
        {/* Page Header */}
        <div className={styles.pageHeaderSection}>
          <PageHeader
            title="전문가 소개"
            breadcrumbs={[
              { label: '전문가 소개' }
            ]}
            size="web"
          />
        </div>

        {/* Hero Section */}
        <div className={styles.heroSection}>
          <div className={styles.heroBackground}>
            <div className={styles.heroOverlay} />
          </div>
          <p className={styles.heroSubtitle}>(전문가 소개)</p>
          <div className={styles.heroTitle}>
            <span className={styles.heroTitleText}>TEAM</span>
            <span className={styles.heroTitleText}>OF</span>
            <span className={`${styles.heroTitleText} ${styles.heroTitleItalic}`}>EXPERTS</span>
          </div>
          <div className={styles.heroContent}>
            <div className={styles.heroDescription}>
              <p className={styles.heroDescriptionTitle}>
                세무법인 함께, 라인업에서 나옵니다
              </p>
              <div className={styles.heroDescriptionText}>
                <p>
                  <span>국세청 근무 경력을 포함 </span>
                  <span className={styles.boldText}>30년 이상 세무사 n명</span>
                </p>
                <p>
                  <span>세무사 경력 </span>
                  <span className={styles.boldText}>10년 이상 세무사 n명</span>
                </p>
                <p>함께 하는 신뢰와 함께, 든든한 구성원을 안내드립니다.</p>
              </div>
            </div>
            <div className={styles.fieldSelector} ref={dropdownRef}>
              <div
                className={styles.fieldSelectorInput}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <p>{selectedField}</p>
                <Icon 
                  type="chevron-down-white" 
                  size={20}
                  className={styles.dropdownArrow}
                  style={{
                    transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }}
                />
              </div>
              {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.dropdownContent}>
                    {isLoadingCategories ? (
                      <div className={styles.dropdownItem}>
                        <p>로딩 중...</p>
                      </div>
                    ) : categories.length > 0 ? (
                      categories.map((category) => (
                        <div
                          key={category.id}
                          className={`${styles.dropdownItem} ${
                            selectedFieldId === category.id ? styles.dropdownItemActive : ''
                          }`}
                          onClick={() => handleFieldSelect(category)}
                        >
                          <p>{category.name}</p>
                        </div>
                      ))
                    ) : (
                      <div className={styles.dropdownItem}>
                        <p>분야가 없습니다</p>
                      </div>
                    )}
                  </div>
                  <div className={styles.dropdownDivider} />
                  <div className={styles.dropdownDivider} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Experts List Section - shown when field is selected */}
        {selectedField !== '분야를 선택해주세요' && (
          <div id="experts-list-section" className={styles.expertsListSection}>
            <div className={styles.expertsListContent}>
              <div className={styles.expertsListLayout}>
                <div className={styles.expertsListHeader}>
                  <h2 className={styles.expertsListTitle}>{selectedField}</h2>
                </div>
                {isLoadingExperts ? (
                  <div className={styles.loadingContainer}>
                    <p>전문가 목록을 불러오는 중...</p>
                  </div>
                ) : error ? (
                  <div className={styles.errorContainer}>
                    <p>{error}</p>
                  </div>
                ) : experts.length > 0 ? (
                  <div className={styles.expertsGridWrapper}>
                    <div className={styles.expertsGrid}>
                      {experts.map((expert, index) => (
                        <Card
                          key={expert.id || index}
                          variant="profile"
                          title={expert.name}
                          position={expert.position || expert.affiliation || ''}
                          tel={expert.tel || expert.phoneNumber || ''}
                          email={expert.email}
                          imageUrl={expert.imageUrl || expert.mainPhoto?.url}
                          size="web"
                          className={styles.expertCard}
                          onClick={() => expert.id && router.push(`/experts/${expert.id}`)}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className={styles.emptyContainer}>
                    <p>해당 분야의 전문가가 없습니다.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Organization Section - shown when no field is selected */}
        {selectedField === '분야를 선택해주세요' && (
          <div className={styles.organizationSection}>
            <div className={styles.organizationContent}>
              <div className={styles.organizationTitle}>
                <p>ORGANIZATION</p>
              </div>
              <div className={styles.organizationMain}>
                <div className={styles.organizationHeader}>
                  <div className={styles.organizationLogo}>
                    <img 
                      src="http://localhost:3845/assets/3013b1c604857194385c4a02ff918ca807545dad.svg" 
                      alt="Organization" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <p className={styles.organizationName}>보험단</p>
                  <div className={styles.organizationSubtitle}>
                    <img 
                      src="http://localhost:3845/assets/13835885d0e277de81da96f331bcaeb085d2692c.svg" 
                      alt="Subtitle" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
                <div className={styles.hierarchyDiagram}>
                  <div className={styles.diagramMainCategories}>
                    <div className={styles.mainCategoryWrapper}>
                      <div className={styles.mainCategoryBox}>
                        <p>개인 보험 컨설팅</p>
                      </div>
                      <div className={styles.subCategoryColumn}>
                        {personalSubCategories.map((subCategory, index) => (
                          <div key={index} className={styles.subCategoryBox}>
                            <p>{subCategory}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={styles.mainCategoryWrapper}>
                      <div className={styles.mainCategoryBox}>
                        <p>기업 보험 컨설팅</p>
                      </div>
                      <div className={styles.subCategoryColumn}>
                        {businessSubCategories.map((subCategory, index) => (
                          <div key={index} className={styles.subCategoryBox}>
                            <p>{subCategory}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <Footer variant="web" />
      </div>

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

export default ExpertsPage;

