import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/Footer';

type TabType = 'sms' | 'email';
type StepType = 'input' | 'verification' | 'result';

const FindUsername: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('sms');
  const [step, setStep] = useState<StepType>('input');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [error, setError] = useState('');
  const [foundUsername, setFoundUsername] = useState('');

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
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const clearName = () => setName('');
  const clearPhone = () => setPhone('');
  const clearEmail = () => setEmail('');
  const clearVerificationCode = () => setVerificationCode('');

  const handleRequestVerification = useCallback(() => {
    setError('');
    if (activeTab === 'sms') {
      if (!name || !phone) {
        setError('이름과 휴대폰 번호를 입력해주세요.');
        return;
      }
    } else {
      if (!name || !email) {
        setError('이름과 이메일을 입력해주세요.');
        return;
      }
    }
    setTimeLeft(180);
    setIsTimerActive(true);
    setStep('verification');
  }, [activeTab, name, phone, email]);

  const handleVerifyCode = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!verificationCode) {
      setError('인증번호를 입력해주세요.');
      return;
    }
    if (verificationCode !== '123456') {
      setError('인증번호가 올바르지 않습니다.');
      return;
    }
    setFoundUsername('user_id_example');
    setStep('result');
    setIsTimerActive(false);
  }, [verificationCode]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setStep('input');
    setName('');
    setPhone('');
    setEmail('');
    setVerificationCode('');
    setError('');
    setIsTimerActive(false);
    setTimeLeft(0);
  };

  const handleFindPassword = () => router.push('/find-password');
  const handleGoToLogin = () => router.push('/login');

  const renderInputForm = () => (
    <>
      <div className="auth-form-container">
        <form className="auth-form" onSubmit={(e) => { e.preventDefault(); handleRequestVerification(); }}>
          <div className="auth-input-group">
            <label className="auth-input-label">이름</label>
            <div className="auth-input-wrapper">
              <input type="text" className="auth-input" placeholder="이름을 입력해주세요" value={name} onChange={(e) => setName(e.target.value)} />
              {name && (<button type="button" className="auth-clear-button" onClick={clearName}><span className="auth-clear-icon" /></button>)}
            </div>
          </div>
          {activeTab === 'sms' ? (
            <div className="auth-input-group">
              <label className="auth-input-label">휴대폰 번호</label>
              <div className="auth-input-with-button">
                <div className="auth-input-flex">
                  <div className="auth-input-wrapper">
                    <input type="tel" className="auth-input" placeholder="휴대폰 번호를 입력해주세요" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    {phone && (<button type="button" className="auth-clear-button" onClick={clearPhone}><span className="auth-clear-icon" /></button>)}
                  </div>
                </div>
                <button type="button" className="auth-verification-button" onClick={handleRequestVerification}>인증 요청</button>
              </div>
            </div>
          ) : (
            <div className="auth-input-group">
              <label className="auth-input-label">이메일</label>
              <div className="auth-input-with-button">
                <div className="auth-input-flex">
                  <div className="auth-input-wrapper">
                    <input type="email" className="auth-input" placeholder="이메일을 입력해주세요" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {email && (<button type="button" className="auth-clear-button" onClick={clearEmail}><span className="auth-clear-icon" /></button>)}
                  </div>
                </div>
                <button type="button" className="auth-verification-button" onClick={handleRequestVerification}>인증 요청</button>
              </div>
            </div>
          )}
          {error && <p className="auth-error-message">{error}</p>}
        </form>
      </div>
      <button type="button" className="auth-submit-button is-disabled">확인</button>
      <div className="auth-bottom-links">
        <button type="button" className="auth-bottom-link" onClick={handleFindPassword}>비밀번호 찾기</button>
        <button type="button" className="auth-bottom-link" onClick={() => router.push('/signup')}>회원가입</button>
      </div>
    </>
  );

  const renderVerificationForm = () => (
    <>
      <div className="auth-form-container">
        <form className="auth-form" onSubmit={handleVerifyCode}>
          <div className="auth-input-group">
            <label className="auth-input-label">이름</label>
            <div className="auth-input-wrapper">
              <input type="text" className="auth-input" value={name} disabled />
            </div>
          </div>
          {activeTab === 'sms' ? (
            <div className="auth-input-group">
              <label className="auth-input-label">휴대폰 번호</label>
              <div className="auth-input-with-button">
                <div className="auth-input-flex">
                  <div className="auth-input-wrapper">
                    <input type="tel" className="auth-input" value={phone} disabled />
                  </div>
                </div>
                <button type="button" className="auth-verification-button" onClick={handleRequestVerification}>인증 재요청</button>
              </div>
            </div>
          ) : (
            <div className="auth-input-group">
              <label className="auth-input-label">이메일</label>
              <div className="auth-input-with-button">
                <div className="auth-input-flex">
                  <div className="auth-input-wrapper">
                    <input type="email" className="auth-input" value={email} disabled />
                  </div>
                </div>
                <button type="button" className="auth-verification-button" onClick={handleRequestVerification}>인증 재요청</button>
              </div>
            </div>
          )}
          <div className="auth-input-group">
            <label className="auth-verification-label">인증번호</label>
            <div className="auth-verification-code-wrapper">
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
      <button type="submit" className={`auth-submit-button ${(!verificationCode || !isTimerActive) ? 'is-disabled' : ''}`} onClick={handleVerifyCode}>확인</button>
      <div className="auth-bottom-links">
        <button type="button" className="auth-bottom-link" onClick={handleFindPassword}>비밀번호 찾기</button>
        <button type="button" className="auth-bottom-link" onClick={() => router.push('/signup')}>회원가입</button>
      </div>
    </>
  );

  const renderResult = () => (
    <div className="find-result-section">
      <p className="find-result-message">입력하신 정보와 일치하는 아이디입니다.</p>
      <div className="find-result-username">
        <p className="find-username-label">아이디</p>
        <p className="find-username-value">{foundUsername}</p>
      </div>
      <div className="find-button-group">
        <button className="find-secondary-button" onClick={handleFindPassword}>비밀번호 찾기</button>
        <button className="find-primary-button" onClick={handleGoToLogin}>로그인</button>
      </div>
    </div>
  );

  return (
    <div className="auth-page-container">
      <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} />
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <section className="auth-content-section">
        <h1 className="auth-page-title">FIND USERNAME</h1>
        {step !== 'result' && (
          <>
            <p className="auth-page-subtitle">이름 및 인증번호 인증 완료 시<br />아이디를 찾을 수 있습니다.</p>
            <div className="auth-tab-container">
              <button className={`auth-tab-button ${activeTab === 'sms' ? 'is-active' : ''}`} onClick={() => handleTabChange('sms')}>문자 / 카카오 인증</button>
              <button className={`auth-tab-button ${activeTab === 'email' ? 'is-active' : ''}`} onClick={() => handleTabChange('email')}>이메일 인증</button>
            </div>
          </>
        )}
        {step === 'input' && renderInputForm()}
        {step === 'verification' && renderVerificationForm()}
        {step === 'result' && renderResult()}
      </section>
      <Footer />
    </div>
  );
};

export default FindUsername;
