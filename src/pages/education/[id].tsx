import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import Header from '@/components/common/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/common/Footer';
import Icon from '@/components/common/Icon';
import DatePickerModal from '@/components/education/DatePickerModal';
import ApplicationModal from '@/components/education/ApplicationModal';
import { get } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import type { EducationDetail } from '@/types/education';
import styles from './detail.module.scss';

// Toast UI Viewer는 클라이언트 사이드에서만 로드
const Viewer = dynamic(
  () => import('@toast-ui/react-editor').then((mod) => mod.Viewer),
  { ssr: false }
);

const EducationDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [education, setEducation] = useState<EducationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEducationDetail();
    }
  }, [id]);

  const fetchEducationDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await get<EducationDetail>(
        `${API_ENDPOINTS.TRAINING_SEMINARS}/${id}`
      );

      if (response.data) {
        setEducation(response.data);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntilDeadline = (endDate: string) => {
    const today = new Date();
    const deadline = new Date(endDate);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const formatDate = (dateString: string) => {
    return dateString.replace(/\./g, '.');
  };

  // 교육 일자 포맷팅 (첫 번째 날짜 ~ 마지막 날짜 형식)
  const formatEducationDates = (dates: string[]) => {
    if (!dates || dates.length === 0) return '';
    if (dates.length === 1) {
      const date = dates[0];
      const dateObj = new Date(date.replace(/\./g, '-'));
      const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
      const weekday = weekdays[dateObj.getDay()];
      // YY.MM.DD 형식으로 변환
      const parts = date.split('.');
      const year = parts[0].slice(-2);
      return `${year}.${parts[1]}.${parts[2]} (${weekday})`;
    }
    
    // 첫 번째와 마지막 날짜만 사용
    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];
    
    const firstParts = firstDate.split('.');
    const lastParts = lastDate.split('.');
    const firstYear = firstParts[0].slice(-2);
    const lastYear = lastParts[0].slice(-2);
    
    const firstDateObj = new Date(firstDate.replace(/\./g, '-'));
    const lastDateObj = new Date(lastDate.replace(/\./g, '-'));
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const firstWeekday = weekdays[firstDateObj.getDay()];
    const lastWeekday = weekdays[lastDateObj.getDay()];
    
    // 같은 연도면 두 번째 날짜에서 연도 생략
    const firstFormatted = `${firstYear}.${firstParts[1]}.${firstParts[2]} (${firstWeekday})`;
    const lastFormatted = firstYear === lastYear 
      ? `${lastParts[1]}.${lastParts[2]} (${lastWeekday})`
      : `${lastYear}.${lastParts[1]}.${lastParts[2]} (${lastWeekday})`;
    
    return `${firstFormatted} ~ ${lastFormatted}`;
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

  if (error || !education) {
    return (
      <div className={styles.page}>
        <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} />
        <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <div className={styles.container}>
          <div className={styles.error}>{error || '교육 정보를 찾을 수 없습니다.'}</div>
        </div>
        <Footer />
      </div>
    );
  }

  const daysLeft = getDaysUntilDeadline(education.recruitmentEndDate);

  return (
    <div className={styles.page}>
      <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} />
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.mainSection}>
            <div className={styles.imageSection}>
              <div className={styles.imageWrapper}>
                <img src={education.image.url} alt={education.name} />
              </div>
            </div>
            <div className={styles.bodySection}>
              <div className={styles.bodyContent}>
                <Viewer initialValue={education.body} />
              </div>
            </div>
          </div>

          <div className={styles.sidebar}>
            <div className={styles.sidebarCard}>
              <div className={styles.cardHeader}>
                <div className={styles.labels}>
                  {daysLeft > 0 && (
                    <span className={styles.labelRed}>
                      신청마감 D-{daysLeft}
                    </span>
                  )}
                  <span className={styles.labelWhite}>
                    {education.typeLabel}
                  </span>
                </div>
                <h2 className={styles.cardTitle}>{education.name}</h2>
              </div>

              <div className={styles.divider} />

              <div className={styles.cardInfo}>
                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>
                    <span className={styles.icon}>유형</span>
                  </div>
                  <p className={styles.infoValue}>{education.typeLabel}</p>
                </div>
                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>
                    <span className={styles.icon}>강사</span>
                  </div>
                  <p className={styles.infoValue}>{education.instructorName}</p>
                </div>
                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>
                    <span className={styles.icon}>대상</span>
                  </div>
                  <p className={styles.infoValue}>{education.target}</p>
                </div>
              </div>

              <div className={styles.educationDetails}>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>
                    <img 
                      src="/images/education/icons/graduation 1.svg" 
                      alt="교육 주제" 
                      className={styles.detailIconImage}
                    />
                    <span className={styles.detailIcon}>교육 주제</span>
                  </div>
                  <p className={styles.detailValue}>{education.name}</p>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>
                    <img 
                      src="/images/education/icons/calendar-clock.svg" 
                      alt="교육 일자" 
                      className={styles.detailIconImage}
                    />
                    <span className={styles.detailIcon}>교육 일자</span>
                  </div>
                  <p className={styles.detailValue}>
                    {formatEducationDates(education.educationDates)}
                  </p>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>
                    <img 
                      src="/images/education/icons/icon_16.svg" 
                      alt="교육 시간" 
                      className={styles.detailIconImage}
                    />
                    <span className={styles.detailIcon}>교육 시간</span>
                  </div>
                  <p className={styles.detailValue}>
                    {education.educationTimeSlots.join(', ')}
                  </p>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailLabel}>
                    <img 
                      src="/images/education/icons/marker.svg" 
                      alt="교육 장소" 
                      className={styles.detailIconImage}
                    />
                    <span className={styles.detailIcon}>교육 장소</span>
                  </div>
                  <p className={styles.detailValue}>{education.location}</p>
                </div>
              </div>

              {education.otherInfo && (
                <div className={styles.otherInfo}>
                  <p>{education.otherInfo}</p>
                </div>
              )}

              <div className={styles.dateSelector}>
                <div className={styles.dateInput}>
                  <img 
                    src="/images/education/icons/Group 1321315006.svg" 
                    alt="날짜 선택" 
                    className={styles.dateIcon}
                  />
                  <p>
                    {selectedDate || '참여 날짜 선택'}
                  </p>
                </div>
                <button 
                  className={styles.dateButton}
                  onClick={() => setIsDatePickerOpen(true)}
                >
                  날짜 선택
                </button>
              </div>

              <div className={styles.price}>
                <p>0원</p>
              </div>

              <button 
                className={styles.applyButton}
                onClick={() => setIsApplicationModalOpen(true)}
              >
                신청하기
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <DatePickerModal
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onConfirm={(date) => setSelectedDate(date)}
        availableDates={education.educationDates}
      />

      {education && (
        <ApplicationModal
          isOpen={isApplicationModalOpen}
          onClose={() => setIsApplicationModalOpen(false)}
          education={education}
          initialDate={selectedDate}
          onSuccess={() => {
            // 신청 성공 후 처리
            alert('신청이 완료되었습니다.');
          }}
        />
      )}
    </div>
  );
};

export default EducationDetailPage;

