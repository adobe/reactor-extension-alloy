/**
 * The max number of dimensions and metrics based on the account level.
 */
const LIMITS = {
  eVar: {
    POINT_PRODUCT: 75,
    STANDARD: 100,
    PREMIUM: 250
  },
  prop: {
    POINT_PRODUCT: 75,
    STANDARD: 75,
    PREMIUM: 75
  },
  event: {
    POINT_PRODUCT: 100,
    STANDARD: 1000,
    PREMIUM: 1000
  }
};

export const LIMITS_LEVELS_LABELS = {
  POINT_PRODUCT: '',
  STANDARD: 'Standard',
  PREMIUM: 'Premium'
};

export const maxLevel = (type) => Math.max(...Object.keys(LIMITS[type]).map(e => LIMITS[type][e]));

export default LIMITS;
