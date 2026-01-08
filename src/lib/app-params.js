const isBrowser = typeof window !== "undefined";

const storage = isBrowser
  ? window.localStorage
  : { getItem: () => null, setItem: () => {}, removeItem: () => {} };

const toSnakeCase = (str) => str.replace(/([A-Z])/g, "_$1").toLowerCase();

const getAppParamValue = (paramName, { defaultValue, removeFromUrl = false } = {}) => {
  if (!isBrowser) return defaultValue ?? null;

  const storageKey = `base44_${toSnakeCase(paramName)}`;
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get(paramName);

  if (removeFromUrl) {
    urlParams.delete(paramName);
    const newUrl =
      `${window.location.pathname}` +
      `${urlParams.toString() ? `?${urlParams.toString()}` : ""}` +
      `${window.location.hash}`;
    window.history.replaceState({}, document.title, newUrl);
  }

  if (searchParam) {
    storage.setItem(storageKey, searchParam);
    return searchParam;
  }

  if (defaultValue != null && defaultValue !== "") {
    storage.setItem(storageKey, String(defaultValue));
    return String(defaultValue);
  }

  const storedValue = storage.getItem(storageKey);
  return storedValue || null;
};

const getAppParams = () => {
  if (getAppParamValue("clear_access_token") === "true") {
    storage.removeItem("base44_access_token");
    storage.removeItem("token");
  }

  return {
    appId: getAppParamValue("app_id", { defaultValue: import.meta.env.VITE_BASE44_APP_ID }),
    token: getAppParamValue("access_token", { removeFromUrl: true }),
    fromUrl: getAppParamValue("from_url", { defaultValue: window.location.href }),
    functionsVersion: getAppParamValue("functions_version", {
      defaultValue: import.meta.env.VITE_BASE44_FUNCTIONS_VERSION,
    }),
    appBaseUrl: getAppParamValue("app_base_url", {
      defaultValue: import.meta.env.VITE_BASE44_APP_BASE_URL || window.location.origin,
    }),
    backendUrl: import.meta.env.VITE_BASE44_BACKEND_URL || "https://base44.app",
  };
};

export const appParams = getAppParams();
