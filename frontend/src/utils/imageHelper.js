// Import tất cả ảnh bệnh
import daoOn1 from "../assets/images/diseases/dao-on-1.jpg";
import daoOn2 from "../assets/images/diseases/dao-on-2.jpg";
import rayNau1 from "../assets/images/diseases/ray-nau-1.jpg";
import rayNau2 from "../assets/images/diseases/ray-nau-2.jpg";
import lemLep1 from "../assets/images/diseases/lem-lep-1.jpg";
import lemLep2 from "../assets/images/diseases/lem-lep-2.jpg";
import chayBia1 from "../assets/images/diseases/chay-bia-1.jpg";
import chayBia2 from "../assets/images/diseases/chay-bia-2.png";
import sauCuon1 from "../assets/images/diseases/sau-cuon-1.jpg";
import sauCuon2 from "../assets/images/diseases/sau-cuon-2.jpg";
import placeholder from "../assets/images/placeholder.jpg";

// Mapping object
const imageMap = {
  "dao-on-1.jpg": daoOn1,
  "dao-on-2.jpg": daoOn2,
  "ray-nau-1.jpg": rayNau1,
  "ray-nau-2.jpg": rayNau2,
  "lem-lep-1.jpg": lemLep1,
  "lem-lep-2.jpg": lemLep2,
  "chay-bia-1.jpg": chayBia1,
  "chay-bia-2.jpg": chayBia2,
  "sau-cuon-1.jpg": sauCuon1,
  "sau-cuon-2.jpg": sauCuon2,
};

/**
 * Get image URL from local path
 * @param {string} path - Local path như "dao-on-1.jpg"
 * @returns {string} - Import URL của ảnh
 */
export const getImageUrl = (path) => {
  if (!path) return placeholder;
  return imageMap[path] || placeholder;
};

/**
 * Get multiple image URLs
 * @param {Array} images - Array of image objects với path
 * @returns {Array} - Array với URL đã import
 */
export const getImageUrls = (images) => {
  if (!images || !Array.isArray(images)) return [];

  return images.map((img) => ({
    ...img,
    url: getImageUrl(img.path),
  }));
};

export default imageMap;
