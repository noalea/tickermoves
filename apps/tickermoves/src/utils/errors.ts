export function handleCatchError(err?: Error) {
  if (err?.message === 'Network request failed') {
    return { error: 'No internet. Check your network.', success: false };
  }
  console.error(err || 'Something went wrong. Please try again.');
  return { error: 'Something went wrong. Please try again.', success: false };
}
