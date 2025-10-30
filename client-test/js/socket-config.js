(function () {
  const STORAGE_URL_KEY = 'kifur_socket_url';
  const STORAGE_TOKEN_KEY = 'kifur_socket_token';
  const DEFAULT_URL = 'http://localhost:3000';
  const DEFAULT_TOKEN = 'Testing';

  const read = () => ({
    url: window.localStorage?.getItem(STORAGE_URL_KEY) ?? DEFAULT_URL,
    token: window.localStorage?.getItem(STORAGE_TOKEN_KEY) ?? DEFAULT_TOKEN,
  });

  const write = ({ url, token } = {}) => {
    if (url) {
      window.localStorage?.setItem(STORAGE_URL_KEY, url);
    }
    if (token !== undefined) {
      window.localStorage?.setItem(STORAGE_TOKEN_KEY, token);
    }
  };

  const buildOptions = (overrides = {}) => {
    const { url: overrideUrl, token: overrideToken, ...rest } = overrides;
    const { url: storedUrl, token: storedToken } = read();
    const url = overrideUrl ?? storedUrl;
    const token = overrideToken ?? storedToken;

    const options = { ...rest };
    if (token) {
      options.auth = { ...rest.auth, token };
    }

    return { url, options };
  };

  const create = (overrides = {}) => {
    const { url, options } = buildOptions(overrides);
    return window.io(url, options);
  };

  const promptForConfig = () => {
    const current = read();
    const url = window.prompt('Socket URL', current.url);
    if (url) {
      window.localStorage?.setItem(STORAGE_URL_KEY, url);
    }

    const token = window.prompt('Socket token', current.token ?? '');
    if (token !== null) {
      window.localStorage?.setItem(STORAGE_TOKEN_KEY, token);
    }
  };

  window.kifurSocket = {
    create,
    getConfig: read,
    setConfig: write,
    promptForConfig,
  };
})();
