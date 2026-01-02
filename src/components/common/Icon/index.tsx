import React from 'react';
// styles는 _app.tsx에서 import됨

export type IconSize = 16 | 20 | 24 | 40 | 48;

export type IconType =
  // Check icons
  | 'check'
  | 'check-gray'
  | 'check-white'
  | 'check-blue'
  | 'check-gray-light'
  // Close icons
  | 'close'
  | 'close-white'
  | 'circle-close'
  // Search
  | 'search'
  // User icons
  | 'user'
  | 'user-white'
  // Arrows (chevron style)
  | 'arrow-up'
  | 'arrow-up-white'
  | 'arrow-down'
  | 'arrow-down-white'
  | 'arrow-right'
  | 'arrow-right-gray'
  | 'arrow-right-white'
  | 'arrow-left'
  | 'arrow-left-gray'
  | 'arrow-left-white'
  // Chevron (dropdown style)
  | 'chevron-down'
  | 'chevron-down-white'
  // Arrow with line (navigation)
  | 'arrow-left2-green'
  | 'arrow-left2-gray'
  | 'arrow-left2-white'
  | 'arrow-right2-green'
  | 'arrow-right2-gray'
  | 'arrow-right2-white'
  // Plus & Minus
  | 'plus'
  | 'plus-gray'
  | 'minus'
  | 'minus-gray'
  // Document & Write
  | 'document'
  // Eye
  | 'eye'
  | 'eye-white'
  // List
  | 'list-white'
  | 'list-green'
  // Info/Status
  | 'info'
  | 'info-gray'
  | 'error'
  | 'error-white'
  // Contact/Location
  | 'call'
  | 'location'
  | 'mail'
  | 'map'
  | 'map-green'
  | 'calendar'
  | 'calendar-white'
  // Large icons (40px)
  | 'menu'
  | 'menu-white'
  | 'add'
  | 'add-white'
  | 'close-large'
  | 'close-large-white';

