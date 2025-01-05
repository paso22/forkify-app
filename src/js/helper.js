import { API_REQUEST_KEY, API_URL, REQUEST_TIMEOUT } from './config';

const timeout = function(s) {
  return new Promise(function(_, reject) {
    setTimeout(function() {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function(url, data = undefined) {
  try {
    const fetchObj = data ?
      fetch(`${API_URL}?key=${API_REQUEST_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }) :
      fetch(url);

    const res = await Promise.race([fetchObj, timeout(REQUEST_TIMEOUT)]);
    const addedData = await res.json();

    if (!res.ok) throw new Error(`${addedData.message} ${res.status}`);
    return addedData;
  } catch (err) {
    throw err;
  }
};