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
    subItems: ['업종별', '컨설팅']
  },
  {
    id: 'experts',
    title: '전문가 소개',
    subItems: []
  },
  {
    id: 'education',
    title: '교육/세미나',
    subItems: []
  },
  {
    id: 'about',
    title: '함께소개',
    subItems: ['소개', '연혁', '수상/인증', '본점/지점 안내', '주요 고객', 'CI가이드']
  },
  {
    id: 'insight',
    title: '인사이트',
    subItems: []
  },
];

const Menu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<string>('services');
  const [selectedSubItem, setSelectedSubItem] = useState<number | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 현재 경로에 따라 메뉴 항목 자동 선택
  useEffect(() => {
    if (isOpen) {
      const pathname = router.pathname;
      const query = router.query;
      
      // 경로에 따른 메뉴 ID 매핑
      if (pathname === '/experts') {
        setSelectedItem('experts');
        setSelectedSubItem(null);
      } else if (pathname === '/education') {
        setSelectedItem('education');
        setSelectedSubItem(null);
      } else if (pathname === '/insights' || pathname.startsWith('/insights/')) {
        setSelectedItem('insight');
        setSelectedSubItem(null);
      } else if (pathname === '/history' || pathname.startsWith('/history')) {
        setSelectedItem('about');
        // 함께소개 서브메뉴 선택
        const tabMap: { [key: string]: number } = {
          'intro': 0,      // 소개
          'history': 1,    // 연혁
          'awards': 2,     // 수상/인증
          'branches': 3,   // 본점/지점 안내
          'customers': 4,  // 주요 고객
          'ci': 5,         // CI가이드
        };
        const tab = query.tab as string;
        if (tab && tabMap[tab] !== undefined) {
          setSelectedSubItem(tabMap[tab]);
        } else {
          setSelectedSubItem(null); // 탭이 없으면 서브메뉴 선택 안함
        }
      } else if (pathname === '/business-areas/hierarchical' || pathname.startsWith('/business-areas/')) {
        setSelectedItem('services');
        // 업무분야 서브메뉴 선택
        const tab = query.tab as string;
        if (tab === 'consulting') {
          setSelectedSubItem(1); // 컨설팅
        } else {
          setSelectedSubItem(0); // 업종별 (기본값)
        }
      } else {
        // 기본값은 첫 번째 메뉴 항목
        setSelectedItem('services');
        setSelectedSubItem(null);
      }
    }
  }, [isOpen, router.pathname, router.query]);

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

  // 로그인 상태 확인
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        setIsAuthenticated(!!token);
      }
    };
    
    // 메뉴가 열릴 때마다 로그인 상태 확인
    if (isOpen) {
      checkAuth();
    }
    
    // storage 이벤트 리스너 (다른 탭에서 로그인/로그아웃 시)
    const handleStorageChange = () => {
      checkAuth();
    };
    window.addEventListener('storage', handleStorageChange);
    
    // 같은 탭에서의 변경 감지를 위한 주기적 확인
    let intervalId: NodeJS.Timeout | null = null;
    if (isOpen) {
      intervalId = setInterval(checkAuth, 500);
    }
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (intervalId) {
        clearInterval(intervalId);
      }
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

  const handleMyPageClick = () => {
    handleClose();
    setTimeout(() => router.push('/my'), 500);
  };

  const handleItemClick = (id: string) => {
    const menuItem = MENU_ITEMS.find(item => item.id === id);
    const hasSubItems = menuItem && menuItem.subItems && menuItem.subItems.length > 0;
    
    if (hasSubItems) {
      // 서브메뉴가 있는 경우 선택 상태만 변경
      setSelectedItem(id);
      setSelectedSubItem(null); // 메인 메뉴 변경 시 서브 메뉴 선택 초기화
    } else {
      // 서브메뉴가 없는 경우 즉시 페이지 이동
      handleClose();
      setSelectedSubItem(null);
      
      // 페이지 라우팅 매핑
      const routeMap: { [key: string]: string } = {
        'experts': '/experts',
        'education': '/education',
        'insight': '/insights',
      };
      
      const route = routeMap[id];
      if (route) {
        setTimeout(() => router.push(route), 500);
      }
    }
  };

  const handleSubItemClick = (subItem: string, index: number) => {
    setSelectedSubItem(index);
    handleClose();
    
    if (selectedItem === 'services') {
      // 업무분야 서브메뉴
      if (subItem === '업종별') {
        setTimeout(() => router.push('/business-areas/hierarchical'), 500);
      } else if (subItem === '컨설팅') {
        // 컨설팅 탭으로 이동 - URL에 탭 정보를 포함할 수 있도록 처리
        setTimeout(() => router.push('/business-areas/hierarchical?tab=consulting'), 500);
      }
    } else if (selectedItem === 'about') {
      // 함께소개 서브메뉴
      const tabMap: { [key: string]: string } = {
        '소개': 'intro',
        '연혁': 'history',
        '수상/인증': 'awards',
        '본점/지점 안내': 'branches',
        '주요 고객': 'customers',
        'CI가이드': 'ci',
      };
      
      const tab = tabMap[subItem];
      if (tab) {
        setTimeout(() => router.push(`/history?tab=${tab}`), 500);
      }
    }
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
          {isAuthenticated ? (
            <div className="auth-links">
              <button className="auth-link my-page-link" onClick={handleMyPageClick}>
                <img 
                  src="/images/common/user-icon-white.svg" 
                  alt="My Page" 
                  className="my-page-icon"
                />
                <span>My Page</span>
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <button className="auth-link" onClick={handleLoginClick}>로그인</button>
              <span className="auth-divider" />
              <button className="auth-link" onClick={handleSignupClick}>회원가입</button>
            </div>
          )}
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
              <li 
                key={index} 
                className={`sub-menu-item ${selectedSubItem === index ? 'is-active' : ''}`}
                onClick={() => handleSubItemClick(subItem, index)}
              >
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
