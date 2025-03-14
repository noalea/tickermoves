import { ApiResponse, PressReleasesResponse } from '@tickermoves/shared-types';
import { apiUrl, headers } from '../constants/index';
import { handleCatchError } from '../utils/errors';
import { API_KEY } from '@env';

const getLatestPressReleases = async ({ page, limit = 10 }: { page: number, limit?: number }): Promise<ApiResponse<PressReleasesResponse>> => {
  try {
    const responseBlob = await fetch(
      `${apiUrl}/press-releases?page=${page}&limit=${limit}&apiKey=${API_KEY}`,
      {
        method: 'GET',
        headers: headers,
      },
    );

    const response: ApiResponse<PressReleasesResponse> = await responseBlob.json();
    return response;
  } catch (err) {
    return handleCatchError(err as Error);
  }
};

const News = Object.freeze({
  getLatestPressReleases,
});

export default News;
