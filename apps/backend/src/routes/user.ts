import { Router } from "express";
import {
  getProfile,
  getProfileById,
  updateProfile,
  deleteProfile,
  updatePreferences,
  getUserActivity,
  getUserStats,
  searchUsers,
  getLeaderboard,
} from "@/controllers/userController";
import {
  authenticate,
  optionalAuthenticate,
} from "@/middleware/authMiddleware";
import { standardLimiter } from "@/middleware/rateLimitMiddleware";
import {
  userProfileCache,
  userActivityCache,
  leaderboardCache,
  invalidateUserCache,
} from "@/middleware/cacheMiddleware";

const router = Router();

router.get("/:address", optionalAuthenticate, userProfileCache, getProfile);
router.get("/id/:id", getProfileById);
router.put(
  "/:address",
  authenticate,
  standardLimiter,
  (req, res, next) => {
    const orig = res.json.bind(res);
    res.json = (data) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        invalidateUserCache(req.params.address).catch(() => {});
      }
      return orig(data);
    };
    next();
  },
  updateProfile,
);
router.delete(
  "/:address",
  authenticate,
  (req, res, next) => {
    const orig = res.json.bind(res);
    res.json = (data) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        invalidateUserCache(req.params.address).catch(() => {});
      }
      return orig(data);
    };
    next();
  },
  deleteProfile,
);
router.put("/:address/preferences", authenticate, (req, res, next) => {
  const orig = res.json.bind(res);
  res.json = (data) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      invalidateUserCache(req.params.address).catch(() => {});
    }
    return orig(data);
  };
  next();
}, updatePreferences);
router.get("/:address/activity", userActivityCache, getUserActivity);
router.get("/:address/stats", getUserStats);
router.get("/search/query", searchUsers);
router.get("/leaderboard/list", leaderboardCache, getLeaderboard);

export default router;
