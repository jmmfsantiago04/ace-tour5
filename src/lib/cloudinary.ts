export async function uploadToCloudinary(file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'mice_cards');
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dljqpsuv6/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    
    if (data.secure_url) {
      return {
        success: true,
        url: data.secure_url,
        originalFilename: data.original_filename
      };
    } else {
      return {
        success: false,
        error: 'Upload failed'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Upload failed'
    };
  }
} 