// Thay thế import ảnh cục bộ bằng import placeholder
import placeholderImage from "../assets/images/placeholder.jpg";

// 🚫 XÓA BỎ HẰNG SỐ BACKEND_URL VÀ HÀM getCloudinaryUrl

/**
 * Get multiple image URLs
 * PHƯƠNG PHÁP 1: Lấy URL đã được lưu sẵn trong Database.
 *
 * @param {Array<Object>} images - Mảng các đối tượng ảnh từ MongoDB, mỗi đối tượng phải chứa thuộc tính 'url'.
 * @returns {Array<Object>} - Mảng các đối tượng ảnh đã có thuộc tính 'url' (đã có sẵn).
 */
export const getImageUrls = (images) => {
  // 💡 KHÔNG CẦN 'async' nữa
  if (!images || !Array.isArray(images)) return [];

  // Không cần Promise.all vì không có lời gọi API bất đồng bộ
  return images.map((img) => {
    // Lấy URL đã lưu trong DB. Nếu chưa có trường 'url' (dữ liệu cũ), dùng placeholder.
    const url = img.url || placeholderImage;

    return {
      ...img,
      url: url, // Dùng URL đã được lấy thẳng từ DB
    };
  });
};

// Loại bỏ export default imageMap;
