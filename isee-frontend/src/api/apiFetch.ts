type HttpMethods = 'GET'|'POST'|'PUT'|'PATCH'|'DELETE';

export const apiFetch = async (url: string, method: HttpMethods, body: any, headers = {}) => {
    return fetch(url, {
        method,
        headers : {
          'Accept'       : 'application/json',
          'Content-Type' : 'application/json',
          ...headers,
          ...(localStorage.getItem('jwt')) && {'Authorization' : 'bearer ' + localStorage.getItem('jwt')},
        },
        body : JSON.stringify(body)
      }).then(res => res.json())
}