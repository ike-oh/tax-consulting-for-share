import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/common/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/common/Footer';
import { TextField } from '@/components/common/TextField';
import Tab from '@/components/common/Tab';
import Button from '@/components/common/Button';

type TabType = 'sms' | 'email';
type StepType = 'input' | 'verification' | 'result';

const tabItems = [
  { id: 'sms', label: '문자 / 카카오 인증' },
  { id: 'email', label: '이메일 인증' },
];

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
      // 테스트용: 특정 이름으로 이름 불일치 에러 테스트
      // 에러를 설정하고 인증번호 입력 단계로 넘어가서 에러를 표시
      if (name === '테스트이름불일치') {
        setTimeLeft(180);
        setIsTimerActive(true);
        setStep('verification');
        setError('가입시 입력한 이름과 일치하지 않습니다');
        return;
      }
      // 테스트용: 특정 이메일로 이메일 계정 없음 에러 테스트
      // 에러를 설정하고 인증번호 입력 단계로 넘어가서 에러를 표시
      if (email === 'notfound@test.com') {
        setTimeLeft(180);
        setIsTimerActive(true);
        setStep('verification');
        setError('등록된 이메일 계정이 아닙니다');
        return;
      }
    }
    setTimeLeft(180);
    setIsTimerActive(true);
    setStep('verification');
  }, [activeTab, name, phone, email]);

  const handleVerifyCode = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    if (!verificationCode) {
      setError('인증번호를 입력해주세요.');
      return;
    }
    if (verificationCode !== '123456') {
      setError('인증번호가 올바르지 않습니다');
      return;
    }
    // 테스트용: 실제 API 연동 시 서버에서 받은 아이디로 교체
    setFoundUsername('qddwe22123');
    setStep('result');
    setIsTimerActive(false);
  }, [verificationCode]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as TabType);
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
      <div className="find-username-form-container">
        <form className="find-username-form" onSubmit={(e) => { e.preventDefault(); handleRequestVerification(); }}>
          <div className="find-username-form-fields">
            <TextField
              variant="line"
              label="이름"
              placeholder="이름을 입력해주세요"
              value={name}
              onChange={setName}
              fullWidth
            />

            {activeTab === 'sms' ? (
              <div className="find-username-field-with-button">
                <TextField
                  variant="line"
                  label="휴대폰 번호"
                  type="tel"
                  placeholder="휴대폰 번호를 입력해주세요"
                  value={phone}
                  onChange={setPhone}
                  fullWidth
                />
                <Button
                  type="line-white"
                  size="medium"
                  onClick={handleRequestVerification}
                  disabled={!name || !phone}
                >
                  인증 요청
                </Button>
              </div>
            ) : (
              <TextField
                variant="line"
                label="이메일"
                type="email"
                placeholder="이메일을 입력해주세요"
                value={email}
                onChange={setEmail}
                fullWidth
              />
            )}

            {error && <p className="auth-error-message">{error}</p>}
          </div>
        </form>
      </div>

      <div className="find-username-button-wrapper">
        <Button
          type="primary"
          size="large"
          disabled={!name || (activeTab === 'sms' ? !phone : !email)}
          onClick={handleRequestVerification}
        >
          확인
        </Button>
      </div>

      <div className="find-username-bottom-links">
        <Button type="text-link-gray" size="small" onClick={handleFindPassword}>
          비밀번호 찾기
        </Button>
        <span className="find-username-link-divider">|</span>
        <Button type="text-link-gray" size="small" onClick={() => router.push('/signup')}>
          회원가입
        </Button>
      </div>
    </>
  );

  const renderVerificationForm = () => (
    <>
      {activeTab === 'email' && (
        <p className="auth-verification-subtitle">
          "{email}"(으)로 전달된<br />
          인증번호를 입력해주세요.
        </p>
      )}
      <div className="find-username-form-container">
        <form className="find-username-form" onSubmit={handleVerifyCode}>
          <div className="find-username-form-fields">
            {activeTab === 'sms' ? (
              <>
                <TextField
                  variant="line"
                  label="이름"
                  value={name}
                  readOnly
                  fullWidth
                />
                <div className="find-username-field-with-button">
                  <TextField
                    variant="line"
                    label="휴대폰 번호"
                    type="tel"
                    value={phone}
                    readOnly
                    fullWidth
                  />
                  <Button
                    type="line-white"
                    size="medium"
                    onClick={handleRequestVerification}
                    disabled={!isTimerActive}
                  >
                    인증 재요청
                  </Button>
                </div>
              </>
            ) : null}

            <div className="find-username-verification-code-wrapper">
              <TextField
                variant="line"
                placeholder="인증번호를 입력해주세요"
                value={verificationCode}
                onChange={setVerificationCode}
                maxLength={6}
                timer={isTimerActive ? timeLeft : undefined}
                fullWidth
              />
              {activeTab === 'email' && (
                <button
                  type="button"
                  className="find-username-resend-link"
                  onClick={handleRequestVerification}
                  disabled={!isTimerActive}
                >
                  인증번호 재요청
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {error && (
        <div className="find-username-error-wrapper">
          <p className="auth-error-message">{error}</p>
        </div>
      )}

      <div className="find-username-button-wrapper">
        <Button
          type={verificationCode && isTimerActive && !error ? "primary" : "secondary"}
          size="large"
          disabled={!verificationCode || !isTimerActive || !!error}
          onClick={handleVerifyCode}
        >
          확인
        </Button>
      </div>
    </>
  );

  const renderResult = () => (
    <>
      <div className="find-username-form-container">
        <div className="find-result-message-container">
          <p className="find-result-message">
            {name}님의 아이디는<br />
            "{foundUsername}"입니다.
          </p>
        </div>
      </div>
      <div className="find-result-button-group">
        <Button type="primary" size="large" onClick={handleGoToLogin}>
          로그인
        </Button>
        <Button type="line-white" size="large" onClick={handleFindPassword}>
          비밀번호 찾기
        </Button>
      </div>
    </>
  );

  return (
    <div className="auth-page-container">
      <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} />
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <section className="auth-content-section">
        <h1 className="auth-page-title">FIND USERNAME</h1>
        {step === 'input' && (
          <>
            <p className="auth-page-subtitle">이름 및 인증번호 인증 완료 시<br />아이디를 찾을 수 있습니다.</p>
            <div className="find-username-tab-wrapper">
              <Tab
                items={tabItems}
                activeId={activeTab}
                onChange={handleTabChange}
                style="box"
                size="medium"
                showActiveDot={true}
                fullWidth
              />
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

