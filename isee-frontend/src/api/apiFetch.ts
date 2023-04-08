type HttpMethods = 'GET'|'POST'|'PUT'|'PATCH'|'DELETE';

export const apiFetch = async <T>(url: string, method: HttpMethods, body: any = {}, headers = {}) => {
  headers = { 
    ...headers,
    ...(localStorage.getItem('jwt')) && {'Authorization' : 'bearer ' + localStorage.getItem('jwt')},
    ...!(body instanceof FormData) && {   
      'Accept'       : 'application/json',
      'Content-Type' : 'application/json',
    }
  }

  const requestBody = body instanceof FormData ? body : JSON.stringify(body)

    return fetch(url, {
        method,
        headers,
        ...method != 'GET' && {body : requestBody}
      })
      .catch(error => Promise.reject(error)) // Handle network error
      .then(response => {
        if (!response.ok) {
          return Promise.reject(response) // Handle error responses HTTP 4XX, 5XX
        } else {
          return response.json().catch(() => {return {}}) // Return success response HTTP 2XX, 3XX
        }
      })
}