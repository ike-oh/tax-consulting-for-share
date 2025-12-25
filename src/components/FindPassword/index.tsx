import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/Footer';

type TabType = 'sms' | 'email';
type StepType = 'input' | 'smsVerification' | 'emailVerification';

const FindPassword: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('sms');
  const [step, setStep] = useState<StepType>('input');
  const [userId, setUserId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
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
      setError('인증 시간이 만료되었습니다. 다시 인증번호를 요청해주세요.');
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const clearUserId = () => setUserId('');
  const clearPhone = () => setPhone('');
  const clearEmail = () => setEmail('');
  const clearVerificationCode = () => setVerificationCode('');

  const handleRequestSmsVerification = useCallback(() => {
    setError('');
    if (!userId) { setError('아이디를 입력해주세요.'); return; }
    if (!phone) { setError('휴대폰 번호를 입력해주세요.'); return; }
    setTimeLeft(300);
    setIsTimerActive(true);
    setStep('smsVerification');
  }, [userId, phone]);

  const handleRequestEmailVerification = useCallback(() => {
    setError('');
    if (!userId) { setError('아이디를 입력해주세요.'); return; }
    if (!email) { setError('이메일을 입력해주세요.'); return; }
    setTimeLeft(300);
    setIsTimerActive(true);
    setStep('emailVerification');
  }, [userId, email]);

  const handleVerifyCode = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!verificationCode) { setError('인증번호를 입력해주세요.'); return; }
    if (verificationCode !== '123456') { setError('인증번호가 올바르지 않습니다.'); return; }
    setIsTimerActive(false);
    router.push('/reset-password');
  }, [verificationCode, router]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setStep('input');
    setUserId('');
    setPhone('');
    setEmail('');
    setVerificationCode('');
    setError('');
    setIsTimerActive(false);
    setTimeLeft(0);
  };

  const handleFindUsername = () => router.push('/find-username');
  const isEmailFormValid = userId && email;
  const isVerificationFormValid = verificationCode && isTimerActive;

  const renderSmsInputForm = () => (
    <>
      <div className="auth-form-container">
        <form className="auth-form" onSubmit={(e) => { e.preventDefault(); handleRequestSmsVerification(); }}>
          <div className="auth-input-group">
            <label className="auth-input-label">아이디</label>
            <div className="auth-input-wrapper">
              <input type="text" className="auth-input" placeholder="아이디를 입력해주세요" value={userId} onChange={(e) => setUserId(e.target.value)} />
              {userId && (<button type="button" className="auth-clear-button" onClick={clearUserId}><span className="auth-clear-icon" /></button>)}
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">휴대폰 번호</label>
            <div className="auth-input-with-button">
              <div className="auth-input-flex">
                <div className="auth-input-wrapper">
                  <input type="tel" className="auth-input" placeholder="휴대폰 번호를 입력해주세요" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  {phone && (<button type="button" className="auth-clear-button" onClick={clearPhone}><span className="auth-clear-icon" /></button>)}
                </div>
              </div>
              <button type="button" className="auth-verification-button" onClick={handleRequestSmsVerification}>인증 요청</button>
            </div>
          </div>
          {error && <p className="auth-error-message">{error}</p>}
        </form>
      </div>
      <button type="button" className="auth-submit-button is-disabled">확인</button>
      <div className="auth-bottom-links">
        <button type="button" className="auth-bottom-link" onClick={handleFindUsername}>아이디 찾기</button>
        <button type="button" className="auth-bottom-link" onClick={() => router.push('/signup')}>회원가입</button>
      </div>
    </>
  );

  const renderEmailInputForm = () => (
    <>
      <div className="auth-form-container">
        <form className="auth-form" onSubmit={(e) => { e.preventDefault(); handleRequestEmailVerification(); }}>
          <div className="auth-input-group">
            <label className="auth-input-label">아이디</label>
            <div className="auth-input-wrapper">
              <input type="text" className="auth-input" placeholder="아이디를 입력해주세요" value={userId} onChange={(e) => setUserId(e.target.value)} />
              {userId && (<button type="button" className="auth-clear-button" onClick={clearUserId}><span className="auth-clear-icon" /></button>)}
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">이메일</label>
            <div className="auth-input-wrapper">
              <input type="email" className="auth-input" placeholder="이메일 주소를 입력해주세요" value={email} onChange={(e) => setEmail(e.target.value)} />
              {email && (<button type="button" className="auth-clear-button" onClick={clearEmail}><span className="auth-clear-icon" /></button>)}
            </div>
          </div>
          {error && <p className="auth-error-message">{error}</p>}
        </form>
      </div>
      <button type="button" className={`auth-submit-button ${!isEmailFormValid ? 'is-disabled' : ''}`} onClick={handleRequestEmailVerification}>확인</button>
      <div className="auth-bottom-links">
        <button type="button" className="auth-bottom-link" onClick={handleFindUsername}>아이디 찾기</button>
        <button type="button" className="auth-bottom-link" onClick={() => router.push('/signup')}>회원가입</button>
      </div>
    </>
  );

  const renderSmsVerificationForm = () => (
    <>
      <div className="auth-form-container">
        <form className="auth-form" onSubmit={handleVerifyCode}>
          <div className="auth-input-group">
            <label className="auth-input-label">아이디</label>
            <div className="auth-input-wrapper">
              <input type="text" className="auth-input" value={userId} disabled />
              {userId && (<button type="button" className="auth-clear-button" onClick={clearUserId}><span className="auth-clear-icon" /></button>)}
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-input-label">휴대폰 번호</label>
            <div className="auth-input-with-button">
              <div className="auth-input-flex">
                <div className="auth-input-wrapper">
                  <input type="tel" className="auth-input" value={phone} disabled />
                </div>
              </div>
              <button type="button" className="auth-verification-button is-disabled" onClick={handleRequestSmsVerification}>인증 재요청</button>
            </div>
          </div>
          <div className="auth-input-group">
            <label className="auth-verification-label">인증번호</label>
            <div className={`auth-verification-code-wrapper-active ${verificationCode ? 'is-active' : ''}`}>
              <input type="text" className="auth-verification-code-input" placeholder="인증번호를 입력해주세요" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} maxLength={6} />
              <div className="auth-input-actions">
                {verificationCode && (<button type="button" className="auth-clear-button" onClick={clearVerificationCode}><span className="auth-clear-icon" /></button>)}
                {isTimerActive && timeLeft > 0 && (<span className="auth-timer">{formatTime(timeLeft)}</span>)}
              </div>
            </div>
          </div>
          {error && <p className="auth-error-message">{error}</p>}
        </form>
      </div>
      <button type="submit" className={`auth-submit-button ${!isVerificationFormValid ? 'is-disabled' : ''}`} onClick={handleVerifyCode}>확인</button>
      <div className="auth-bottom-links">
        <button type="button" className="auth-bottom-link" onClick={handleFindUsername}>아이디 찾기</button>
        <button type="button" className="auth-bottom-link" onClick={() => router.push('/signup')}>회원가입</button>
      </div>
    </>
  );

  const renderEmailVerificationForm = () => (
    <>
      <p className="auth-page-subtitle">"{email}"(으)로 전달됨<br />인증번호를 입력해주세요.</p>
      <div className="auth-form-container">
        <form className="auth-form" onSubmit={handleVerifyCode}>
          <div className="auth-input-group">
            <div className="auth-verification-code-wrapper">
              <input type="text" className="auth-verification-code-input" placeholder="인증번호를 입력해주세요." value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} maxLength={6} />
              <div className="auth-input-actions">
                {verificationCode && (<button type="button" className="auth-clear-button" onClick={clearVerificationCode}><span className="auth-clear-icon" /></button>)}
                {isTimerActive && timeLeft > 0 && (<span className="auth-timer">{formatTime(timeLeft)}</span>)}
              </div>
            </div>
          </div>
          {error && <p className="auth-error-message">{error}</p>}
        </form>
      </div>
      <button type="submit" className={`auth-submit-button ${!isVerificationFormValid ? 'is-disabled' : ''}`} onClick={handleVerifyCode}>확인</button>
    </>
  );

  return (
    <div className="auth-page-container">
      <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} />
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <section className="auth-content-section">
        <h1 className="auth-page-title">FORGOT PASSWORD</h1>
        {step !== 'emailVerification' && (
          <>
            <p className="auth-page-subtitle">사용중인 아이디를 인증 완료 시<br />비밀번호를 재설정할 수 있습니다.</p>
            <div className="auth-tab-container">
              <button className={`auth-tab-button ${activeTab === 'sms' ? 'is-active' : ''}`} onClick={() => handleTabChange('sms')}>문자 / 카카오 인증</button>
              <button className={`auth-tab-button ${activeTab === 'email' ? 'is-active' : ''}`} onClick={() => handleTabChange('email')}>이메일 인증</button>
            </div>
          </>
        )}
        {step === 'input' && activeTab === 'sms' && renderSmsInputForm()}
        {step === 'input' && activeTab === 'email' && renderEmailInputForm()}
        {step === 'smsVerification' && renderSmsVerificationForm()}
        {step === 'emailVerification' && renderEmailVerificationForm()}
      </section>
      <Footer />
    </div>
  );
};

export default FindPassword;
