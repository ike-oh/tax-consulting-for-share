import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/common/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/common/Footer';
import { TextField } from '@/components/common/TextField';
import Button from '@/components/common/Button';

const ResetPassword: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');

    if (!newPassword) {
      setError('새로운 비밀번호를 입력해주세요.');
      return;
    }

    if (!confirmPassword) {
      setError('새로운 비밀번호 확인을 입력해주세요.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다');
      return;
    }

    // TODO: API 호출 - 비밀번호 변경
    // 성공 시 로그인 페이지로 이동
    router.push('/login');
  };

  return (
    <div className="auth-page-container">
      <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} />
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <section className="auth-content-section">
        <h1 className="auth-page-title">RESET PASSWORD</h1>
        <div className="find-username-form-container">
          <form className="find-username-form" onSubmit={handlePasswordChange}>
            <div className="find-username-form-fields">
              <TextField
                variant="line"
                label="새로운 비밀번호"
                type="password"
                placeholder="비밀번호를 입력해주세요"
                value={newPassword}
                onChange={setNewPassword}
                showPasswordToggle
                fullWidth
              />

              <div className="find-username-password-confirm-wrapper">
                <TextField
                  variant="line"
                  label="새로운 비밀번호 확인"
                  type="password"
                  placeholder="새로운 비밀번호를 다시 입력해주세요"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  showPasswordToggle
                  error={error ? true : false}
                  fullWidth
                />
                {error && <p className="auth-error-message">{error}</p>}
              </div>
            </div>
          </form>
        </div>

        <div className="find-username-button-wrapper">
          <Button
            type="primary"
            size="large"
            disabled={!newPassword || !confirmPassword}
            onClick={handlePasswordChange}
          >
            비밀번호 변경
          </Button>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ResetPassword;

