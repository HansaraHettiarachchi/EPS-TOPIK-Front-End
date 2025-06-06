
/**
 * Fetches an image from a backend URL and converts it to a blob URL
 * @param backendUrl The URL of the image on your backend server
 * @returns A promise that resolves to a blob URL string
 */
export async function fetchImageAsBlobUrl(backendUrl: string): Promise<string> {
  try {
    // Fetch the image from the backend
    const response = await fetch(backendUrl);

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(
        `Failed to fetch image: ${response.status} ${response.statusText}`
      );
    }

    // Get the image data as a blob
    const blob = await response.blob();

    // Create a blob URL from the image data
    const blobUrl = URL.createObjectURL(blob);

    return blobUrl;
  } catch (error) {
    console.error("Error fetching image as blob URL:", error);
    throw error;
  }
}
