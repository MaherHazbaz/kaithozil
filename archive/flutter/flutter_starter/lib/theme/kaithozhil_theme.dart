// Kaithozhil design tokens for Flutter.
// Values are copied exactly from the canvas design (design/tokens.json).
import 'package:flutter/material.dart';

class KColors {
  KColors._();
  static const purple = Color(0xFF4C1D95);
  static const purpleDark = Color(0xFF3B1574);
  static const purpleDeep = Color(0xFF2E0F5E);
  static const purpleNight = Color(0xFF1E0A3F);
  static const purpleBlack = Color(0xFF0D0420);
  static const purpleBright = Color(0xFF6A3BB5);
  static const purpleGlow = Color(0xFF7A4BC7);
  static const purpleSoft = Color(0xFF7552B5);
  static const lavender = Color(0xFFEFE9FB);
  static const lavenderText = Color(0xFFDDD3F5);
  static const pageBackground = Color(0xFFF8F7FB);
  static const gold = Color(0xFFF5C76A);
  static const goldLight = Color(0xFFFBDD96);
  static const goldDark = Color(0xFFE2A43A);
  static const mango = Color(0xFFF59E0B);
  static const mangoTint = Color(0xFFFEF3C7);
  static const mangoText = Color(0xFF7C4A03);
  static const mangoInk = Color(0xFF3B2300);
  static const ink = Color(0xFF1C1730);
  static const muted = Color(0xFF625B73);
  static const border = Color(0xFFE8E5F0);
  static const borderSoft = Color(0xFFEEEAF6);
  static const borderStrong = Color(0xFFDDD8E8);
  static const neutralTint = Color(0xFFF0EDF5);
  static const star = Color(0xFFB45309);
}

// CSS gradient angles converted to Flutter alignments.
class KGradients {
  KGradients._();
  static const hero = LinearGradient(
    begin: Alignment(-0.34, -0.94), // 160deg
    end: Alignment(0.34, 0.94),
    colors: [KColors.purpleBright, KColors.purple, KColors.purpleDeep],
    stops: [0.0, 0.5, 1.0],
  );
  static const button = LinearGradient(
    begin: Alignment.topLeft, // 135deg
    end: Alignment.bottomRight,
    colors: [KColors.purpleBright, KColors.purple, KColors.purpleDark],
    stops: [0.0, 0.6, 1.0],
  );
  static const goldButton = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [KColors.goldLight, KColors.gold, KColors.goldDark],
    stops: [0.0, 0.45, 1.0],
  );
  static const page = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [Color(0xFFF3EEFB), KColors.pageBackground, Colors.white],
    stops: [0.0, 0.35, 1.0],
  );
  static const alertScreen = RadialGradient(
    center: Alignment(0, -1),
    radius: 1.3,
    colors: [KColors.purpleGlow, KColors.purple, KColors.purpleDeep],
    stops: [0.0, 0.55, 1.0],
  );
  static const crewCard = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [KColors.purpleDark, KColors.purpleDeep],
  );
}

class KShadows {
  KShadows._();
  static const card = [BoxShadow(color: Color(0x143B1574), offset: Offset(0, 8), blurRadius: 24)];
  static const floating = [BoxShadow(color: Color(0x1F3B1574), offset: Offset(0, 12), blurRadius: 32)];
  static const button = [BoxShadow(color: Color(0x4D4C1D95), offset: Offset(0, 10), blurRadius: 24)];
  static const goldButton = [BoxShadow(color: Color(0x59E2A43A), offset: Offset(0, 10), blurRadius: 24)];
  static const nav = [BoxShadow(color: Color(0x293B1574), offset: Offset(0, 10), blurRadius: 30)];
}

class KRadii {
  KRadii._();
  static const input = 12.0;
  static const iconBox = 12.0;
  static const button = 16.0;
  static const card = 20.0;
  static const tile = 22.0;
  static const heroCard = 24.0;
  static const nav = 24.0;
  static const heroBottom = 34.0;
}

class KSizes {
  KSizes._();
  static const minTouchTarget = 44.0;
  static const primaryButtonHeight = 56.0;
  static const secondaryButtonHeight = 48.0;
  static const chipHeight = 44.0;
  static const navHeight = 68.0;
  static const screenPadding = 20.0;
}

class KFonts {
  KFonts._();
  static const body = 'PlusJakartaSans';
  static const tamil = 'NotoSansTamil';
  static const display = 'Anton';
  // Tamil characters fall back to Noto Sans Tamil automatically.
  static const fallback = [tamil];
}

class KText {
  KText._();
  static const _base = TextStyle(fontFamily: KFonts.body, fontFamilyFallback: KFonts.fallback, color: KColors.ink);
  static final screenTitle = _base.copyWith(fontSize: 24, fontWeight: FontWeight.w800);
  static final screenTitleWithBack = _base.copyWith(fontSize: 18, fontWeight: FontWeight.w800);
  static final heroGreeting = _base.copyWith(fontSize: 25, fontWeight: FontWeight.w800, letterSpacing: -0.4, color: Colors.white);
  static final cardTitle = _base.copyWith(fontSize: 15, fontWeight: FontWeight.w800);
  static final sectionLabel = _base.copyWith(fontSize: 14, fontWeight: FontWeight.w800);
  static final body = _base.copyWith(fontSize: 14, fontWeight: FontWeight.w500);
  static final button = _base.copyWith(fontSize: 16, fontWeight: FontWeight.w700);
  static final caption = _base.copyWith(fontSize: 12, fontWeight: FontWeight.w500, color: KColors.muted);
  static final tamilSecondary = _base.copyWith(fontFamily: KFonts.tamil, fontSize: 12, color: KColors.muted);
  static final bigAmount = _base.copyWith(fontSize: 30, fontWeight: FontWeight.w800);
  static final splashWord = const TextStyle(fontFamily: KFonts.display, fontSize: 58, letterSpacing: 2);
}

ThemeData buildKaithozhilTheme() {
  final scheme = ColorScheme.fromSeed(seedColor: KColors.purple).copyWith(
    primary: KColors.purple,
    onPrimary: Colors.white,
    secondary: KColors.gold,
    onSecondary: KColors.purpleDeep,
    surface: Colors.white,
    onSurface: KColors.ink,
  );
  return ThemeData(
    useMaterial3: true,
    colorScheme: scheme,
    scaffoldBackgroundColor: KColors.pageBackground,
    fontFamily: KFonts.body,
    fontFamilyFallback: KFonts.fallback,
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: Colors.white,
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(KRadii.input),
        borderSide: const BorderSide(color: KColors.borderStrong),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(KRadii.input),
        borderSide: const BorderSide(color: KColors.borderStrong),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(KRadii.input),
        borderSide: const BorderSide(color: KColors.purple, width: 2),
      ),
      labelStyle: const TextStyle(color: KColors.muted, fontWeight: FontWeight.w700, fontSize: 13),
    ),
    chipTheme: ChipThemeData(
      backgroundColor: Colors.white,
      selectedColor: KColors.lavender,
      side: const BorderSide(color: KColors.borderStrong),
      shape: const StadiumBorder(),
      labelStyle: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: KColors.ink),
    ),
  );
}
