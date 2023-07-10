function fetchPost(url: string, body: any) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export async function getSpacexData<T>(url: string, body?: any): Promise<T> {
  const response = await (body ? fetchPost(url, body) : fetch(url));

  if(!response.ok) {
    throw new Error('failed to fetch data');
  }

  return await response.json();
}