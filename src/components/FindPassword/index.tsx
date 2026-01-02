import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/common/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/common/Footer';
import { TextField } from '@/components/common/TextField';
import Tab from '@/components/common/Tab';
import Button from '@/components/common/Button';
// styles는 _app.tsx에서 import됨 (FindUsername과 동일한 스타일 사용)

type TabType = 'sms' | 'email';
type StepType = 'input' | 'verification';

const tabItems = [
  { id: 'sms', label: '문자 / 카카오 인증' },
  { id: 'email', label: '이메일 인증' },
];

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

  const handleRequestVerification = useCallback(() => {
    setError('');
    if (!userId) {
      setError('아이디를 입력해주세요.');
      return;
    }
    if (activeTab === 'sms') {
      if (!phone) {
        setError('휴대폰 번호를 입력해주세요.');
        return;
      }
    } else {
      if (!email) {
        setError('이메일을 입력해주세요.');
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
  }, [activeTab, userId, phone, email]);

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
    setIsTimerActive(false);
    router.push('/reset-password');
  }, [verificationCode, router]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as TabType);
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

  const renderInputForm = () => (
    <>
      <div className="find-username-form-container">
        <form className="find-username-form" onSubmit={(e) => { e.preventDefault(); handleRequestVerification(); }}>
          <div className="find-username-form-fields">
            <TextField
              variant="line"
              label="아이디"
              placeholder="아이디를 입력해주세요"
              value={userId}
              onChange={setUserId}
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
                  disabled={!userId || !phone}
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
          disabled={!userId || (activeTab === 'sms' ? !phone : !email)}
          onClick={handleRequestVerification}
        >
          확인
        </Button>
      </div>

      <div className="find-username-bottom-links">
        <Button type="text-link-gray" size="small" onClick={handleFindUsername}>
          아이디 찾기
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
                  label="아이디"
                  value={userId}
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

  return (
    <div className="auth-page-container">
      <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} />
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <section className="auth-content-section">
        <h1 className="auth-page-title">FORGOT PASSWORD</h1>
        {step === 'input' && (
          <>
            <p className="auth-page-subtitle">사용중인 아이디를 인증 완료 시<br />비밀번호를 재설정할 수 있습니다.</p>
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
      </section>
      <Footer />
    </div>
  );
};

export default FindPassword;
