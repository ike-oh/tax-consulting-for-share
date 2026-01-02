import React from 'react';
import Link from 'next/link';
// styles는 _app.tsx에서 import됨

export type FooterVariant = 'web' | 'mobile';

export interface FooterLink {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface FooterProps {
  /** 푸터 변형 (웹/모바일) */
  variant?: FooterVariant;
  /** 로고 이미지 경로 */
  logoSrc?: string;
  /** 패밀리 사이트 클릭 핸들러 */
  onFamilySiteClick?: () => void;
  /** 네비게이션 링크 */
  navLinks?: FooterLink[];
  /** 약관 링크 */
  termsLinks?: FooterLink[];
  /** 저작권 텍스트 */
  copyright?: string;
  /** TOP 버튼 클릭 핸들러 */
  onTopClick?: () => void;
  /** 클래스명 */
  className?: string;
}

// Arrow Right Icon (for button)
const ArrowRightIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="footer__arrow-icon"
  >
    <path
      d="M3.75 12L20.25 12"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.5 5.25L20.25 12L13.5 18.75"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Arrow Up Icon (for TOP button)
const ArrowUpIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="footer__top-icon"
  >
    <path
      d="M3.125 10L16.875 10"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.25 4.375L16.875 10L11.25 15.625"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="rotate(-90 10 10)"
    />
  </svg>
);

const defaultNavLinks: FooterLink[] = [
  { label: '업무분야', href: '/business-areas/hierarchical' },
  { label: '전문가 소개', href: '/experts' },
  { label: '교육/세미나', href: '/education' },
  { label: '함께소개', href: '/history?tab=intro' },
  { label: '인사이트', href: '/insights' },
];

const defaultTermsLinks: FooterLink[] = [
  { label: '서비스이용약관', href: '/terms' },
  { label: '개인정보처리방침', href: '/privacy' },
];

/**
 * Footer 컴포넌트
 * 웹사이트 푸터
 */
const Footer: React.FC<FooterProps> = ({
  variant = 'web',
  logoSrc = '/images/common/logos/logo-footer.png',
  onFamilySiteClick,
  navLinks = defaultNavLinks,
  termsLinks = defaultTermsLinks,
  copyright = '2025 TAX ACCOUNTING TOGETHER all rights reserved.',
  onTopClick,
  className = '',
}) => {
  const isWeb = variant === 'web';
  const isMobile = variant === 'mobile';

  const handleTopClick = () => {
    if (onTopClick) {
      onTopClick();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className={`footer footer--${variant} ${className}`}>
      <div className="footer__container">
        <div className="footer__content">
          {/* Row 1: Logo + Family Site button */}
          <div className="footer__row footer__row--top">
            <div className="footer__logo-wrapper">
              <img
                src={isMobile ? '/images/common/logos/logo-footer-mobile.png' : logoSrc}
                alt="MODOO CONSULTING"
                className="footer__logo"
              />
            </div>

            <div className="footer__family-site-wrapper">
              <button
                type="button"
                className="footer__family-site-btn"
                onClick={onFamilySiteClick}
              >
                <span>패밀리 사이트</span>
                <ArrowRightIcon />
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="footer__divider" />

          {/* Row 2: Terms links (left) + Nav links (right) */}
          <div className="footer__row footer__row--middle">
            <div className="footer__terms">
              {termsLinks.map((link, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span className="footer__terms-divider">|</span>}
                  {link.onClick ? (
                    <a href={link.href} className="footer__terms-link" onClick={link.onClick}>
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href || '#'} className="footer__terms-link">
                      {link.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </div>

            <nav className="footer__nav">
              {navLinks.map((link, index) => {
                if (link.onClick) {
                  return (
                    <a
                      key={index}
                      href={link.href}
                      className="footer__nav-link"
                      onClick={link.onClick}
                    >
                      {link.label}
                    </a>
                  );
                }
                return (
                  <Link
                    key={index}
                    href={link.href || '#'}
                    className="footer__nav-link"
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Row 3: Copyright */}
          <div className="footer__row footer__row--bottom">
            <p className="footer__copyright">{copyright}</p>

            {isMobile && (
              <button
                type="button"
                className="footer__top-btn"
                onClick={handleTopClick}
              >
                <span>TOP</span>
                <ArrowUpIcon />
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
