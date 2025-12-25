import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '@/components/Header';
import Menu from '@/components/Menu';
import Footer from '@/components/Footer';

const Login: React.FC = () => {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !password) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }
    console.log('Login:', { userId, password, rememberMe });
  };

  const clearUserId = () => setUserId('');
  const clearPassword = () => setPassword('');

  return (
    <div className="auth-page-container">
      <Header variant="transparent" onMenuClick={() => setIsMenuOpen(true)} />
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <section className="login-section">
        <h1 className="login-title">LOGIN</h1>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="auth-input-group">
            <label className="auth-input-label">아이디</label>
            <div className="auth-input-wrapper">
              <input
                type="text"
                className="auth-input"
                placeholder="아이디를 입력해주세요"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
              {userId && (
                <button type="button" className="auth-clear-button" onClick={clearUserId}>
                  <span className="auth-clear-icon" />
                </button>
              )}
            </div>
          </div>

          <div className="auth-input-group">
            <label className="auth-input-label">비밀번호</label>
            <div className="auth-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="auth-input"
                placeholder="비밀번호를 입력해주세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {password && (
                <div className="auth-input-actions">
                  <button
                    type="button"
                    className="login-toggle-password-button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className={showPassword ? 'eye-off-icon' : 'eye-icon'} />
                  </button>
                  <button type="button" className="auth-clear-button" onClick={clearPassword}>
                    <span className="auth-clear-icon" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="login-options-row">
            <div className="login-checkbox-wrapper">
              <input
                type="checkbox"
                className="login-checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="login-checkbox-label" htmlFor="rememberMe">로그인 유지</label>
            </div>
            <div className="login-links-wrapper">
              <button type="button" className="login-link-button" onClick={() => router.push('/find-username')}>아이디 찾기</button>
              <span className="login-link-divider">|</span>
              <button type="button" className="login-link-button" onClick={() => router.push('/find-password')}>비밀번호 찾기</button>
            </div>
          </div>

          {error && <p className="auth-error-message">{error}</p>}

          <button type="submit" className="login-button">로그인</button>
        </form>

        <p className="login-signup-link">
          아직 회원이 아니신가요? <Link href="/signup" className="login-signup-link-text">회원가입</Link>
        </p>

        <div className="social-login-section">
          <div className="social-divider" />
          <span className="social-divider-text">SNS 계정으로 로그인하기</span>
          <div className="social-buttons">
            <button className="social-button kakao">
              <span className="kakao-icon" />
            </button>
            <button className="social-button naver">
              <span className="naver-icon">N</span>
            </button>
            <button className="social-button google">
              <span className="google-icon" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Login;
