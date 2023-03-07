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
      }).catch(error => Promise.reject(error)) // Handle network error
      .then(response => {
        if (!response.ok) {
          return Promise.reject(response) // Handle error responses HTTP 4XX, 5XX
        } else {
          return response.json() // Return success response HTTP 2XX, 3XX
        }
      })
}