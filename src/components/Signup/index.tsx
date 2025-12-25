import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/Footer';

type StepType = 1 | 2 | 3;
type MemberType = 'general' | 'taxAccountant' | 'other';

const CARRIER_OPTIONS = ['통신사 선택', 'SKT', 'KT', 'LG U+', '알뜰폰'];

interface TermsState {
  all: boolean;
  terms: boolean;
  privacy: boolean;
  marketing: boolean;
}

const DOMAIN_OPTIONS = [
  'naver.com',
  'google.com',
  'daum.net',
  'nate.com',
  '직접 입력',
];

const Signup: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [step, setStep] = useState<StepType>(1);
  const [terms, setTerms] = useState<TermsState>({
    all: false,
    terms: false,
    privacy: false,
    marketing: false,
  });
  const [memberType, setMemberType] = useState<MemberType>('general');
  const [userId, setUserId] = useState('');
  const [isUserIdChecked, setIsUserIdChecked] = useState(false);
  const [isUserIdAvailable, setIsUserIdAvailable] = useState(false);
  const [name, setName] = useState('');
  const [emailLocal, setEmailLocal] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [isDomainDropdownOpen, setIsDomainDropdownOpen] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [carrier, setCarrier] = useState('');
  const [isCarrierDropdownOpen, setIsCarrierDropdownOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      setIsTimerActive(false);
      setError('인증 시간이 만료되었습니다.');
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAllAgree = () => {
    const newValue = !terms.all;
    setTerms({ all: newValue, terms: newValue, privacy: newValue, marketing: newValue });
  };

  const handleTermChange = (key: keyof Omit<TermsState, 'all'>) => {
    const newTerms = { ...terms, [key]: !terms[key] };
    newTerms.all = newTerms.terms && newTerms.privacy && newTerms.marketing;
    setTerms(newTerms);
  };

  const isRequiredTermsAgreed = terms.terms && terms.privacy;

  const handleStep1Submit = () => {
    if (!isRequiredTermsAgreed) {
      setError('필수 약관에 동의해주세요.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleCheckUserId = useCallback(() => {
    if (!userId) {
      setError('아이디를 입력해주세요.');
      return;
    }
    setIsUserIdChecked(true);
    setIsUserIdAvailable(true);
    setError('');
  }, [userId]);

  const handleRequestVerification = useCallback(() => {
    if (!phone) {
      setError('휴대폰 번호를 입력해주세요.');
      return;
    }
    setTimeLeft(300);
    setIsTimerActive(true);
    setError('');
  }, [phone]);

  const handleVerifyCode = useCallback(() => {
    if (!verificationCode) {
      setError('인증번호를 입력해주세요.');
      return;
    }
    if (verificationCode === '123456') {
      setIsPhoneVerified(true);
      setIsTimerActive(false);
      setError('');
    } else {
      setError('인증번호가 올바르지 않습니다.');
    }
  }, [verificationCode]);

  const handleDomainSelect = (domain: string) => {
    if (domain === '직접 입력') {
      setEmailDomain('');
    } else {
      setEmailDomain(domain);
    }
    setIsDomainDropdownOpen(false);
  };

  const passwordRequirements = {
    length: password.length >= 8 && password.length <= 16,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
  const isPasswordMatch = password === passwordConfirm && passwordConfirm !== '';
  const fullEmail = emailLocal && emailDomain ? `${emailLocal}@${emailDomain}` : '';

  const isStep2Valid = isUserIdChecked && isUserIdAvailable && name && fullEmail && isPhoneVerified && isPasswordValid && isPasswordMatch;

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStep2Valid) {
      setError('모든 필드를 올바르게 입력해주세요.');
      return;
    }
    setError('');
    setStep(3);
  };

  const renderStepIndicator = () => (
    <div className="signup-step-indicator">
      <div className={`signup-step-item ${step === 1 ? 'is-active' : ''} ${step > 1 ? 'is-completed' : ''}`}>
        <div className="signup-step-circle" />
        <span className="signup-step-number">STEP 01</span>
        <span className="signup-step-label">약관동의</span>
      </div>
      <div className="signup-step-divider" />
      <div className={`signup-step-item ${step === 2 ? 'is-active' : ''} ${step > 2 ? 'is-completed' : ''}`}>
        <div className="signup-step-circle" />
        <span className="signup-step-number">STEP 02</span>
        <span className="signup-step-label">정보입력</span>
      </div>
      <div className="signup-step-divider" />
      <div className={`signup-step-item ${step === 3 ? 'is-active' : ''}`}>
        <div className="signup-step-circle" />
        <span className="signup-step-number">STEP 03</span>
        <span className="signup-step-label">가입완료</span>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <>
      <div className="auth-form-container">
        <div className="signup-terms-container">
          <div className="signup-all-agree-wrapper">
            <label className="auth-checkbox-label is-all-agree" onClick={handleAllAgree}>
              <input type="checkbox" className="auth-checkbox-input" checked={terms.all} readOnly />
              <span className={`auth-checkbox-icon ${terms.all ? 'is-checked' : ''}`} />
              모두 동의 (선택 정보 포함)
            </label>
          </div>
          <div className="signup-terms-list">
            <div className="signup-term-item-wrapper">
              <label className="auth-checkbox-label" onClick={() => handleTermChange('privacy')}>
                <input type="checkbox" className="auth-checkbox-input" checked={terms.privacy} readOnly />
                <span className={`auth-checkbox-icon ${terms.privacy ? 'is-checked' : ''}`} />
                [필수] 개인정보 처리 방침 이용 동의
              </label>
              <button type="button" className="signup-view-detail-button">보기</button>
            </div>
            <div className="signup-term-item-wrapper">
              <label className="auth-checkbox-label" onClick={() => handleTermChange('terms')}>
                <input type="checkbox" className="auth-checkbox-input" checked={terms.terms} readOnly />
                <span className={`auth-checkbox-icon ${terms.terms ? 'is-checked' : ''}`} />
                [필수] OO OOOOO 이용 동의
              </label>
              <button type="button" className="signup-view-detail-button">보기</button>
            </div>
            <div className="signup-term-item-wrapper">
              <label className="auth-checkbox-label" onClick={() => handleTermChange('marketing')}>
                <input type="checkbox" className="auth-checkbox-input" checked={terms.marketing} readOnly />
                <span className={`auth-checkbox-icon ${terms.marketing ? 'is-checked' : ''}`} />
                [선택] OO OOOOO 이용 동의
              </label>
              <button type="button" className="signup-view-detail-button">보기</button>
            </div>
          </div>
          {error && <p className="auth-error-message">{error}</p>}
        </div>
      </div>
      <button type="button" className={`auth-submit-button ${!isRequiredTermsAgreed ? 'is-disabled' : ''}`} onClick={handleStep1Submit}>
        다음
        <span className="auth-arrow-icon" />
      </button>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="auth-form-container">
        <form className="auth-form" onSubmit={handleStep2Submit}>
          <div className="auth-input-group">
            <label className="auth-input-label">회원 유형 <span className="auth-required-mark">*</span></label>
            <div className="signup-member-type-group">
              {(['general', 'taxAccountant', 'other'] as MemberType[]).map((type) => (
                <button key={type} type="button" className={`signup-member-type-button ${memberType === type ? 'is-selected' : ''}`} onClick={() => setMemberType(type)}>
                  <span className={`signup-member-type-radio ${memberType === type ? 'is-selected' : ''}`} />
                  {type === 'general' ? '일반 회원' : type === 'taxAccountant' ? '세무사' : '기타'}
                </button>
              ))}
            </div>
          </div>

          <div className="auth-input-group">
            <label className="auth-input-label">아이디<span className="auth-required-mark">*</span></label>
            <div className="auth-input-with-button">
              <div className="auth-input-flex">
                <div className="auth-input-wrapper">
                  <input type="text" className="auth-input" placeholder="아이디를 입력해주세요" value={userId} onChange={(e) => { setUserId(e.target.value); setIsUserIdChecked(false); }} />
                  {userId && <button type="button" className="auth-clear-button" onClick={() => setUserId('')}><span className="auth-clear-icon" /></button>}
                </div>
              </div>
              <button type="button" className="auth-verification-button" onClick={handleCheckUserId}>중복 확인</button>
            </div>
            {isUserIdChecked && isUserIdAvailable && <p className="auth-success-message">사용 가능한 아이디입니다.</p>}
          </div>

          <div className="auth-input-group">
            <label className="auth-input-label">이름<span className="auth-required-mark">*</span></label>
            <div className="auth-input-wrapper">
              <input type="text" className="auth-input" placeholder="이름을 입력해주세요" value={name} onChange={(e) => setName(e.target.value)} />
              {name && <button type="button" className="auth-clear-button" onClick={() => setName('')}><span className="auth-clear-icon" /></button>}
            </div>
          </div>

          <div className="auth-input-group">
            <label className="auth-input-label">이메일<span className="auth-required-mark">*</span></label>
            <div className="signup-email-input-group">
              <div className="signup-email-input-wrapper">
                <input type="text" className="auth-input" style={{ padding: '12px 0' }} placeholder="이메일" value={emailLocal} onChange={(e) => setEmailLocal(e.target.value)} />
              </div>
              <span className="signup-at-sign">@</span>
              <div className="signup-email-domain-wrapper">
                <span className="signup-email-domain-text">{emailDomain}</span>
              </div>
              <div className="signup-domain-select-wrapper">
                <button type="button" className="signup-domain-select" onClick={() => setIsDomainDropdownOpen(!isDomainDropdownOpen)}>
                  직접 입력
                  <span className={`signup-select-arrow ${isDomainDropdownOpen ? 'is-open' : ''}`} />
                </button>
                {isDomainDropdownOpen && (
                  <div className="signup-domain-dropdown">
                    {DOMAIN_OPTIONS.map((domain) => (
                      <button key={domain} type="button" className="signup-domain-option" onClick={() => handleDomainSelect(domain)}>{domain}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="signup-newsletter-wrapper">
              <label className="auth-checkbox-label" onClick={() => setNewsletter(!newsletter)}>
                <input type="checkbox" className="auth-checkbox-input" checked={newsletter} readOnly />
                <span className={`auth-checkbox-icon ${newsletter ? 'is-checked' : ''}`} />
                뉴스레터 신청
              </label>
            </div>
          </div>

          <div className="auth-input-group">
            <label className="auth-input-label">휴대폰 번호<span className="auth-required-mark">*</span></label>
            <div className="signup-phone-input-group">
              <div className="signup-carrier-select-wrapper">
                <button type="button" className="signup-carrier-select" onClick={() => setIsCarrierDropdownOpen(!isCarrierDropdownOpen)}>
                  {carrier || '통신사 선택'}
                  <span className={`signup-select-arrow ${isCarrierDropdownOpen ? 'is-open' : ''}`} />
                </button>
                {isCarrierDropdownOpen && (
                  <div className="signup-carrier-dropdown">
                    {CARRIER_OPTIONS.filter(c => c !== '통신사 선택').map((c) => (
                      <button key={c} type="button" className="signup-domain-option" onClick={() => { setCarrier(c); setIsCarrierDropdownOpen(false); }}>{c}</button>
                    ))}
                  </div>
                )}
              </div>
              <div className="signup-phone-input-wrapper">
                <input type="tel" className="auth-input" placeholder="휴대폰 번호를 입력해주세요" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={isPhoneVerified} />
                {phone && !isPhoneVerified && <button type="button" className="auth-clear-button" onClick={() => setPhone('')}><span className="auth-clear-icon" /></button>}
              </div>
              <button type="button" className={`auth-verification-button ${isPhoneVerified ? 'is-disabled' : ''}`} onClick={handleRequestVerification}>{isTimerActive ? '재요청' : '인증 요청'}</button>
            </div>
          </div>

          {isTimerActive && !isPhoneVerified && (
            <div className="auth-input-group">
              <label className="auth-verification-label">인증번호</label>
              <div className="auth-input-with-button">
                <div className="auth-input-flex">
                  <div className={`auth-verification-code-wrapper ${verificationCode ? 'is-active' : ''}`}>
                    <input type="text" className="auth-verification-code-input" placeholder="인증번호를 입력해주세요" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} maxLength={6} />
                    <div className="auth-input-actions">
                      {verificationCode && <button type="button" className="auth-clear-button" onClick={() => setVerificationCode('')}><span className="auth-clear-icon" /></button>}
                      {isTimerActive && timeLeft > 0 && <span className="auth-timer">{formatTime(timeLeft)}</span>}
                    </div>
                  </div>
                </div>
                <button type="button" className="auth-verification-button" onClick={handleVerifyCode}>확인</button>
              </div>
            </div>
          )}
          {isPhoneVerified && <p className="auth-success-message">휴대폰 인증이 완료되었습니다.</p>}

          <div className="auth-input-group">
            <label className="auth-input-label">비밀번호<span className="auth-required-mark">*</span></label>
            <div className="auth-input-wrapper">
              <input type="password" className="auth-input" placeholder="비밀번호를 입력해주세요" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>

          <div className="auth-input-group">
            <label className="auth-input-label">비밀번호 확인<span className="auth-required-mark">*</span></label>
            <div className="auth-input-wrapper">
              <input type="password" className="auth-input" placeholder="비밀번호를 다시 입력해주세요" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
            </div>
          </div>

          {error && <p className="auth-error-message">{error}</p>}
        </form>
      </div>

      <div className="signup-step2-button-group">
        <button type="button" className="signup-prev-button" onClick={() => setStep(1)}>
          <span className="signup-prev-arrow-icon" />
          이전
        </button>
        <button type="submit" className={`signup-next-button ${!isStep2Valid ? 'is-disabled' : ''}`} onClick={handleStep2Submit}>
          다음
          <span className="auth-arrow-icon" />
        </button>
      </div>
    </>
  );

  const renderStep3 = () => (
    <div className="signup-completion-section">
      <div className="signup-completion-icon" />
      <h2 className="signup-completion-title">회원가입이 완료되었습니다!</h2>
      <p className="signup-completion-message">{name}님, 환영합니다.<br />이제 모든 서비스를 이용하실 수 있습니다.</p>
      <div className="auth-button-group">
        <button type="button" className="auth-secondary-button" onClick={() => router.push('/')}>홈으로</button>
        <button type="button" className="auth-primary-button" onClick={() => router.push('/login')}>로그인</button>
      </div>
    </div>
  );

  return (
    <div className="auth-page-container">
      <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} />
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <section className="auth-content-section">
        <h1 className="auth-page-title">SIGN UP</h1>
        {renderStepIndicator()}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </section>
      <Footer />
    </div>
  );
};

export default Signup;
