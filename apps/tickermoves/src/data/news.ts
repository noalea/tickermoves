import { ApiResponse, PressReleasesResponse } from '@tickermoves/shared-types';
import { apiUrl, headers } from '../constants/index';
import { handleCatchError } from '../utils/errors';

const getLatestPressReleases = async (): Promise<ApiResponse<PressReleasesResponse>> => {
  try {
    const responseBlob = await fetch(
      `${apiUrl}/press-releases`,
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
