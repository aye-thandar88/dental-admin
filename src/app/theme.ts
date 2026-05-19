import { theme } from "antd";
import { appColors } from "./constant";

export const getThemeConfig = (mode: "light" | "dark") => {
  const isDark = mode === "dark";

  return {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,

    token: {
      // Brand
      colorPrimary: appColors.primary,
      colorSuccess: appColors.success,
      colorWarning: appColors.warning,
      colorError: appColors.error,

      // Background system
      colorBgBase: isDark
        ? appColors.backgroundDark
        : appColors.backgroundLight,

      colorBgContainer: isDark ? appColors.surfaceDark : appColors.surfaceLight,

      // Text system
      colorText: isDark
        ? appColors.textPrimaryDark
        : appColors.textPrimaryLight,

      colorTextSecondary: isDark
        ? appColors.textSecondaryDark
        : appColors.textSecondaryLight,

      // Borders
      colorBorder: isDark ? appColors.borderDark : appColors.borderLight,

      borderRadius: 12,
    },

    components: {
      Layout: {
        headerBg: isDark ? appColors.backgroundDark : appColors.surfaceLight,

        siderBg: appColors.primary,
      },

      Menu: {
        darkItemBg: appColors.primary,
        darkItemSelectedBg: appColors.primaryHover,
        darkItemSelectedColor: "#fff",
      },

      Card: {
        colorBgContainer: isDark ? appColors.cardDark : appColors.cardLight,
      },

      Button: {
        colorPrimary: appColors.primary,
        colorPrimaryHover: appColors.primaryHover,
        colorPrimaryActive: appColors.primaryActive,
      },

      Content: {
        background: isDark ? appColors.backgroundDark : appColors.backgroundLight,
      }
    },
  };
};
