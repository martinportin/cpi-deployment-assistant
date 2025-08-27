import { XHRRequest } from '../custom';

async function makeXHRRequest({
  method,
  domain,
  resource,
  query = '',
  body = null,
  useCsrfToken = false
}: XHRRequest): Promise<XMLHttpRequest> {
  return new Promise(async (resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open(method, `https://${domain}${resource}${query}`);
    if (useCsrfToken) {
      const xcsrf = await getCsrfToken(domain);
      xhr.setRequestHeader('X-CSRF-Token', xcsrf);
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr);
      } else {
        reject(xhr);
      }
    };
    xhr.send(body);
  });
}

async function getCsrfToken(domain: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open('GET', `https://${domain}/api/1.0/user`);
    xhr.setRequestHeader('X-CSRF-Token', 'FETCH');
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const csrf = xhr.getResponseHeader('x-csrf-token');
        if (typeof csrf === 'string') {
          resolve(csrf);
        } else {
          reject(xhr);
        }
      } else {
        reject(xhr);
      }
    };
    xhr.send();
  });
}

export { makeXHRRequest };
