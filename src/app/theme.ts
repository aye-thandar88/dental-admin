// import { theme } from "antd";
// import { colors } from "./constant";

// export const getThemeConfig = (mode: "light" | "dark") => {
//   const isDark = mode === "dark";

//   return {
//     algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,

//     token: {
//       colorPrimary: colors.primary,
//       colorInfo: colors.secondary,
//       colorWarning: colors.accent,

//       colorBgBase: isDark ? colors.deepCharcoal : colors.white,
//       colorBgContainer: isDark ? colors.primary : colors.white,

//       colorText: isDark ? "#EAEAEA" : colors.primary,

//       borderRadius: 12,
//     },

//     components: {
//       Layout: {
//         headerBg: isDark ? colors.deepCharcoal : colors.white,
//         siderBg: colors.primary,
//       },

//       Menu: {
//         darkItemBg: colors.primary,
//         darkItemSelectedBg: colors.secondary,
//         darkItemSelectedColor: "#fff",
//       },

//       Card: {
//         colorBgContainer: isDark ? "#1A1D26" : colors.white,
//       },

//       Button: {
//         colorPrimary: isDark ? colors.secondary : colors.primary,
//       },
//       Text: {
//         color: isDark ? "#fff" : colors.primary,
//       },
//     },
//   };
// };

import { theme } from "antd";
import { appColors } from "./constant";
import { Content } from "antd/es/layout/layout";

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
