const LOGIN_KEY = "demo-login-state";
const LOGIN_TIMEOUT_MS = 1000 * 60 * 30;

const logoutButton = document.getElementById("logout-button");

const isLoginExpired = (timestamp) => Date.now() - timestamp > LOGIN_TIMEOUT_MS;

const ensureLoggedIn = () => {
  const raw = localStorage.getItem(LOGIN_KEY);
  if (!raw) {
    redirectToLogin();
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed?.loggedInAt !== "number" || isLoginExpired(parsed.loggedInAt)) {
      localStorage.removeItem(LOGIN_KEY);
      redirectToLogin();
    }
  } catch (error) {
    localStorage.removeItem(LOGIN_KEY);
    redirectToLogin();
  }
};

const redirectToLogin = () => {
  window.location.replace("index.html");
};

const handleLogout = () => {
  localStorage.removeItem(LOGIN_KEY);
  redirectToLogin();
};

logoutButton.addEventListener("click", handleLogout);
ensureLoggedIn();
