import type { Config } from "tailwindcss";
const flowbite = require("flowbite-react/tailwind");
const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops)",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "#13316c", // Base
          50: "#e9eef7",
          100: "#cbd9ec",
          200: "#aabfdd",
          300: "#88a6ce",
          400: "#678cc0",
          500: "#4663a3", // slightly lighter than base
          600: "#2d4a87", // close to base
          700: "#13316c", // Base
          800: "#0f285a",
          900: "#0b2049",
          950: "#061534",
        },

        // Secondary Colors
        secondary: {
          DEFAULT: "#f5f5f4", // New secondary base
          50: "#ffffff", // Pure white
          100: "#fafafa", // Slightly lighter
          200: "#f0f0ef", // Soft warm gray
          300: "#e5e5e3",
          400: "#d4d4d1",
          500: "#a3a3a1",
          600: "#737371",
          700: "#525251",
          800: "#3a3a39",
          900: "#1f1f1e",
          950: "#0f0f0f",
        },

        // Success Colors
        success: {
          DEFAULT: "#06B92D", // Updated success color to green
          50: "#ECF4FF", // Lightened success shade
          100: "#16AF6D", // Green shade
          200: "#2EDF0A", // Added new success shade
          300: "#88E417", // Added new success shade
        },

        // Muted Colors
        muted: {
          DEFAULT: "#f5f5f4", // New default muted color
          50: "#F8F8F8",      // Very light muted background
          100: "#EEEACA",     // Soft light neutral
          150: "#E7BA1E",     // Accent tone if still needed
          200: "#DADADA",     // Gentle gray neutral
          300: "#B0B0B0",     // Mid muted tone
          400: "#858892",     // Medium muted contrast
          500: "#716F6F",     // Strong muted
          600: "#67686C",     // Original muted DEFAULT
          700: "#3E3615",     // Deep muted / shadowy
        },

        // Accent Colors
        accent: {
          DEFAULT: "#E7B008", // Rich golden yellow (new base)
          50: "#FFF8E0", // Lightest tint
          100: "#FFEFAF", // Very light yellow
          200: "#FFE17A", // Soft yellow
          300: "#FFD342", // Brightened
          400: "#F9C213", // Vibrant yellow-gold
          500: "#E7B008", // Base
          600: "#C89D05", // Slightly darker
          700: "#A78304", // Dark golden
          800: "#866602", // Earthy yellow-brown
          900: "#665001", // Deepest
        },

        // Destructive Colors
        destructive: {
          DEFAULT: "#EF4444", // Base red (vibrant, attention-grabbing)
          50: "#FEF2F2", // Very light red/pink
          100: "#FEE2E2", // Light blush
          200: "#FECACA", // Soft red
          300: "#FCA5A5", // Light red
          400: "#F87171", // Warm red
          500: "#EF4444", // Base
          600: "#DC2626", // Stronger red
          700: "#B91C1C", // Deep red
          800: "#991B1B", // Darker red
          900: "#7F1D1D",
        },

        // Neutral Colors
        neutral: {
          DEFAULT: "#767676", // Default neutral color
          50: "#D9D9D9",
          100: "#B4B4B4",
          200: "#767676", // Neutral
          300: "#3A3A3A",
          400: "#6F6B6B",
          500: "#777777", // New neutral shade
          600: "#CBCBD9", // New neutral shade
          700: "#DDE1F2", // New neutral shade
        },

        // Dark Colors
        dark: {
          DEFAULT: "#1F3B5B", // Default dark color
          50: "#191D23",
          100: "#1F3B5B",
          200: "#262111",
          300: "#3B3737", // Dark shades
          400: "#2F2911",
          500: "#161922", // New dark shade
          600: "#3A3A25", // New dark shade
          700: "#2c1414", // Added new dark shade
          800: "#26210B", // Added new dark.800 shade
        },

        // Gray Colors
        gray: {
          DEFAULT: "#808080", // Default gray color
          25: "#FFFDF6", // Added new very light gray
          50: "#f9fafb",
          60: "#DFE3E8",
          75: "#E0E7F3", // New gray shade
          100: "#f3f4f6",
          110: "#B1B0B0", // Added new gray.110 shade
          120: "#C4CDD5", // Added new gray.120 shade
          125: "#D2CEBF", // Added new gray shade
          140: "#595449", // Added new gray.140 shade
          150: "#D0D5DD", // New gray shade
          175: "#636361", // Added new gray shade
          180: "#454530", // Added new gray shade
          185: "#636363", // Added new gray.185 shade
          190: "#414141", // Added new gray shade
          200: "#767676",
          225: "#dce1e8", // Added new gray shade
          250: "#B8C0CC", // Added new gray shade
          275: "#DEDEDE", // Added new gray color
          300: "#808080", // Same as DEFAULT
          350: "#3B3B3B", // Added new gray.350 shade
          400: "#9ca3af",
          425: "#424242", // Added new gray.425 shade
          450: "#383D4A", // Added new gray shade
          460: "#4c4c4c", // Added new gray.460 shade
          465: "#595959", // Added new gray.465 shade
          470: "#626262",
          500: "#515151", // New gray shade
          550: "#E4E4E4", // Added new gray shade
          570: "#DEDDDD", // Added new gray.570 shade
          600: "#211C0C", // Added new gray shade
          650: "#5B5B5B", // Added new gray shade
          700: "#9D9C9A", // Added new gray shade
          710: "#7D7D71",
          750: "#D0D0D0", // Added new gray shade
          775: "#737373", // Added new gray shade
          780: "#4B4B48",
        },

        // Brown Colors
        brown: {
          DEFAULT: "#473B14", // Default brown color
          50: "#251F0C",
          100: "#302B11",
          200: "#251F0C",
          300: "#473B14",
          350: "#414134", // Added new brown shade
          375: "#42420F", // Added new brown shade
          390: "#4E4216", // Added new brown shade
          400: "#251F0C",
          410: "#11310D", // Added new brown.410 shade
          500: "#1E1807", // New brown shade
          600: "#4E4423", // Added new brown shade
          700: "#474747", // Added new brown shade
          800: "#937826", // Added new brown shade
          825: "#26260D", // Added new brown shade
          850: "#464545", // Added new brown.850 shade
          870: "#33312D",
          875: "#212121", // Added new brown shade
          880: "#2A2525", // Added new brown shade
          890: "#19190A", // Added new brown shade
        },

        // White Colors
        white: {
          DEFAULT: "#ffffff", // Default white color
          50: "#F9F9F9", // New white shade
          100: "#FBFAF6", // Added new white.100 shade
        },

        // Blue Colors
        blue: {
          DEFAULT: "#64748B", // Default blue color
          25: "#DFE7FF",
          50: "#182449",
          100: "#3A3D4A", // Blue shades
          150: "#1C6BFE", // Added new blue.150 shade
          200: "#64748B",
          300: "#202020",
          325: "#0353ff", // Added new blue.325 shade
          340: "#3F5ED8", // Added new blue.340 shade
          350: "#3F75FF", // Added new blue.350 shade
          375: "#2141DE", // Added new blue.375 shade
          380: "#275AFF", // Added new blue.380 shade
          390: "#7259FF", // Added new blue.390 shade
          400: "#47158C", // Merged violet shade
          500: "#3071FF", // New blue shade
          600: "#248AC9", // New blue shade
          700: "#51ABFF", // New blue shade
          800: "#8EAEC2", // Added new blue shade
          900: "#17223F", // Added new blue shade
          925: "#292B31", // Added new blue shade
        },

        // Black Colors
        black: {
          DEFAULT: "#000000", // Default black color
          50: "#000000",
          100: "#0C0606",
          200: "#0A0A0A", // Added new black shade
          300: "#242426", // New black shade
        },

        // Light Colors
        light: {
          DEFAULT: "#FFFBF1", // Default light color
          50: "#FFFBF1", // Light
          75: "#FFFBED",
          100: "#F8F8F8", // Light base
          150: "#FFF0BA", // Added new light shade
          200: "#FFEDA4",
        },
        green: {
          DEFAULT: "#06B92D", // New green color
          100: "#16AF6D", // New green shade
          150: "#27BC20", // Added new green.150 shade
          200: "#08CF15", // Added new green shade
          210: "#5BFF03", // Added new green.210 shade
          220: "#3DDA84", // Added new green.220 shade
        },
        yellow: {
          DEFAULT: "#F6FF7B", // New yellow color
          100: "#FCF7E6", // Added new yellow shade
          150: "#FFF8DD",
        },
        orange: {
          DEFAULT: "#FF965D", // Soft warm orange
        },
        red: {
          DEFAULT: "#FF4314", // New red color
          100: "#FF7147", // New red shade
          150: "#FD3C2A", // Added new red.150 shade
          200: "#FF4E2F", // Added new red.200 shade
        },
        violet: {
          DEFAULT: "#CD03FF", // New violet color
          100: "#AE51FF", // New violet shade
          150: "#9A27FF", // Added new violet.150 shade
          175: "#9032E3", // Added new violet.175 shade
          200: "#8226C8", // Added new violet shade
          300: "#C026C8", // Added new violet shade
        },
        gold: {
          DEFAULT: "#F4C74B", // New gold color
          100: "#C58D12", // Added new gold shade
          150: "#F2C820",
          200: "#CBA622",
          250: "#A97E39",
          300: "#52521E", // Added new gold shade
          400: "#27270D", // Added new gold shade
          500: "#66665C", // Added new gold shade
          600: "#78784B", // Added new gold shade
          700: "#3B3B14", // Added new gold shade
          800: "#EDEACC", // Added gold.800 shade
          900: "#EEECDD", // Added new gold.900 shade
          950: "#2F2F10", // Added new gold.950 shade
          975: "#FFC353", // Added new gold shade
        },
        shadow: {
          DEFAULT: "#17223F", // Updated to use blue.900 color
          light: "#1A2341", // Light shadow
          medium: "rgba(0, 0, 0, 0.5)", // Medium shadow
          dark: "rgba(0, 0, 0, 0.75)", // Dark shadow
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: {
          DEFAULT: "#0C0A09", // Deep espresso black
          50: "#f5f5f4", // Very light warm gray
          100: "#e7e5e4", // Light warm gray
          200: "#d6d3d1", // Soft neutral
          300: "#a8a29e", // Medium warm gray
          400: "#78716c", // Muted brown-gray
          500: "#57534e", // Dark muted
          600: "#44403c", // Deep gray-brown
          700: "#292524", // Very dark gray
          800: "#1c1917", // Near-black
          900: "#0C0A09", // Your base (espresso black)
        },
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
      },
      fontFamily: {
        sans: ['"Instrument Sans"', "Helvetica", "Arial", "sans-serif"], // Default font-family
      },
      boxShadow: {
        "custom-default": "0 7px 10.9px 0px rgba(23, 34, 63, 0.05)", // Default shadow using blue.900 with 5% opacity
        "custom-light": "0px 18.05px 31.31px 0px rgba(26, 35, 65, 0.2)", // Light shadow
        "custom-medium": "0 4px 6px rgba(0, 0, 0, 0.5)", // Medium shadow
        "custom-dark": "0 4px 6px rgba(0, 0, 0, 0.75)", // Dark shadow
      },
    },
    borderColor: {
      primary: {
        DEFAULT: "#FFD427",
        30: "#FDF9EA",
        50: "#FFFBF1",
        100: "#FFD427",
        125: "#FFCC25", // Added new primary.125 shade
        150: "#FFF0BA",
        200: "#FFC703",
        300: "#FCC429",
        400: "#FED328",
        500: "#E7BA1E",
        600: "#F8F8F8",
        700: "#FFD427",
        800: "#FFEDA4",
        900: "#EEC01E", // New shade
      },
      secondary: {
        DEFAULT: "#707176",
        50: "#F8F8F8",
        100: "#808080",
        200: "#6B6969",
        300: "#3A3A3A",
        400: "#34373F",
        500: "#3C3C14",
        600: "#464646",
        700: "#707176",
        800: "#252010",
        900: "#3F3F3F",
        950: "#6B5B23", // Added new secondary shade
      },
      success: {
        DEFAULT: "#06B92D", // Default success color
        50: "#ECF4FF",
        100: "#16AF6D",
        200: "#2EDF0A",
        300: "#88E417",
      },
      muted: {
        DEFAULT: "#67686C", // Default muted color
        50: "#E7BA1E",
        100: "#67686C",
        150: "#F8F8F8", // Added new muted shade
        200: "#716F6F", // Muted shades
        300: "#858892",
        400: "#3E3615",
        500: "#EEEACA", // Added new muted shade
      },
      accent: "var(--accent)",
      destructive: "var(--destructive)",
      neutral: {
        DEFAULT: "#767676", // Default neutral color
        50: "#D9D9D9",
        100: "#B4B4B4",
        200: "#767676", // Neutral
        300: "#3A3A3A",
        400: "#6F6B6B",
        500: "#777777", // New neutral shade
        600: "#CBCBD9", // New neutral shade
        700: "#DDE1F2", // New neutral shade
      },
      dark: "var(--dark)",
      gray: {
        DEFAULT: "#808080", // Default gray color
        25: "#FFFDF6", // Added new very light gray
        50: "#D9D9D9",
        60: "#DFE3E8",
        75: "#E0E7F3", // New gray shade
        100: "#B0B0B0",
        110: "#B1B0B0", // Added new gray.110 shade
        120: "#C4CDD5", // Added new gray.120 shade
        125: "#D2CEBF", // Added new gray shade
        140: "#595449", // Added new gray.140 shade
        150: "#D0D5DD", // New gray shade
        175: "#636361", // Added new gray shade
        180: "#454530", // Added new gray shade
        185: "#636363", // Added new gray.185 shade
        190: "#414141", // Added new gray shade
        200: "#767676",
        225: "#dce1e8", // Added new gray shade
        250: "#B8C0CC", // Added new gray shade
        275: "#DEDEDE", // Added new gray color
        300: "#808080", // Gray
        350: "#3B3B3B", // Added new gray.350 shade
        400: "#34373F",
        425: "#424242", // Added new gray.425 shade
        450: "#383D4A", // Added new gray shade
        460: "#4c4c4c", // Added new gray.460 shade
        465: "#595959", // Added new gray.465 shade
        470: "#626262",
        500: "#515151", // New gray shade
        550: "#E4E4E4", // Added new gray shade
        570: "#DEDDDD", // Added new gray.570 shade
        600: "#211C0C", // Added new gray shade
        650: "#5B5B5B", // Added new gray shade
        700: "#9D9C9A", // Added new gray shade
        710: "#7D7D71",
        750: "#D0D0D0", // Added new gray shade
        775: "#737373", // Added new gray shade
        780: "#4B4B48",
      },
      blue: {
        DEFAULT: "#64748B", // Default blue color
        25: "#DFE7FF",
        50: "#182449",
        100: "#3A3D4A",
        150: "#1C6BFE", // Added new blue.150 shade
        200: "#64748B",
        300: "#202020",
        325: "#0353ff", // Added new blue.325 shade
        340: "#3F5ED8", // Added new blue.340 shade
        350: "#3F75FF", // Added new blue.350 shade
        375: "#2141DE", // Added new blue.375 shade
        380: "#275AFF", // Added new blue.380 shade
        390: "#7259FF", // Added new blue.390 shade
        400: "#47158C",
        500: "#3071FF",
        600: "#248AC9",
        700: "#51ABFF",
        800: "#8EAEC2", // Added new blue shade
        900: "#17223F", // Added new blue shade
        925: "#292B31", // Added new blue shade
      },
      brown: {
        DEFAULT: "#473B14",
        50: "#251F0C",
        100: "#302B11",
        200: "#251F0C",
        300: "#473B14",
        350: "#414134", // Added new brown shade
        375: "#42420F", // Added new brown shade
        390: "#4E4216", // Added new brown shade
        400: "#251F0C",
        410: "#11310D", // Added new brown.410 shade
        500: "#1E1807",
        600: "#4E4423", // Added new brown shade
        700: "#474747", // Added new brown shade
        800: "#937826", // Added new brown shade
        850: "#464545", // Added new brown.850 shade
        825: "#26260D", // Added new brown shade
        870: "#33312D",
        875: "#212121", // Added new brown shade
        880: "#2A2525", // Added new brown shade
        890: "#19190A", // Added new brown shade
      },
      white: "var(--white)",
      black: {
        DEFAULT: "#000000",
        50: "#000000",
        100: "#0C0606",
        200: "#0A0A0A",
        300: "#242426", // New black shade
      },
      light: "var(--light)",
      border: "var(--border)", // Existing border color
      green: {
        DEFAULT: "#06B92D", // New green color
        100: "#16AF6D", // New green shade
        150: "#27BC20", // Added new green.150 shade
        200: "#08CF15", // Added new green shade
        210: "#5BFF03", // Added new green.210 shade
        220: "#3DDA84", // Added new green.220 shade
      },
      yellow: "var(--yellow)", // Updated to var(--yellow)
      orange: {
        DEFAULT: "#FF965D", // Soft warm orange
      },
      red: {
        DEFAULT: "#FF4314", // New red color
        100: "#FF7147", // New red shade
        150: "#FD3C2A", // Added new red.150 shade
        200: "#FF4E2F", // Added new red.200 shade
      }, // Updated to var(--red)
      violet: {
        DEFAULT: "#CD03FF", // Default violet color
        100: "#AE51FF", // Violet shade
        150: "#9A27FF", // Added new violet.150 shade
        175: "#9032E3", // Added new violet.175 shade
      },
      gold: {
        DEFAULT: "#F4C74B", // New gold color
        100: "#C58D12", // Added new gold shade
        150: "#F2C820",
        200: "#CBA622",
        250: "#A97E39",
        300: "#52521E", // Added new gold shade
        400: "#27270D", // Added new gold shade
        500: "#66665C", // Added new gold shade
        600: "#78784B", // Added new gold shade
        700: "#3B3B14", // Added new gold shade
        800: "#EDEACC", // Added gold.800 shade
        900: "#EEECDD", // Added new gold.900 shade
        950: "#2F2F10", // Added new gold.950 shade
        975: "#FFC353", // Added new gold shade
      }, // Updated to var(--gold)
    },
    ringColor: {
      primary: "var(--primary)",
      secondary: "var(--secondary)",
      success: "var(--success)",
      muted: "var(--muted)",
      accent: "var(--accent)",
      destructive: "var(--destructive)",
      neutral: "var(--neutral)",
      dark: "var(--dark)",
      gray: "var(--gray)",
      brown: "var(--brown)",
      white: "var(--white)",
      blue: "var(--blue)",
      black: "var(--black)",
      light: "var(--light)",
      ring: "var(--ring)", // Existing ring color
      green: "var(--green)", // Updated to var(--green)
      yellow: "var(--yellow)", // Updated to var(--yellow)
      red: "var(--red)", // Updated to var(--red)
      violet: "var(--violet)", // Updated to var(--violet)
      gold: "var(--gold)", // Updated to var(--gold)
    },
    keyframes: {
      "accordion-down": {
        from: {
          height: "0",
        },
        to: {
          height: "var(--radix-accordion-content-height)",
        },
      },
      "accordion-up": {
        from: {
          height: "var(--radix-accordion-content-height)",
        },
        to: {
          height: "0",
        },
      },
      overlayShow: {
        from: { opacity: "0" },
        to: { opacity: "1" },
      },
      contentShow: {
        from: {
          opacity: "0",
          transform: "translate(-50%, -48%) scale(0.96)",
        },
        to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
      },
      "dot-bounce": {
        "0%, 80%, 100%": { transform: "translateY(0)", opacity: "0.2" },
        "40%": { transform: "translateY(-0.25rem)", opacity: "1" },
      },
      "slide-in-from-bottom": {
        '0%': { transform: 'translateY(100%)', opacity: "0" },
        '100%': { transform: 'translateY(0)', opacity: "1" },
      },
      "slide-out-to-bottom": {
        '0%': { transform: 'translateY(0)', opacity: "1" },
        '100%': { transform: 'translateY(100%)', opacity: "0" },
      },
    },
    animation: {
      "accordion-down": "accordion-down 0.2s ease-out",
      "accordion-up": "accordion-up 0.2s ease-out",
      overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
      contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
      "dot-bounce": "dot-bounce 1.4s infinite ease-in-out",
      "slide-in-from-bottom": "slide-in-from-bottom 0.3s ease-out",
      "slide-out-to-bottom": "slide-out-to-bottom 0.3s ease-in",
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1440px", // Updated xl breakpoint from 1280px to 1440px
      "2xl": "1536px",
    },
  },
  plugins: [require("tailwindcss-animate"), flowbite.plugin()],
};
export default config;
