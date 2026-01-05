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

// 컨설팅 하드코딩 데이터
interface ConsultingSubItem {
  id: string;
  name: string;
  description: string;
}

interface ConsultingCategory {
  id: string;
  name: string;
  subItems: ConsultingSubItem[];
}

const CONSULTING_DATA: ConsultingCategory[] = [
  {
    id: '2.1',
    name: '기업구조 컨설팅',
    subItems: [
      { id: '2.1.1', name: '법인 설립·전환', description: '개인사업자 → 법인 전환, 법인설립 컨설팅, 정관 작성, 지분구조 설계' },
      { id: '2.1.2', name: '조직 구조조정', description: '합병·분할·현물출자, 지주회사·자회사 구조, 사업양수도, 청산 절차' },
      { id: '2.1.3', name: 'M&A·기업인수합병', description: '인수합병 세무전략, Due Diligence, 기업가치평가, 거래구조 설계' },
      { id: '2.1.4', name: '기업공개(IPO)·투자유치', description: '상장준비 세무자문, 투자유치 지원, 주식발행, 벤처투자 대응' },
    ],
  },
  {
    id: '2.2',
    name: '자본·주식 관리',
    subItems: [
      { id: '2.2.1', name: '차명주식 정리', description: '차명주식 환원, 명의신탁 해지, 실명전환 절차, 증여세 대응' },
      { id: '2.2.2', name: '가지급금 정리', description: '가지급금 세무 리스크 관리, 대표자 차입금 정리, 특수관계인 거래 관리' },
      { id: '2.2.3', name: '주식 관리·평가', description: '비상장주식 평가, 자기주식 취득·소각, 주식매수선택권(스톡옵션) 관리' },
      { id: '2.2.4', name: '자본금·잉여금 관리', description: '자본금 증감, 이익잉여금 관리, 배당정책 수립, 차등배당 설계' },
    ],
  },
  {
    id: '2.3',
    name: '가업승계·상속증여',
    subItems: [
      { id: '2.3.1', name: '가업승계 설계', description: '가업상속공제 활용, 승계계획 수립, 후계자 육성 방안' },
      { id: '2.3.2', name: '가업승계 증여특례', description: '가업승계 증여세 과세특례, 경영권 이전, 사전증여 전략' },
      { id: '2.3.3', name: '상속세·증여세 절세', description: '상속세 사전진단, 증여세 절세방안, 상속재산 평가' },
      { id: '2.3.4', name: '승계 후 사후관리', description: '가업승계 요건 관리, 사후관리 컨설팅, 의무이행 점검' },
    ],
  },
  {
    id: '2.4',
    name: '세무조사·분쟁 대응',
    subItems: [
      { id: '2.4.1', name: '세무조사 대응', description: '정기·수시 세무조사 대응, 조세범칙조사 지원, 상속·증여세 조사 대응' },
      { id: '2.4.2', name: '사전 세무진단', description: '세무리스크 사전점검, 모의세무조사, 내부통제 점검' },
      { id: '2.4.3', name: '조세불복', description: '이의신청·심사청구, 심판청구, 조세소송 지원' },
      { id: '2.4.4', name: '예규질의', description: '세무법령 해석 질의, 유권해석 신청, 사전결정 신청' },
    ],
  },
  {
    id: '2.5',
    name: '국제조세',
    subItems: [
      { id: '2.5.1', name: '이전가격세제(Transfer Pricing)', description: '이전가격 문서화, 독립기업원칙 적용, 이전가격 조사 대응' },
      { id: '2.5.2', name: '해외투자·진출', description: '해외법인 설립, 해외투자 세무구조, CFC세제 대응' },
      { id: '2.5.3', name: '외국인 투자기업', description: '외국인투자기업 세무관리, 국내원천소득 과세, 조세조약 적용' },
      { id: '2.5.4', name: '필라2(Pillar Two) 대응', description: '글로벌 최저한세 대응, GloBE 규정 적용, 다국적기업 세무전략' },
    ],
  },
  {
    id: '2.6',
    name: '공익법인·비영리법인',
    subItems: [
      { id: '2.6.1', name: '공익법인 세무관리', description: '공익법인 주식보유 관리, 의무이행 신고, 수익사업·비수익사업 구분' },
      { id: '2.6.2', name: '비영리법인 구조조정', description: '비영리법인 합병·분할, 청산 세무, 고유목적사업 관리' },
      { id: '2.6.3', name: '공익법인 설립·운영', description: '공익법인 설립 지원, 정관 작성, 운영 컨설팅' },
    ],
  },
  {
    id: '2.7',
    name: '보험·재무 컨설팅',
    subItems: [
      { id: '2.7.1', name: '법인보험 세무설계', description: '법인세 절감형 보험, Key-Man 보험, 보험차익 과세 검토' },
      { id: '2.7.2', name: '퇴직연금·복리후생', description: '퇴직연금 DB/DC 설계, 임직원 단체보험, 복리후생비 세무처리' },
      { id: '2.7.3', name: '상속·증여 연계 보험', description: '상속세 재원 마련형 보험, 증여·보험 활용 플랜' },
      { id: '2.7.4', name: '보험 세무처리', description: '보험료 손금산입 검토, 해약환급금 과세, 보험 관련 세무조정' },
    ],
  },
  {
    id: '2.8',
    name: '세목별 전문 서비스',
    subItems: [
      { id: '2.8.1', name: '법인세', description: '중소기업 특례, 대기업 세무관리, 세무조정 전문서비스' },
      { id: '2.8.2', name: '소득세', description: '종합소득세 신고, 금융소득 종합과세, 퇴직소득세, 양도소득세' },
      { id: '2.8.3', name: '부가가치세', description: '일반과세자·간이과세자 관리, 영세율·면세 적용, 매출세액·매입세액 관리' },
      { id: '2.8.4', name: '상속·증여세', description: '상속세 신고, 증여세 신고, 재산평가, 공제·감면 적용' },
      { id: '2.8.5', name: '지방세', description: '취득세·등록세, 재산세·종합부동산세, 지방소득세' },
    ],
  },
  {
    id: '2.9',
    name: '업종별 특화 컨설팅',
    subItems: [
      { id: '2.9.1', name: '건설업 특화', description: '건설업 회계, 장기할부 매출인식, 공사손익 관리' },
      { id: '2.9.2', name: '부동산업 특화', description: '부동산PF 세무, 재건축·재개발 세무, 임대소득 관리' },
      { id: '2.9.3', name: 'IT·콘텐츠업 특화', description: '크리에이터 세무, 소프트웨어업 세무, 플랫폼 사업 세무' },
      { id: '2.9.4', name: '의료업 특화', description: '의료법인 세무, 병원 경영 컨설팅, 의료기기업 세무' },
    ],
  },
  {
    id: '2.10',
    name: '기타 전문서비스',
    subItems: [
      { id: '2.10.1', name: '정부지원금·인증', description: '정부지원사업 컨설팅, 벤처기업 인증, 기업부설연구소 설립' },
      { id: '2.10.2', name: '자금조달·대출', description: '기업 자금조달 지원, 정책자금 신청, 투자유치 세무자문' },
      { id: '2.10.3', name: '시스템·디지털화', description: '세무시스템 구축, ERP 연동, 전자세금계산서 시스템' },
      { id: '2.10.4', name: '교육·세미나', description: '업종별 세무교육, 정기세미나, 법령 업데이트 제공' },
    ],
  },
];

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
  const [expandedConsultingCategories, setExpandedConsultingCategories] = useState<Set<string>>(new Set(['2.1'])); // 컨설팅 첫 번째 카테고리 기본 펼침

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

  const toggleConsultingCategory = (categoryId: string) => {
    setExpandedConsultingCategories((prev) => {
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
                        <button
                          type="button"
                          className={`${styles.categoryToggle} ${isExpanded ? styles.categoryToggleExpanded : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCategory(minorCategory.id);
                          }}
                        >
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
                        <button
                          type="button"
                          className={`${styles.categoryToggle} ${isExpanded ? styles.categoryToggleExpanded : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCategory(minorCategory.id);
                          }}
                        >
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

        {/* Consulting Tab */}
        {activeTab === 'consulting' && (
          <div className={styles.categoriesContainer}>
            <div className={styles.categoriesGrid}>
              {/* Left Column */}
              <div className={styles.leftColumn}>
                {CONSULTING_DATA.filter((_, index) => index % 2 === 0).map((category) => {
                  const isExpanded = expandedConsultingCategories.has(category.id);

                  return (
                    <div key={category.id} className={styles.categoryColumn}>
                      <div
                        className={`${styles.categoryHeader} ${isExpanded ? styles.categoryHeaderExpanded : ''}`}
                        onClick={() => toggleConsultingCategory(category.id)}
                      >
                        <span className={styles.categoryName}>{category.name}</span>
                        <button
                          type="button"
                          className={`${styles.categoryToggle} ${isExpanded ? styles.categoryToggleExpanded : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleConsultingCategory(category.id);
                          }}
                        >
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

                      {isExpanded && category.subItems.length > 0 && (
                        <div className={styles.categoryItems}>
                          {category.subItems.map((subItem, index) => (
                            <div
                              key={subItem.id}
                              className={`${styles.categoryItem} ${index === 0 ? styles.categoryItemFirst : ''}`}
                            >
                              <span className={styles.itemName}>{subItem.name}</span>
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
                {CONSULTING_DATA.filter((_, index) => index % 2 === 1).map((category) => {
                  const isExpanded = expandedConsultingCategories.has(category.id);

                  return (
                    <div key={category.id} className={styles.categoryColumn}>
                      <div
                        className={`${styles.categoryHeader} ${isExpanded ? styles.categoryHeaderExpanded : ''}`}
                        onClick={() => toggleConsultingCategory(category.id)}
                      >
                        <span className={styles.categoryName}>{category.name}</span>
                        <button
                          type="button"
                          className={`${styles.categoryToggle} ${isExpanded ? styles.categoryToggleExpanded : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleConsultingCategory(category.id);
                          }}
                        >
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

                      {isExpanded && category.subItems.length > 0 && (
                        <div className={styles.categoryItems}>
                          {category.subItems.map((subItem, index) => (
                            <div
                              key={subItem.id}
                              className={`${styles.categoryItem} ${index === 0 ? styles.categoryItemFirst : ''}`}
                            >
                              <span className={styles.itemName}>{subItem.name}</span>
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

