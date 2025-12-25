import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MENU_ITEMS = [
  {
    id: 'services',
    title: '업무분야',
    subItems: ['업종별', '분야별']
  },
  {
    id: 'experts',
    title: '전문가 소개',
    subItems: ['대표 세무사', '구성원']
  },
  {
    id: 'education',
    title: '교육/세미나',
    subItems: ['온라인 교육', '오프라인 세미나']
  },
  {
    id: 'about',
    title: '함께소개',
    subItems: ['소개', '연혁', '수상/인증', '본점/지점 안내', '주요 고객', 'CI가이드']
  },
  {
    id: 'insight',
    title: '인사이트',
    subItems: ['세무 뉴스', '칼럼']
  },
];

const Menu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<string>('services');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen && !hasBeenOpened) {
      setHasBeenOpened(true);
    }
  }, [isOpen, hasBeenOpened]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 500);
  };

  const handleLoginClick = () => {
    handleClose();
    setTimeout(() => router.push('/login'), 500);
  };

  const handleSignupClick = () => {
    handleClose();
    setTimeout(() => router.push('/signup'), 500);
  };

  const handleItemClick = (id: string) => {
    setSelectedItem(id);
  };

  const currentSubItems = MENU_ITEMS.find(item => item.id === selectedItem)?.subItems || [];

  const wrapperClass = `menu-wrapper ${hasBeenOpened || isOpen ? 'is-visible' : ''}`;
  const overlayClass = `menu-overlay ${isOpen && !isClosing ? 'is-open' : ''} ${isClosing ? 'is-closing' : ''}`;
  const containerClass = `menu-container ${isOpen && !isClosing ? 'is-open' : ''} ${isClosing ? 'is-closing' : ''}`;

  return (
    <div className={wrapperClass}>
      <div className={overlayClass} onClick={handleClose} />
      <nav className={containerClass}>
        <div className="menu-header">
          <div className="auth-links">
            <button className="auth-link" onClick={handleLoginClick}>로그인</button>
            <span className="auth-divider" />
            <button className="auth-link" onClick={handleSignupClick}>회원가입</button>
          </div>
          <button className="close-button" onClick={handleClose}>
            <div className="close-icon">
              <span />
              <span />
            </div>
          </button>
        </div>

        <div className="menu-content">
          <ul className="menu-list">
            {MENU_ITEMS.map((item) => (
              <li
                key={item.id}
                className={`menu-item ${selectedItem === item.id ? 'is-selected' : ''} ${hoveredItem === item.id ? 'is-hovered' : ''}`}
                onClick={() => handleItemClick(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <h2 className="menu-title">{item.title}</h2>
                <div className={`menu-underline ${selectedItem === item.id ? 'is-visible' : ''}`} />
              </li>
            ))}
          </ul>

          <ul className="sub-menu-list">
            {currentSubItems.map((subItem, index) => (
              <li key={index} className="sub-menu-item">
                {subItem}
              </li>
            ))}
          </ul>
        </div>

        <div className="menu-footer">
          <button className="footer-button">구성원신청</button>
        </div>
      </nav>
    </div>
  );
};

export default Menu;