export interface IconProps {
  type: IconType;
  size?: IconSize;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const Icon: React.FC<IconProps> = ({ type, size = 24, className = '', onClick, style }) => {
  // 40px 아이콘들
  const is40pxIcon = ['menu', 'menu-white', 'add', 'add-white', 'close-large', 'close-large-white'].includes(type);
  // 16px 전용 아이콘들
  const is16pxIcon = ['info', 'info-gray', 'error', 'map', 'map-green', 'calendar'].includes(type);
  // 20px 전용 아이콘들
  const is20pxIcon = ['arrow-up', 'arrow-up-white', 'arrow-down', 'arrow-down-white', 'arrow-right', 'arrow-right-gray', 'arrow-left', 'arrow-left-gray', 'chevron-down', 'chevron-down-white', 'check', 'check-gray', 'check-white', 'check-blue', 'check-gray-light', 'plus', 'plus-gray', 'minus', 'minus-gray', 'call', 'location', 'mail', 'document', 'error-white', 'search'].includes(type);
  // 24px 전용 아이콘들 (arrow-right2 시리즈)
  const is24pxIcon = ['arrow-right2-gray', 'arrow-right2-white', 'arrow-right2-green', 'arrow-left2-gray', 'arrow-left2-white', 'arrow-left2-green'].includes(type);

  const getViewBox = () => {
    if (is40pxIcon) return '0 0 40 40';
    if (is24pxIcon) return '0 0 24 24';
    if (is16pxIcon) return '0 0 16 16';
    if (is20pxIcon) return '0 0 20 20';
    return '0 0 20 20';
  };

  const renderIcon = () => {
    switch (type) {
      // Check icons (20px viewBox)
      case 'check':
        return (
          <path d="M15.8869 5.99998L8.62897 13.2577L5 9.62885" stroke="#151515" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        );
      case 'check-gray':
        return (
          <path d="M15.8869 5.99998L8.62897 13.2577L5 9.62885" stroke="#8E8E8E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        );
      case 'check-white':
        return (
          <path d="M15.8869 5.99998L8.62897 13.2577L5 9.62885" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        );
      case 'check-blue':
        return (
          <path d="M15.8869 6L8.62897 13.2577L5 9.62886" stroke="#94B9E3" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        );
      case 'check-gray-light':
        return (
          <path d="M15.8869 5.99999L8.62897 13.2577L5 9.62885" stroke="#717171" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        );

      // Close icons
      case 'close':
        return (
          <>
            <path d="M11.6499 0.649994L1.0794 11.2205" stroke="#2D2D2D" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M0.649902 0.649994L11.2204 11.2205" stroke="#2D2D2D" strokeWidth="1.3" strokeLinecap="round"/>
          </>
        );
      case 'close-white':
        return (
          <>
            <path d="M11.6499 0.649994L1.0794 11.2205" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M0.649902 0.649994L11.2204 11.2205" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
          </>
        );
      case 'circle-close':
        return (
          <>
            <circle cx="9" cy="9" r="9" fill="#555555"/>
            <path d="M6.41016 11.69L11.6902 6.41003" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
            <path d="M6.40945 6.41003L11.6895 11.69" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
          </>
        );

      // Search (20px viewBox)
      case 'search':
        return (
          <>
            <path d="M6.58325 12.5002C9.85098 12.5002 12.5 9.85116 12.5 6.58343C12.5 3.3157 9.85098 0.666687 6.58325 0.666687C3.31552 0.666687 0.666504 3.3157 0.666504 6.58343C0.666504 9.85116 3.31552 12.5002 6.58325 12.5002Z" stroke="#151515" strokeWidth="1.33333" strokeMiterlimit="10" fill="none"/>
            <path d="M15.2093 15.2868C15.4697 15.5471 15.8918 15.5471 16.1521 15.2868C16.4125 15.0264 16.4125 14.6043 16.1521 14.344L15.6807 14.8154L15.2093 15.2868ZM10.9253 10.0599L10.4539 10.5313L15.2093 15.2868L15.6807 14.8154L16.1521 14.344L11.3967 9.58853L10.9253 10.0599Z" fill="#151515"/>
          </>
        );

      // User icons
      case 'user':
        return (
          <>
            <path d="M6.69008 5.112C7.93604 5.112 8.94608 4.10195 8.94608 2.856C8.94608 1.61005 7.93604 0.599998 6.69008 0.599998C5.44413 0.599998 4.43408 1.61005 4.43408 2.856C4.43408 4.10195 5.44413 5.112 6.69008 5.112Z" stroke="#2D2D2D" strokeWidth="1.2" strokeLinejoin="bevel" fill="none"/>
            <path d="M12.7729 10.3056V9.56959C12.7729 7.94719 11.4449 6.61919 9.8225 6.61919H3.5505C1.9281 6.61919 0.600098 7.94719 0.600098 9.56959V10.3056" stroke="#2D2D2D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="bevel" fill="none"/>
          </>
        );
      case 'user-white':
        return (
          <>
            <path d="M8.25994 6.29003C9.81738 6.29003 11.0799 5.02747 11.0799 3.47003C11.0799 1.91258 9.81738 0.650024 8.25994 0.650024C6.7025 0.650024 5.43994 1.91258 5.43994 3.47003C5.43994 5.02747 6.7025 6.29003 8.25994 6.29003Z" stroke="white" strokeWidth="1.3" strokeLinejoin="bevel" fill="none"/>
            <path d="M15.8659 12.7824V11.8624C15.8659 9.83444 14.2059 8.17444 12.1779 8.17444H4.3379C2.3099 8.17444 0.649902 9.83444 0.649902 11.8624V12.7824" stroke="white" strokeWidth="1.3" strokeLinejoin="bevel" fill="none"/>
          </>
        );

      // Arrow up/down (20px viewBox)
      case 'arrow-up':
        return <path d="M15 13L10 7.5L5 13" stroke="#555555" strokeWidth="1.3" strokeLinecap="round" fill="none"/>;
      case 'arrow-up-white':
        return <path d="M15 13L10 7.5L5 13" stroke="white" strokeWidth="1.3" strokeLinecap="round" fill="none"/>;
      case 'arrow-down':
        return <path d="M5 7.5L10 13L15 7.5" stroke="#555555" strokeWidth="1.3" strokeLinecap="round" fill="none"/>;
      case 'arrow-down-white':
        return <path d="M5 7.5L10 13L15 7.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" fill="none"/>;

      // Arrow left/right (20px viewBox)
      case 'arrow-right':
        return <path d="M7.25 15.25L12.75 10.25L7.25 5.25" stroke="#555555" strokeWidth="1.3" strokeLinecap="round" fill="none"/>;
      case 'arrow-right-gray':
        return <path d="M7.25 15.25L12.75 10.25L7.25 5.25" stroke="#BEBEC7" strokeWidth="1.3" strokeLinecap="round" fill="none"/>;
      case 'arrow-right-white':
        return <path d="M7.25 15.25L12.75 10.25L7.25 5.25" stroke="white" strokeWidth="1.3" strokeLinecap="round" fill="none"/>;
      case 'arrow-left':
        return <path d="M12.75 15.25L7.25 10.25L12.75 5.25" stroke="#555555" strokeWidth="1.3" strokeLinecap="round" fill="none"/>;
      case 'arrow-left-gray':
        return <path d="M12.75 15.25L7.25 10.25L12.75 5.25" stroke="#BEBEC7" strokeWidth="1.3" strokeLinecap="round" fill="none"/>;
      case 'arrow-left-white':
        return <path d="M12.75 15.25L7.25 10.25L12.75 5.25" stroke="white" strokeWidth="1.3" strokeLinecap="round" fill="none"/>;

      // Chevron (dropdown style) - 20px viewBox
      case 'chevron-down':
        return <path d="M5 7.5L10 12.5L15 7.5" stroke="#94B9E3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>;
      case 'chevron-down-white':
        return <path d="M5 7.5L10 12.5L15 7.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>;

      // Arrow with line (navigation arrows)
      case 'arrow-left2-white':
        return (
          <>
            <path d="M20.25 12L3.75 12" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.5 5.25L3.75 12L10.5 18.75" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </>
        );
      case 'arrow-left2-gray':
        return (
          <>
            <path d="M20.25 12L3.75 12" stroke="#8E8E8E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.5 5.25L3.75 12L10.5 18.75" stroke="#8E8E8E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </>
        );
      case 'arrow-left2-green':
        return (
          <>
            <path d="M20.25 12L3.75 12" stroke="#006462" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.5 5.25L3.75 12L10.5 18.75" stroke="#006462" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </>
        );
      case 'arrow-right2-white':
        return (
          <>
            <path d="M3.75 12L20.25 12" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.5 5.25L20.25 12L13.5 18.75" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </>
        );
      case 'arrow-right2-gray':
        return (
          <>
            <path d="M3.75 12L20.25 12" stroke="#8E8E8E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.5 5.25L20.25 12L13.5 18.75" stroke="#8E8E8E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </>
        );
      case 'arrow-right2-green':
        return (
          <>
            <path d="M3.75 12L20.25 12" stroke="#006462" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.5 5.25L20.25 12L13.5 18.75" stroke="#006462" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </>
        );

      // Plus/Minus (20px viewBox)
      case 'plus':
        return (
          <>
            <path d="M15.48 10L4.91998 10" stroke="#2D2D2D" strokeWidth="1.2" strokeLinecap="round"/>
            <path d="M10.2007 4.72L10.2007 15.28" stroke="#2D2D2D" strokeWidth="1.2" strokeLinecap="round"/>
          </>
        );
      case 'plus-gray':
        return (
          <>
            <path d="M15.48 10L4.91998 10" stroke="#BEBEC7" strokeWidth="1.2" strokeLinecap="round"/>
            <path d="M10.2007 4.72L10.2007 15.28" stroke="#BEBEC7" strokeWidth="1.2" strokeLinecap="round"/>
          </>
        );
      case 'minus':
        return <path d="M15.48 10L4.91998 10" stroke="#2D2D2D" strokeWidth="1.2" strokeLinecap="round"/>;
      case 'minus-gray':
        return <path d="M15.48 10L4.91998 10" stroke="#BEBEC7" strokeWidth="1.2" strokeLinecap="round"/>;

      // Document (20px viewBox)
      case 'document':
        return (
          <path d="M16.3333 6.16667V6C16.3333 4.59987 16.3333 3.8998 16.0608 3.36502C15.8212 2.89462 15.4387 2.51217 14.9683 2.27248C14.4335 2 13.7335 2 12.3333 2H7C5.59987 2 4.8998 2 4.36502 2.27248C3.89462 2.51217 3.51217 2.89462 3.27248 3.36502C3 3.8998 3 4.59987 3 6V14.6667C3 16.0668 3 16.7669 3.27248 17.3016C3.51217 17.772 3.89462 18.1545 4.36502 18.3942C4.8998 18.6667 5.59987 18.6667 7 18.6667H10.0833M10.0833 9.5H6.33333M9.25 12.8333H6.33333M13 6.16667H6.33333M14.6667 15.3333V10.75C14.6667 10.0596 15.2263 9.5 15.9167 9.5C16.607 9.5 17.1667 10.0596 17.1667 10.75V15.3333C17.1667 16.714 16.0474 17.8333 14.6667 17.8333C13.286 17.8333 12.1667 16.714 12.1667 15.3333V12" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        );

      // Eye icons
      case 'eye':
      case 'eye-white':
        return (
          <>
            <path d="M15.8335 5.83331C15.8335 6.83331 12.4752 10.8333 8.3335 10.8333C4.19183 10.8333 0.833496 6.83331 0.833496 5.83331C0.833496 4.83331 4.19183 0.833313 8.3335 0.833313C12.4752 0.833313 15.8335 4.83331 15.8335 5.83331Z" stroke="white" strokeWidth="1.66667" fill="none"/>
            <path d="M10.8335 5.83331C10.8335 6.49635 10.5701 7.13224 10.1013 7.60108C9.63242 8.06992 8.99654 8.33331 8.3335 8.33331C7.67045 8.33331 7.03457 8.06992 6.56573 7.60108C6.09689 7.13224 5.8335 6.49635 5.8335 5.83331C5.8335 5.17027 6.09689 4.53439 6.56573 4.06555C7.03457 3.5967 7.67045 3.33331 8.3335 3.33331C8.99654 3.33331 9.63242 3.5967 10.1013 4.06555C10.5701 4.53439 10.8335 5.17027 10.8335 5.83331Z" stroke="white" strokeWidth="1.66667" fill="none"/>
          </>
        );

      // List icons
      case 'list-white':
        return (
          <>
            <path d="M0.649902 0.650024H14.6499" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M0.649902 5.65002H14.6499" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M0.649902 10.65H14.6499" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
          </>
        );
      case 'list-green':
        return (
          <>
            <path d="M0.649902 0.650024H14.6499" stroke="#006462" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M0.649902 5.65002H14.6499" stroke="#006462" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M0.649902 10.65H14.6499" stroke="#006462" strokeWidth="1.3" strokeLinecap="round"/>
          </>
        );

      // Info icons (16px viewBox)
      case 'info':
        return (
          <>
            <path d="M8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2Z" stroke="#151515" strokeMiterlimit="10" fill="none"/>
            <path d="M8 11L8 7.5" stroke="#151515" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 5.5C7.86193 5.5 7.75 5.38807 7.75 5.25C7.75 5.11193 7.86193 5 8 5C8.13807 5 8.25 5.11193 8.25 5.25C8.25 5.38807 8.13807 5.5 8 5.5Z" fill="#151515" stroke="#151515"/>
          </>
        );
      case 'info-gray':
        return (
          <>
            <path d="M8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2Z" stroke="#929299" strokeMiterlimit="10" fill="none"/>
            <path d="M8 11L8 7.5" stroke="#929299" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 5.5C7.86193 5.5 7.75 5.38807 7.75 5.25C7.75 5.11193 7.86193 5 8 5C8.13807 5 8.25 5.11193 8.25 5.25C8.25 5.38807 8.13807 5.5 8 5.5Z" fill="#929299" stroke="#929299"/>
          </>
        );

      // Error icons
      case 'error':
        return (
          <>
            <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="#F35064" strokeMiterlimit="10" fill="none"/>
            <path d="M8 5V8.5" stroke="#F35064" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 11.5C8.41421 11.5 8.75 11.1642 8.75 10.75C8.75 10.3358 8.41421 10 8 10C7.58579 10 7.25 10.3358 7.25 10.75C7.25 11.1642 7.58579 11.5 8 11.5Z" fill="#F35064"/>
          </>
        );
      case 'error-white':
        return (
          <>
            <path d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z" stroke="white" strokeWidth="1.3" strokeMiterlimit="10" fill="none"/>
            <path d="M10 6.25V10.625" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 14.375C10.5178 14.375 10.9375 13.9553 10.9375 13.4375C10.9375 12.9197 10.5178 12.5 10 12.5C9.48223 12.5 9.0625 12.9197 9.0625 13.4375C9.0625 13.9553 9.48223 14.375 10 14.375Z" fill="white"/>
          </>
        );

      // Call (20px viewBox)
      case 'call':
        return (
          <>
            <path d="M16.6669 9.16585H18.3335C18.3335 4.89085 15.106 1.66669 10.8252 1.66669V3.33335C14.2102 3.33335 16.6669 5.78585 16.6669 9.16585Z" fill="#004B4A"/>
            <path d="M10.8331 6.66666C12.5856 6.66666 13.3331 7.41416 13.3331 9.16666H14.9997C14.9997 6.47916 13.5206 5 10.8331 5V6.66666ZM13.6847 11.2025C13.5247 11.0568 13.3143 10.979 13.0979 10.9857C12.8816 10.9924 12.6763 11.083 12.5256 11.2383L10.5314 13.2892C10.0514 13.1975 9.08641 12.8967 8.09308 11.9058C7.09975 10.9117 6.79891 9.94416 6.70975 9.4675L8.75891 7.4725C8.91426 7.32177 9.00486 7.11651 9.01155 6.90017C9.01824 6.68382 8.94048 6.47336 8.79475 6.31333L5.71558 2.9275C5.56978 2.76696 5.36715 2.66958 5.15071 2.65605C4.93427 2.64251 4.72108 2.71388 4.55641 2.855L2.74808 4.40583C2.60401 4.55043 2.51801 4.74287 2.50641 4.94666C2.49391 5.155 2.25558 10.09 6.08225 13.9183C9.42058 17.2558 13.6022 17.5 14.7539 17.5C14.9222 17.5 15.0256 17.495 15.0531 17.4933C15.2567 17.4813 15.4488 17.395 15.5931 17.2508L17.1431 15.4417C17.2843 15.2771 17.3558 15.064 17.3424 14.8475C17.3291 14.6311 17.2318 14.4284 17.0714 14.2825L13.6847 11.2025Z" fill="#004B4A"/>
          </>
        );

      // Location (20px viewBox)
      case 'location':
        return (
          <path d="M10 1.83331C11.9891 1.83331 13.8968 2.62349 15.3033 4.03001C16.7098 5.43653 17.5 7.34419 17.5 9.33331C17.5 12.4383 15.1333 15.6916 10.5 19.1666C10.3558 19.2748 10.1803 19.3333 10 19.3333C9.81969 19.3333 9.64425 19.2748 9.5 19.1666C4.86667 15.6916 2.5 12.4383 2.5 9.33331C2.5 7.34419 3.29018 5.43653 4.6967 4.03001C6.10322 2.62349 8.01088 1.83331 10 1.83331ZM10 6.83331C9.33696 6.83331 8.70107 7.0967 8.23223 7.56555C7.76339 8.03439 7.5 8.67027 7.5 9.33331C7.5 9.99635 7.76339 10.6322 8.23223 11.1011C8.70107 11.5699 9.33696 11.8333 10 11.8333C10.663 11.8333 11.2989 11.5699 11.7678 11.1011C12.2366 10.6322 12.5 9.99635 12.5 9.33331C12.5 8.67027 12.2366 8.03439 11.7678 7.56555C11.2989 7.0967 10.663 6.83331 10 6.83331Z" fill="#004B4A"/>
        );

      // Mail (20px viewBox)
      case 'mail':
        return (
          <>
            <path d="M17.9611 3.33337C17.8854 3.32556 17.809 3.32556 17.7333 3.33337H2.17775C2.07805 3.3349 1.97901 3.34985 1.8833 3.37781L9.91108 11.3723L17.9611 3.33337Z" fill="#004B4A"/>
            <path d="M18.7834 4.10553L10.6945 12.1611C10.4863 12.368 10.2047 12.4842 9.91115 12.4842C9.61761 12.4842 9.336 12.368 9.12782 12.1611L1.11115 4.16664C1.08651 4.25722 1.07344 4.35056 1.07227 4.44442V15.5555C1.07227 15.8502 1.18933 16.1328 1.3977 16.3412C1.60608 16.5496 1.88869 16.6666 2.18338 16.6666H17.7389C18.0336 16.6666 18.3162 16.5496 18.5246 16.3412C18.733 16.1328 18.85 15.8502 18.85 15.5555V4.44442C18.8456 4.32867 18.8231 4.21433 18.7834 4.10553ZM2.94449 15.5555H2.17227V14.7611L6.21115 10.7555L6.99449 11.5389L2.94449 15.5555ZM17.7278 15.5555H16.95L12.9 11.5389L13.6834 10.7555L17.7223 14.7611L17.7278 15.5555Z" fill="#004B4A"/>
          </>
        );

      // Map (16px viewBox)
      case 'map':
        return (
          <path d="M6.10667 11.3867L2 13.7333V4.34665L6.10667 1.99998M6.10667 11.3867L10.2133 13.7333M6.10667 11.3867V1.99998M10.2133 13.7333L13.7333 11.3867V1.99998L10.2133 4.34665M10.2133 13.7333V4.34665M10.2133 4.34665L6.10667 1.99998" stroke="#2D2D2D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        );
      case 'map-green':
        return (
          <path d="M6.21232 11.1755L2.35205 13.3813V4.55787L6.21232 2.35201M6.21232 11.1755L10.0726 13.3813M6.21232 11.1755V2.35201M10.0726 13.3813L13.3814 11.1755V2.35201L10.0726 4.55787M10.0726 13.3813V4.55787M10.0726 4.55787L6.21232 2.35201" stroke="#6BCDC7" strokeWidth="1.128" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        );

      // Calendar (16px viewBox)
      case 'calendar':
        return (
          <>
            <path d="M2.61621 7.91778V3.14064C2.61621 2.65949 3.00626 2.26944 3.48741 2.26944H12.833C13.3142 2.26944 13.7042 2.65949 13.7042 3.14064V12.6949C13.7042 13.1761 13.3142 13.5661 12.833 13.5661H3.48762C3.00639 13.5661 2.61631 13.1759 2.61643 12.6947L2.61781 7.03946" stroke="#2D2D2D" strokeWidth="1.2" strokeMiterlimit="10" fill="none"/>
            <path d="M13.7042 5.6799H2.61621" stroke="#2D2D2D" strokeWidth="1.2" strokeMiterlimit="10"/>
            <path d="M5.61328 0.713989V3.65532" stroke="#2D2D2D" strokeWidth="1.2" strokeMiterlimit="10"/>
            <path d="M10.7041 0.713989V3.65532" stroke="#2D2D2D" strokeWidth="1.2" strokeMiterlimit="10"/>
          </>
        );
      case 'calendar-white':
        return (
          <>
            <path d="M0.714844 10.0053V3.3704C0.714844 2.70214 1.25658 2.1604 1.92484 2.1604H14.9048C15.5731 2.1604 16.1148 2.70214 16.1148 3.3704V16.6402C16.1148 17.3085 15.5731 17.8502 14.9048 17.8502H1.92514C1.25676 17.8502 0.714977 17.3083 0.715141 16.6399L0.717071 8.78543" stroke="white" strokeWidth="1.43" strokeMiterlimit="10" fill="none"/>
            <path d="M16.1148 6.89709H0.714844" stroke="white" strokeWidth="1.43" strokeMiterlimit="10"/>
            <path d="M4.87842 0V4.08519" stroke="white" strokeWidth="1.43" strokeMiterlimit="10"/>
            <path d="M11.9487 0V4.08519" stroke="white" strokeWidth="1.43" strokeMiterlimit="10"/>
          </>
        );

      // Large icons (40px viewBox)
      case 'menu':
        return (
          <>
            <path d="M7.3999 11H32.5999" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round"/>
            <path d="M7.3999 20H32.5999" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round"/>
            <path d="M7.3999 29H32.5999" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round"/>
          </>
        );
      case 'menu-white':
        return (
          <>
            <path d="M7.3999 11H32.5999" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M7.3999 20H32.5999" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M7.3999 29H32.5999" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </>
        );
      case 'add':
        return (
          <>
            <path d="M35 20L5 20" stroke="#2D2D2D" strokeWidth="1.4" strokeLinecap="round"/>
            <path d="M20 35L20 5" stroke="#2D2D2D" strokeWidth="1.4" strokeLinecap="round"/>
          </>
        );
      case 'add-white':
        return (
          <>
            <path d="M35 20L5 20" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
            <path d="M20 35L20 5" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
          </>
        );
      case 'close-large':
        return (
          <>
            <path d="M32.6001 32.6012L7.39881 7.39995" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round"/>
            <path d="M7.3999 32.6012L32.6012 7.39996" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round"/>
          </>
        );
      case 'close-large-white':
        return (
          <>
            <path d="M32.6001 32.6012L7.39881 7.39995" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M7.3999 32.6012L32.6012 7.39996" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <svg
      className={`icon icon--${size} ${className}`}
      width={size}
      height={size}
      viewBox={getViewBox()}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      style={style}
      role={onClick ? 'button' : 'img'}
      aria-label={type}
    >
      {renderIcon()}
    </svg>
  );
};

export default Icon;
