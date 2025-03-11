import { ApiResponse, SaveDeviceTokenResponse } from '@tickermoves/shared-types';
import { apiUrl, headers } from '../constants/index';
import { handleCatchError } from '../utils/errors';

const saveDeviceToken = async (token: string): Promise<ApiResponse<SaveDeviceTokenResponse>> => {
  try {
    const responseBlob = await fetch(
      `${apiUrl}/notifications/token/${token}`,
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
