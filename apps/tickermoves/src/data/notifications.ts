import { apiUrl, headers } from '../constants/index';
import { handleCatchError } from '../utils/errors';
import { API_KEY } from '@env';

import type { ApiResponse, SaveDeviceTokenResponse } from '@tickermoves/shared-types';

const saveDeviceToken = async (token: string): Promise<ApiResponse<SaveDeviceTokenResponse>> => {
  try {
    const responseBlob = await fetch(
      `${apiUrl}/notifications/token/${token}?apiKey=${API_KEY}`,
      {
        method: 'POST',
        headers: headers,
      },
    );

    const response: ApiResponse<SaveDeviceTokenResponse> = await responseBlob.json();
    return response;
  } catch (err) {
    return handleCatchError(err as Error);
  }
};

const Notifications = Object.freeze({
  saveDeviceToken,
});

export default Notifications;
