const LOGIN_KEY = "demo-login-state";
const LOGIN_TIMEOUT_MS = 1000 * 60 * 30; // 30 minutes
const VALID_CREDENTIALS = {
  username: "admin",
  password: "123456",
};

const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const captchaInput = document.getElementById("captcha-input");
const captchaDisplay = document.getElementById("captcha-display");
const refreshCaptchaButton = document.getElementById("refresh-captcha");
const errorBox = document.getElementById("form-error");

const createCaptcha = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let captcha = "";
  for (let i = 0; i < 5; i += 1) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
};

const setCaptcha = () => {
  const captcha = createCaptcha();
  captchaDisplay.value = captcha;
  captchaDisplay.dataset.captchaValue = captcha;
};

const persistLoginState = () => {
  const payload = {
    loggedInAt: Date.now(),
  };
  localStorage.setItem(LOGIN_KEY, JSON.stringify(payload));
};

const isLoginExpired = (timestamp) => Date.now() - timestamp > LOGIN_TIMEOUT_MS;

const readLoginState = () => {
  const raw = localStorage.getItem(LOGIN_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed?.loggedInAt === "number" && !isLoginExpired(parsed.loggedInAt)) {
      return parsed;
    }
    localStorage.removeItem(LOGIN_KEY);
    return null;
  } catch (error) {
    localStorage.removeItem(LOGIN_KEY);
    return null;
  }
};

const showError = (message) => {
  errorBox.textContent = message;
};

const clearError = () => {
  errorBox.textContent = "";
};

const redirectToSuccess = () => {
  window.location.href = "success.html";
};

const handleLoginSubmit = (event) => {
  event.preventDefault();
  clearError();

  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  const captcha = captchaInput.value.trim().toUpperCase();
  const expectedCaptcha = captchaDisplay.dataset.captchaValue;

  if (!username || !password || !captcha) {
    showError("请完整填写所有字段。");
    return;
  }

  if (captcha !== expectedCaptcha) {
    showError("验证码错误，请重新输入。");
    setCaptcha();
    captchaInput.value = "";
    captchaInput.focus();
    return;
  }

  if (username !== VALID_CREDENTIALS.username || password !== VALID_CREDENTIALS.password) {
    showError("账号或密码错误，请重试。");
    passwordInput.value = "";
    passwordInput.focus();
    setCaptcha();
    return;
  }

  persistLoginState();
  redirectToSuccess();
};

const init = () => {
  const loginState = readLoginState();
  if (loginState) {
    redirectToSuccess();
    return;
  }

  setCaptcha();
  loginForm.addEventListener("submit", handleLoginSubmit);
  refreshCaptchaButton.addEventListener("click", () => {
    setCaptcha();
    captchaInput.value = "";
    captchaInput.focus();
  });
};

init();
