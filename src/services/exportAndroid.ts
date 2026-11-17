import JSZip from 'jszip';

export interface AndroidSourceFile {
  path: string;
  category: 'Kotlin UI' | 'Kotlin Data' | 'Kotlin Live' | 'Gradle Build' | 'Manifest & Res' | 'CI/CD Pipeline';
  description: string;
  content: string;
}

export const ANDROID_PROJECT_FILES: AndroidSourceFile[] = [
  {
    path: '.github/workflows/build.yml',
    category: 'CI/CD Pipeline',
    description: 'Automated GitHub Actions CI/CD to build and release APK on push/tag',
    content: `name: Build & Release APK

on:
  push:
    branches: [ "main" ]
    tags: [ "v*" ]
  pull_request:
    branches: [ "main" ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Set up Android SDK
        uses: android-actions/setup-android@v3

      - name: Set up Gradle 8.7
        uses: gradle/actions/setup-gradle@v4
        with:
          gradle-version: '8.7'

      - name: Build Debug APK
        run: gradle assembleDebug --stacktrace

      - name: Upload Debug APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: foss-sports-debug-apk
          path: app/build/outputs/apk/debug/app-debug.apk

      - name: Create GitHub Release on Tag
        if: startsWith(github.ref, 'refs/tags/v')
        uses: softprops/action-gh-release@v2
        with:
          files: app/build/outputs/apk/debug/app-debug.apk
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
`,
  },
  {
    path: 'settings.gradle.kts',
    category: 'Gradle Build',
    description: 'Gradle settings and repository declaration',
    content: `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "foss-sports"
include(":app")
`,
  },
  {
    path: 'build.gradle.kts',
    category: 'Gradle Build',
    description: 'Root Gradle build configuration',
    content: `plugins {
    id("com.android.application") version "8.4.1" apply false
    id("org.jetbrains.kotlin.android") version "1.9.24" apply false
}
`,
  },
  {
    path: 'gradle.properties',
    category: 'Gradle Build',
    description: 'JVM and AndroidX flags',
    content: `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official
`,
  },
  {
    path: 'app/build.gradle.kts',
    category: 'Gradle Build',
    description: 'App module dependencies and compilation settings',
    content: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.appmama.sports"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.appmama.sports"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("androidx.window:window:1.3.0")
    implementation("com.google.android.material:material:1.12.0")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
}
`,
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    category: 'Manifest & Res',
    description: 'Android manifest with internet permissions and activities',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="FOSS Sports"
        android:resizeableActivity="true"
        android:roundIcon="@mipmap/ic_launcher"
        android:supportsRtl="true"
        android:theme="@style/Theme.FossSports">

        <meta-data
            android:name="android.max_aspect"
            android:value="2.4" />

        <activity
            android:name=".ui.SplashActivity"
            android:exported="true"
            android:resizeableActivity="true"
            android:configChanges="orientation|screenSize|smallestScreenSize|screenLayout|density"
            android:theme="@style/Theme.FossSports" />

        <activity
            android:name=".MainActivity"
            android:exported="false"
            android:resizeableActivity="true"
            android:configChanges="orientation|screenSize|smallestScreenSize|screenLayout|density" />

        <!-- Dynamic Launcher Icon Aliases for IconManager -->
        <activity-alias
            android:name=".DefaultAlias"
            android:enabled="true"
            android:exported="true"
            android:icon="@mipmap/ic_launcher"
            android:roundIcon="@mipmap/ic_launcher"
            android:targetActivity=".ui.SplashActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity-alias>

        <activity-alias
            android:name=".CosmicAlias"
            android:enabled="false"
            android:exported="true"
            android:icon="@mipmap/ic_launcher"
            android:roundIcon="@mipmap/ic_launcher"
            android:targetActivity=".ui.SplashActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity-alias>

        <activity-alias
            android:name=".MinimalAlias"
            android:enabled="false"
            android:exported="true"
            android:icon="@mipmap/ic_launcher"
            android:roundIcon="@mipmap/ic_launcher"
            android:targetActivity=".ui.SplashActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity-alias>

        <activity
            android:name=".ui.GameActivity"
            android:exported="false"
            android:resizeableActivity="true"
            android:configChanges="orientation|screenSize|smallestScreenSize|screenLayout|density" />
        <activity
            android:name=".ui.NewsActivity"
            android:exported="false"
            android:resizeableActivity="true"
            android:configChanges="orientation|screenSize|smallestScreenSize|screenLayout|density" />

        <!-- FOSS Sports Live Activity Foreground Service (Status Bar Pill & Lockscreen Banner) -->
        <service
            android:name="com.fosssports.FossLiveActivityService"
            android:exported="false" />

        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="\${applicationId}.provider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths" />
        </provider>

    </application>
</manifest>
`,
  },
  {
    path: 'app/src/main/res/values/themes.xml',
    category: 'Manifest & Res',
    description: 'Apple Sports dark theme values with OLED black window background',
    content: `<resources>
    <style name="Theme.FossSports" parent="Theme.MaterialComponents.DayNight.NoActionBar">
        <item name="android:windowBackground">#000000</item>
        <item name="android:statusBarColor">#000000</item>
        <item name="android:navigationBarColor">#000000</item>
        <item name="android:windowLightStatusBar">false</item>
    </style>
</resources>
`,
  },
  {
    path: 'app/src/main/res/xml/file_paths.xml',
    category: 'Manifest & Res',
    description: 'FileProvider cache paths for APK self-updater',
    content: `<?xml version="1.0" encoding="utf-8"?>
<paths>
    <cache-path name="cache" path="." />
</paths>
`,
  },
  {
    path: 'app/src/main/res/drawable/ic_scores.xml',
    category: 'Manifest & Res',
    description: 'Vector icon for dock scores tab',
    content: `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="#FFFFFFFF"
        android:pathData="M12,2C6.48,2 2,6.48 2,12s4.48,10 10,10 10,-4.48 10,-10S17.52,2 12,2zM12,20c-4.41,0 -8,-3.59 -8,-8s3.59,-8 8,-8 8,3.59 8,8 -3.59,8 -8,8zm-1,-13h2v6h-2zm0,8h2v2h-2z" />
</vector>
`,
  },
  {
    path: 'app/src/main/res/drawable/ic_live.xml',
    category: 'Manifest & Res',
    description: 'Vector icon for dock live tab',
    content: `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="#FFFFFFFF"
        android:pathData="M12,8a4,4 0 1,0 0,8a4,4 0 1,0 0,-8z" />
</vector>
`,
  },
  {
    path: 'app/src/main/res/drawable/ic_news.xml',
    category: 'Manifest & Res',
    description: 'Vector icon for dock news tab',
    content: `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="#FFFFFFFF"
        android:pathData="M4,5h16v2H4z M4,11h16v2H4z M4,17h10v2H4z" />
</vector>
`,
  },
  {
    path: 'app/src/main/res/drawable/ic_settings.xml',
    category: 'Manifest & Res',
    description: 'Vector icon for dock settings tab',
    content: `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
    <path
        android:fillColor="#FFFFFFFF"
        android:pathData="M12,8.5a3.5,3.5 0 1,0 0,7a3.5,3.5 0 1,0 0,-7z M3,11h3v2H3z M18,11h3v2h-3z M11,3h2v3h-2z M11,18h2v3h-2z" />
</vector>
`,
  },
  {
    path: 'app/src/main/res/drawable/ic_launcher_background.xml',
    category: 'Manifest & Res',
    description: 'OLED pitch black adaptive icon background',
    content: `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#000000"
        android:pathData="M0,0h108v108h-108z" />
</vector>
`,
  },
  {
    path: 'app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml',
    category: 'Manifest & Res',
    description: 'Adaptive launcher icon definition',
    content: `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>
`,
  },
  {
    path: 'app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml',
    category: 'Manifest & Res',
    description: 'Adaptive round launcher icon definition',
    content: `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>
`,
  },
  {
    path: 'app/proguard-rules.pro',
    category: 'Gradle Build',
    description: 'ProGuard keep rules for release builds',
    content: `# FOSS Sports ProGuard Rules
-keep class com.appmama.sports.** { *; }
-keep class com.fosssports.** { *; }
`,
  },
  {
    path: 'app/src/main/res/layout/status_bar_pill_live.xml',
    category: 'Manifest & Res',
    description: '38dp 3D liquid glass Android Status Bar Pill RemoteViews overlay',
    content: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="wrap_content"
    android:layout_height="38dp"
    android:orientation="horizontal"
    android:gravity="center_vertical"
    android:paddingStart="12dp"
    android:paddingEnd="12dp">

    <TextView
        android:id="@+id/tv_pill_icon"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="🏀"
        android:textSize="12sp" />

    <View
        android:id="@+id/view_live_dot"
        android:layout_width="6dp"
        android:layout_height="6dp"
        android:layout_marginStart="6dp" />

    <TextView
        android:id="@+id/tv_away_score_pill"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginStart="8dp"
        android:textColor="#FBBF24"
        android:textStyle="bold"
        android:textSize="12sp"
        android:text="BOS 112" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginStart="6dp"
        android:layout_marginEnd="6dp"
        android:textColor="#9CA3AF"
        android:textSize="10sp"
        android:textStyle="bold"
        android:text="VS" />

    <TextView
        android:id="@+id/tv_home_score_pill"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:textColor="#FFFFFF"
        android:textStyle="bold"
        android:textSize="12sp"
        android:text="104 CHI" />

    <View
        android:layout_width="1dp"
        android:layout_height="14dp"
        android:layout_marginStart="8dp"
        android:layout_marginEnd="8dp"
        android:background="#33FFFFFF" />

    <TextView
        android:id="@+id/tv_period_time_pill"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:textColor="#F3F4F6"
        android:textSize="11sp"
        android:textStyle="bold"
        android:text="0:12 Q4" />
</LinearLayout>
`,
  },
  {
    path: 'app/src/main/res/layout/lockscreen_live_activity_banner.xml',
    category: 'Manifest & Res',
    description: 'Dynamic lockscreen Live Activity banner notification with analytics layer',
    content: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="vertical"
    android:padding="16dp">

    <!-- Brand & Period Header -->
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal">

        <TextView
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:text="FOSS SPORTS | LIVE ACTIVITY"
            android:textColor="#10B981"
            android:textStyle="bold"
            android:textSize="11sp" />

        <TextView
            android:id="@+id/tv_period_time"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:textColor="#EF4444"
            android:textStyle="bold"
            android:textSize="11sp"
            android:text="Q4 · 0:12 LIVE" />
    </LinearLayout>

    <!-- Scoreboard Row -->
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:gravity="center_vertical"
        android:layout_marginTop="8dp"
        android:layout_marginBottom="8dp">

        <!-- Away Column -->
        <LinearLayout
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:orientation="vertical">

            <LinearLayout
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:orientation="horizontal"
                android:gravity="center_vertical">

                <ImageView
                    android:id="@+id/iv_away_possession_indicator"
                    android:layout_width="8dp"
                    android:layout_height="8dp"
                    android:layout_marginEnd="4dp"
                    android:visibility="visible" />

                <TextView
                    android:id="@+id/tv_away_name"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="BOSTON CELTICS"
                    android:textColor="#FFFFFF"
                    android:textStyle="bold"
                    android:textSize="13sp" />
            </LinearLayout>

            <TextView
                android:id="@+id/tv_away_fouls"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:textColor="#9CA3AF"
                android:textSize="10sp"
                android:text="Fouls: 16" />
        </LinearLayout>

        <!-- Scores -->
        <TextView
            android:id="@+id/tv_away_score"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:textColor="#FBBF24"
            android:textStyle="bold"
            android:textSize="24sp"
            android:text="112" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginStart="8dp"
            android:layout_marginEnd="8dp"
            android:textColor="#4B5563"
            android:textSize="12sp"
            android:textStyle="bold"
            android:text="VS" />

        <TextView
            android:id="@+id/tv_home_score"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:textColor="#FFFFFF"
            android:textStyle="bold"
            android:textSize="24sp"
            android:text="104" />

        <!-- Home Column -->
        <LinearLayout
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:orientation="vertical"
            android:gravity="end">

            <LinearLayout
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:orientation="horizontal"
                android:gravity="center_vertical">

                <TextView
                    android:id="@+id/tv_home_name"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="CHICAGO BULLS"
                    android:textColor="#FFFFFF"
                    android:textStyle="bold"
                    android:textSize="13sp" />

                <ImageView
                    android:id="@+id/iv_home_possession_indicator"
                    android:layout_width="8dp"
                    android:layout_height="8dp"
                    android:layout_marginStart="4dp"
                    android:visibility="gone" />
            </LinearLayout>

            <TextView
                android:id="@+id/tv_home_fouls"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:textColor="#9CA3AF"
                android:textSize="10sp"
                android:text="Fouls: 19" />
        </LinearLayout>
    </LinearLayout>

    <!-- Dynamic Stats & Analytics Layer -->
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:background="#1AFFFFFF"
        android:padding="6dp"
        android:orientation="horizontal">

        <TextView
            android:id="@+id/tv_away_analytics"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:textColor="#34D399"
            android:textStyle="bold"
            android:textSize="10sp"
            android:text="BOS: 52% FG | TO: 2 | PF: 16" />

        <TextView
            android:id="@+id/tv_home_analytics"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:textColor="#F87171"
            android:textStyle="bold"
            android:textSize="10sp"
            android:text="CHI: 47% FG | TO: 3 | PF: 19" />
    </LinearLayout>

    <!-- Player Stat Highlight / Live Event -->
    <TextView
        android:id="@+id/tv_live_stats"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="6dp"
        android:textColor="#D1D5DB"
        android:textSize="11sp"
        android:singleLine="true"
        android:ellipsize="marquee"
        android:text="🔥 LEADERS: J. Tatum 32 PTS, 8 REB | Z. LaVine 28 PTS, 5 AST" />
</LinearLayout>
`,
  },
  {
    path: 'app/src/main/java/com/fosssports/FossLiveActivityService.kt',
    category: 'Kotlin Live',
    description: 'Foreground Service managing WindowManager status bar pill and live notification',
    content: `package com.fosssports

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.graphics.PixelFormat
import android.os.Build
import android.os.IBinder
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.WindowManager
import android.widget.RemoteViews
import androidx.core.app.NotificationCompat
import com.appmama.sports.R

data class LiveSportsStats(
    val awayFouls: Int,
    val homeFouls: Int,
    val possessionTeam: String,
    val awayTimeoutsLeft: Int,
    val homeTimeoutsLeft: Int,
    val playerStatHighlight: String
)

class FossLiveActivityService : Service() {
    private lateinit var windowManager: WindowManager
    private var pillView: View? = null

    companion object {
        const val CHANNEL_ID = "foss_live_activities"
        const val NOTIFICATION_ID = 2026
    }

    override fun onCreate() {
        super.onCreate()
        windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager
        createNotificationChannel()
        showStatusPill()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val awayScore = intent?.getStringExtra("awayScore") ?: "112"
        val homeScore = intent?.getStringExtra("homeScore") ?: "104"
        val gamePeriod = intent?.getStringExtra("period") ?: "Q4 0:12"
        val statSummary = intent?.getStringExtra("stats") ?: "J. Tatum 32 PTS, 8 REB | Z. LaVine 28 PTS, 5 AST"

        val notification = buildLiveNotification(awayScore, homeScore, gamePeriod, statSummary)
        startForeground(NOTIFICATION_ID, notification)

        return START_STICKY
    }

    private fun showStatusPill() {
        try {
            pillView = LayoutInflater.from(this).inflate(R.layout.status_bar_pill_live, null)
            val layoutType = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            } else {
                @Suppress("DEPRECATION")
                WindowManager.LayoutParams.TYPE_PHONE
            }

            val params = WindowManager.LayoutParams(
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.WRAP_CONTENT,
                layoutType,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
                PixelFormat.TRANSLUCENT
            ).apply {
                gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL
                y = 24
            }

            windowManager.addView(pillView, params)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun updateLiveStats(views: RemoteViews, stats: LiveSportsStats) {
        views.setTextViewText(R.id.tv_away_fouls, "Fouls: \${stats.awayFouls}")
        views.setTextViewText(R.id.tv_home_fouls, "Fouls: \${stats.homeFouls}")
        
        if (stats.possessionTeam == "BOS") {
            views.setViewVisibility(R.id.iv_away_possession_indicator, View.VISIBLE)
            views.setViewVisibility(R.id.iv_home_possession_indicator, View.GONE)
        } else {
            views.setViewVisibility(R.id.iv_away_possession_indicator, View.GONE)
            views.setViewVisibility(R.id.iv_home_possession_indicator, View.VISIBLE)
        }

        views.setTextViewText(R.id.tv_live_stats, stats.playerStatHighlight)
        views.setViewVisibility(R.id.tv_live_stats, View.VISIBLE)
    }

    private fun buildLiveNotification(awayScore: String, homeScore: String, period: String, stats: String): Notification {
        val remoteViews = RemoteViews(packageName, R.layout.lockscreen_live_activity_banner).apply {
            setTextViewText(R.id.tv_away_score, awayScore)
            setTextViewText(R.id.tv_home_score, homeScore)
            setTextViewText(R.id.tv_period_time, period)
            setTextViewText(R.id.tv_live_stats, stats)
        }

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_media_play)
            .setStyle(NotificationCompat.DecoratedCustomViewStyle())
            .setCustomContentView(remoteViews)
            .setCustomBigContentView(remoteViews)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setCategory(NotificationCompat.CATEGORY_STATUS)
            .build()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "FOSS Sports Live Activities",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Real-time live dynamic scoreboard and lockscreen banner"
            }
            val manager = getSystemService(NotificationManager::class.java)
            manager?.createNotificationChannel(channel)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        pillView?.let {
            try {
                windowManager.removeView(it)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
`,
  },
  {
    path: 'app/src/main/java/com/appmama/sports/ui/C.kt',
    category: 'Kotlin UI',
    description: 'Apple Sports color tokens & styling constants with theme presets',
    content: `package com.appmama.sports.ui

import android.graphics.Color

object C {
    // Apple Sports Palette: True OLED Pitch Black Canvas with Layered Elevation
    var BG = 0xFF000000.toInt()          // Pure Pitch Black
    var CARD = 0xFF161618.toInt()        // Level 1 Elevated Surface
    var CARD2 = 0xFF1F1F23.toInt()       // Level 2 Interactive/Hover Surface
    var CARD_HOVER = 0xFF1F1F23.toInt()  // Hover Surface alias
    var CARD_BORDER = 0xFF2A2A2E.toInt() // Subtle 1px Hairline Border

    // Typography Colors
    var TEXT = 0xFFFFFFFF.toInt()        // Primary: Pure White
    var TEXT2 = 0xFF8E8E93.toInt()       // Secondary: Apple System Gray
    var TEXT3 = 0xFF636366.toInt()       // Tertiary: Dark Slate

    // Accents & Signals
    var ACCENT = 0xFFFFFFFF.toInt()      // Apple Sports monochrome active state
    var ON_ACCENT = 0xFF000000.toInt()   // Text on active white pill
    var RED = 0xFFFF453A.toInt()         // Apple Live Indicator Red
    var GREEN = 0xFF30D158.toInt()       // Final / Win Indicator Green
    var YELLOW = 0xFFFFD60A.toInt()      // Caution / Warning

    var upperHeadings: Boolean = true
    var radiusMultiplier: Float = 1.0f
    var rBase: Float = 18f

    fun r(base: Float): Float = base * radiusMultiplier

    /** Switches between OLED, Midnight, Carbon, Stadium, Retro, and Light palettes */
    fun applyPreset(preset: String) {
        when (preset.lowercase()) {
            "midnight" -> {
                BG = 0xFF070B14.toInt()
                CARD = 0xFF0E1626.toInt()
                CARD2 = 0xFF142036.toInt()
                CARD_BORDER = 0xFF1B2B48.toInt()
                TEXT = 0xFFFFFFFF.toInt()
                TEXT2 = 0xFF8899B5.toInt()
                TEXT3 = 0xFF5C6E8C.toInt()
                ACCENT = 0xFF38BDF8.toInt()
                ON_ACCENT = 0xFF070B14.toInt()
            }
            "carbon" -> {
                BG = 0xFF121214.toInt()
                CARD = 0xFF1A1A1E.toInt()
                CARD2 = 0xFF232328.toInt()
                CARD_BORDER = 0xFF2D2D34.toInt()
                TEXT = 0xFFF4F4F6.toInt()
                TEXT2 = 0xFF9A9AA4.toInt()
                TEXT3 = 0xFF6E6E78.toInt()
                ACCENT = 0xFFE4E4E7.toInt()
                ON_ACCENT = 0xFF121214.toInt()
            }
            "stadium" -> {
                BG = 0xFF07130A.toInt()
                CARD = 0xFF0D2214.toInt()
                CARD2 = 0xFF132F1D.toInt()
                CARD_BORDER = 0xFF1B3F27.toInt()
                TEXT = 0xFFFFFFFF.toInt()
                TEXT2 = 0xFF87B896.toInt()
                TEXT3 = 0xFF558362.toInt()
                ACCENT = 0xFF30D158.toInt()
                ON_ACCENT = 0xFF07130A.toInt()
            }
            "retro" -> {
                BG = 0xFF0C0A06.toInt()
                CARD = 0xFF18140C.toInt()
                CARD2 = 0xFF241E13.toInt()
                CARD_BORDER = 0xFF322A1A.toInt()
                TEXT = 0xFFFFF9E6.toInt()
                TEXT2 = 0xFFB8A882.toInt()
                TEXT3 = 0xFF7C7053.toInt()
                ACCENT = 0xFFFFD60A.toInt()
                ON_ACCENT = 0xFF0C0A06.toInt()
            }
            "light" -> {
                BG = 0xFFF2F2F7.toInt()
                CARD = 0xFFFFFFFF.toInt()
                CARD2 = 0xFFF8F8FA.toInt()
                CARD_BORDER = 0xFFE5E5EA.toInt()
                TEXT = 0xFF000000.toInt()
                TEXT2 = 0xFF6E6E73.toInt()
                TEXT3 = 0xFF8E8E93.toInt()
                ACCENT = 0xFF000000.toInt()
                ON_ACCENT = 0xFFFFFFFF.toInt()
            }
            else -> {
                // OLED Pitch Black default
                BG = 0xFF000000.toInt()
                CARD = 0xFF161618.toInt()
                CARD2 = 0xFF1F1F23.toInt()
                CARD_BORDER = 0xFF2A2A2E.toInt()
                TEXT = 0xFFFFFFFF.toInt()
                TEXT2 = 0xFF8E8E93.toInt()
                TEXT3 = 0xFF636366.toInt()
                ACCENT = 0xFFFFFFFF.toInt()
                ON_ACCENT = 0xFF000000.toInt()
            }
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/appmama/sports/ui/ViewDsl.kt',
    category: 'Kotlin UI',
    description: 'Kotlin Programmatic View DSL (Apple Sports UI components)',
    content: `package com.appmama.sports.ui

import android.content.Context
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView

const val MATCH = ViewGroup.LayoutParams.MATCH_PARENT
const val WRAP = ViewGroup.LayoutParams.WRAP_CONTENT

fun Context.dp(v: Int): Int = (v * resources.displayMetrics.density + 0.5f).toInt()
fun Context.dp(v: Float): Int = (v * resources.displayMetrics.density + 0.5f).toInt()

fun lp(w: Int = MATCH, h: Int = WRAP, weight: Float = 0f) =
    LinearLayout.LayoutParams(w, h, weight)

fun LinearLayout.LayoutParams.margins(l: Int = 0, t: Int = 0, r: Int = 0, b: Int = 0): LinearLayout.LayoutParams {
    setMargins(l, t, r, b)
    return this
}

fun Context.vbox() = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
fun Context.hbox() = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL }

fun Context.rounded(color: Int, radiusDp: Float, strokeColor: Int = 0, strokeWidthDp: Int = 0): GradientDrawable {
    return GradientDrawable().apply {
        shape = GradientDrawable.RECTANGLE
        cornerRadius = dp(radiusDp).toFloat()
        setColor(color)
        if (strokeWidthDp > 0 && strokeColor != 0) {
            setStroke(dp(strokeWidthDp), strokeColor)
        }
    }
}

fun Context.text(
    str: String,
    sizeSp: Float = 14f,
    color: Int = C.TEXT,
    bold: Boolean = false,
    weight: Int = if (bold) 700 else 400
): TextView = TextView(this).apply {
    text = str
    textSize = sizeSp
    setTextColor(color)
    includeFontPadding = false
    typeface = when {
        weight >= 800 -> Typeface.create("sans-serif-black", Typeface.NORMAL)
        weight >= 700 || bold -> Typeface.create("sans-serif-medium", Typeface.BOLD)
        weight >= 600 -> Typeface.create("sans-serif-medium", Typeface.NORMAL)
        else -> Typeface.create("sans-serif", Typeface.NORMAL)
    }
}

fun Context.pill(label: String, selected: Boolean, onClick: () -> Unit): View {
    val bg = if (selected) rounded(C.ACCENT, 16f) else rounded(C.CARD, 16f, C.CARD_BORDER, 1)
    return vbox().apply {
        gravity = Gravity.CENTER
        background = bg
        setPadding(dp(14), dp(8), dp(14), dp(8))
        layoutParams = lp(WRAP, WRAP).margins(r = dp(8))
        isClickable = true
        addView(text(label, 13f, if (selected) C.ON_ACCENT else C.TEXT2, bold = true))
        setOnClickListener { onClick() }
    }
}

fun Context.card(): LinearLayout = vbox().apply {
    background = rounded(C.CARD, 18f, C.CARD_BORDER, 1)
    setPadding(dp(16), dp(14), dp(16), dp(14))
}

fun Context.brandTitle(title: String, subtitle: String): View = hbox().apply {
    gravity = Gravity.CENTER_VERTICAL
    setPadding(0, dp(4), 0, dp(8))
    addView(text(title, 22f, C.TEXT, weight = 800), lp(0, WRAP, 1f))
    addView(text(subtitle.uppercase(), 12f, C.TEXT2, bold = true))
}

fun Context.message(msg: String): View = vbox().apply {
    gravity = Gravity.CENTER
    background = rounded(C.CARD, 16f, C.CARD_BORDER, 1)
    setPadding(dp(20), dp(24), dp(20), dp(24))
    addView(text(msg, 13.5f, C.TEXT2))
}
`,
  },
  {
    path: 'app/src/main/java/com/appmama/sports/ui/GameCardView.kt',
    category: 'Kotlin UI',
    description: 'Apple Sports game card with stacked teams, live indicator, and scores',
    content: `package com.appmama.sports.ui

import android.content.Context
import android.graphics.Color
import android.graphics.Typeface
import android.view.Gravity
import android.view.View
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import com.appmama.sports.data.BroadcastResolver
import com.appmama.sports.data.Game
import com.appmama.sports.data.Images
import com.appmama.sports.data.KalshiService

class GameCardView(context: Context, private val big: Boolean = false) : LinearLayout(context) {

    private val statusPill = TextView(context)
    private val clockText = TextView(context)
    private val channelBadge = TextView(context)
    private val kalshiBadge = TextView(context)
    
    private val awayLogo = ImageView(context)
    private val awayName = TextView(context)
    private val awayRecord = TextView(context)
    private val awayScore = TextView(context)

    private val homeLogo = ImageView(context)
    private val homeName = TextView(context)
    private val homeRecord = TextView(context)
    private val homeScore = TextView(context)

    init {
        orientation = VERTICAL
        background = context.rounded(C.CARD, 18f, C.CARD_BORDER, 1)
        val padH = context.dp(16)
        val padV = context.dp(if (big) 16 else 12)
        setPadding(padH, padV, padH, padV)

        val header = context.hbox().apply {
            gravity = Gravity.CENTER_VERTICAL
            setPadding(0, 0, 0, context.dp(10))
        }
        header.addView(statusPill)
        header.addView(clockText.apply {
            textSize = 12f
            setTextColor(C.TEXT2)
            setPadding(context.dp(8), 0, 0, 0)
        })
        header.addView(View(context), lp(0, 1, 1f))

        // Location-based TV broadcast channel badge
        channelBadge.apply {
            textSize = 11f
            setTextColor(C.TEXT2)
            background = context.rounded(C.CARD2, 6f)
            setPadding(context.dp(6), context.dp(2), context.dp(6), context.dp(2))
        }
        header.addView(channelBadge)

        // Kalshi prediction market implied probability badge
        kalshiBadge.apply {
            textSize = 10.5f
            setTextColor(C.TEXT)
            background = context.rounded(0x2230D158.toInt(), 6f, 0xFF30D158.toInt(), 1)
            setPadding(context.dp(6), context.dp(2), context.dp(6), context.dp(2))
        }
        header.addView(kalshiBadge)

        addView(header)

        val teamsContainer = context.vbox()
        teamsContainer.addView(buildTeamRow(awayLogo, awayName, awayRecord, awayScore))
        teamsContainer.addView(View(context), lp(MATCH, context.dp(8)))
        teamsContainer.addView(buildTeamRow(homeLogo, homeName, homeRecord, homeScore))
        addView(teamsContainer)
    }

    private fun buildTeamRow(logo: ImageView, name: TextView, record: TextView, score: TextView): View {
        val row = context.hbox().apply { gravity = Gravity.CENTER_VERTICAL }
        logo.layoutParams = LayoutParams(context.dp(24), context.dp(24)).margins(r = context.dp(10))
        row.addView(logo)

        val nameCol = context.vbox()
        name.apply {
            textSize = 15f
            setTextColor(C.TEXT)
            typeface = Typeface.create("sans-serif-black", Typeface.BOLD)
        }
        record.apply {
            textSize = 11.5f
            setTextColor(C.TEXT3)
        }
        nameCol.addView(name)
        nameCol.addView(record)
        row.addView(nameCol, lp(0, WRAP, 1f))

        score.apply {
            textSize = if (big) 22f else 18f
            setTextColor(C.TEXT)
            typeface = Typeface.create("sans-serif-black", Typeface.BOLD)
            gravity = Gravity.END
        }
        row.addView(score, lp(WRAP, WRAP))
        return row
    }

    fun bind(g: Game) {
        awayName.text = if (C.upperHeadings) g.away.team.name.uppercase() else g.away.team.name
        awayRecord.text = g.away.record ?: ""
        homeName.text = if (C.upperHeadings) g.home.team.name.uppercase() else g.home.team.name
        homeRecord.text = g.home.record ?: ""

        Images.load(g.away.team.logo, context.dp(48)) { awayLogo.setImageBitmap(it) }
        Images.load(g.home.team.logo, context.dp(48)) { homeLogo.setImageBitmap(it) }

        // Location broadcast channel resolution
        val ch = BroadcastResolver.resolve(context, g)
        if (ch.isNotBlank()) {
            channelBadge.visibility = View.VISIBLE
            channelBadge.text = ch
        } else {
            channelBadge.visibility = View.GONE
        }

        // Kalshi prediction market probability
        val market = g.kalshi ?: KalshiService.resolveMarket(g)
        val favoredTeam = if (market.homeWinProb >= market.awayWinProb) g.home.team.abbr else g.away.team.abbr
        val favoredProb = maxOf(market.homeWinProb, market.awayWinProb)
        kalshiBadge.visibility = View.VISIBLE
        kalshiBadge.text = "📈 \${favoredTeam} \${favoredProb}% (Kalshi)"

        when {
            g.live -> {
                statusPill.visibility = View.VISIBLE
                statusPill.text = "LIVE"
                statusPill.textSize = 10f
                statusPill.setTextColor(Color.WHITE)
                statusPill.typeface = Typeface.DEFAULT_BOLD
                statusPill.background = context.rounded(C.RED, 6f)
                statusPill.setPadding(context.dp(6), context.dp(2), context.dp(6), context.dp(2))

                clockText.text = "\${g.status ?: \"\"} · \${g.clock ?: \"\"}"

                awayScore.text = g.away.score?.toString() ?: "0"
                homeScore.text = g.home.score?.toString() ?: "0"
            }
            g.state == "post" -> {
                statusPill.visibility = View.GONE
                clockText.text = "FINAL"
                clockText.setTextColor(C.TEXT3)
                awayScore.text = g.away.score?.toString() ?: "-"
                homeScore.text = g.home.score?.toString() ?: "-"
            }
            else -> {
                statusPill.visibility = View.GONE
                clockText.text = Fmt.gameTime(g.date)
                awayScore.text = ""
                homeScore.text = g.odds?.spread ?: ""
                homeScore.textSize = 12f
                homeScore.setTextColor(C.TEXT3)
            }
        }
    }
}

`,
  },
  {
    path: 'app/src/main/java/com/appmama/sports/ui/SportFeedbackDialog.kt',
    category: 'Kotlin UI',
    description: 'Interactive bottom-sheet dialog for requesting new sports, leagues, and voting',
    content: `package com.appmama.sports.ui

import android.content.Context
import android.view.Gravity
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.Toast
import androidx.appcompat.app.AlertDialog

object SportFeedbackDialog {
    fun show(ctx: Context) {
        val root = ctx.card().apply {
            setPadding(ctx.dp(20), ctx.dp(20), ctx.dp(20), ctx.dp(20))
        }

        root.addView(ctx.text("Request a Sport", 18f, C.TEXT, weight = 800))
        root.addView(ctx.text("Vote for sports you want added next to FOSS Sports:", 12.5f, C.TEXT2).apply {
            setPadding(0, ctx.dp(4), 0, ctx.dp(14))
        })

        // Quick request suggestion pills
        val chips = listOf("UFC / MMA", "NASCAR", "PGA Tour", "Tennis (ATP/WTA)", "Cricket (IPL)", "IndyCar")
        val chipsRow = ctx.hbox().apply {
            setPadding(0, 0, 0, ctx.dp(14))
        }
        var selectedVote: String? = null

        chips.take(3).forEach { sportName ->
            chipsRow.addView(ctx.pill(sportName, selected = false) {
                selectedVote = sportName
                Toast.makeText(ctx, "Selected: \${sportName}", Toast.LENGTH_SHORT).show()
            })
        }
        root.addView(chipsRow)

        val input = EditText(ctx).apply {
            hint = "Other sport or league..."
            setHintTextColor(C.TEXT3)
            setTextColor(C.TEXT)
            textSize = 14f
            background = ctx.rounded(C.CARD_HOVER, 12f, C.CARD_BORDER, 1)
            setPadding(ctx.dp(12), ctx.dp(10), ctx.dp(12), ctx.dp(10))
        }
        root.addView(input)

        val dialog = AlertDialog.Builder(ctx)
            .setView(root)
            .create()

        val submitBtn = ctx.pill("Submit Request", selected = true) {
            val choice = selectedVote ?: input.text.toString().trim()
            if (choice.isNotBlank()) {
                Toast.makeText(ctx, "Thanks! Request for '\${choice}' logged.", Toast.LENGTH_LONG).show()
                dialog.dismiss()
            } else {
                Toast.makeText(ctx, "Please pick or enter a sport.", Toast.LENGTH_SHORT).show()
            }
        }.apply {
            (layoutParams as? LinearLayout.LayoutParams)?.gravity = Gravity.END
        }
        root.addView(submitBtn)

        dialog.show()
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/appmama/sports/ui/ThemeHubDialog.kt',
    category: 'Kotlin UI',
    description: 'Community theme explorer modal with import code parser, share, and live apply',
    content: `package com.appmama.sports.ui

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.view.Gravity
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import com.appmama.sports.data.CommunityTheme
import com.appmama.sports.data.CommunityThemeStore

object ThemeHubDialog {
    fun show(ctx: Context, onApplied: (() -> Unit)? = null) {
        val root = ctx.vbox().apply {
            background = ctx.rounded(C.BG, 20f, C.CARD_BORDER, 1)
            setPadding(ctx.dp(18), ctx.dp(18), ctx.dp(18), ctx.dp(18))
        }

        root.addView(ctx.text("Community Themes", 20f, C.TEXT, weight = 800))
        root.addView(ctx.text("Browse user-created themes or enter a share code.", 12.5f, C.TEXT2).apply {
            setPadding(0, ctx.dp(4), 0, ctx.dp(14))
        })

        // Import Bar
        val importRow = ctx.hbox().apply {
            gravity = Gravity.CENTER_VERTICAL
            setPadding(0, 0, 0, ctx.dp(14))
        }
        val importInput = EditText(ctx).apply {
            hint = "Paste theme code or foss://theme?data=..."
            setHintTextColor(C.TEXT3)
            setTextColor(C.TEXT)
            textSize = 12.5f
            background = ctx.rounded(C.CARD_HOVER, 12f, C.CARD_BORDER, 1)
            setPadding(ctx.dp(10), ctx.dp(8), ctx.dp(10), ctx.dp(8))
        }
        importRow.addView(importInput, lp(0, ctx.dp(40), 1f))
        val importBtn = pill(ctx, "Import", selected = true) {
            val code = importInput.text.toString().trim()
            val theme = CommunityTheme.fromShareCode(code)
            if (theme != null) {
                applyTheme(ctx, theme)
                CommunityThemeStore.saveTheme(ctx, theme)
                Toast.makeText(ctx, "Applied: \${theme.name}", Toast.LENGTH_SHORT).show()
                onApplied?.invoke()
            } else {
                Toast.makeText(ctx, "Invalid share code", Toast.LENGTH_SHORT).show()
            }
        }.apply {
            (layoutParams as? LinearLayout.LayoutParams)?.margins(l = ctx.dp(8))
        }
        importRow.addView(importBtn)
        root.addView(importRow)

        // Scrollable List of Community Themes
        val scroll = ScrollView(ctx)
        val listContainer = ctx.vbox()

        val themes = CommunityThemeStore.getThemes(ctx)
        themes.forEach { theme ->
            val card = ctx.vbox().apply {
                background = ctx.rounded(theme.card, theme.cornerRadius, theme.cardBorder, 1)
                setPadding(ctx.dp(14), ctx.dp(12), ctx.dp(14), ctx.dp(12))
            }

            val titleRow = ctx.hbox().apply { gravity = Gravity.CENTER_VERTICAL }
            titleRow.addView(ctx.text(theme.name, 15f, theme.text, weight = 700), lp(0, WRAP, 1f))
            titleRow.addView(ctx.text("▲ \${theme.upvotes}", 12f, theme.accent, weight = 700))
            card.addView(titleRow)

            card.addView(ctx.text("by \${theme.author}", 11f, theme.text2).apply {
                setPadding(0, ctx.dp(2), 0, ctx.dp(10))
            })

            val actionsRow = ctx.hbox().apply { gravity = Gravity.CENTER_VERTICAL }
            actionsRow.addView(ctx.pill("Share Code", selected = false) {
                val code = theme.toShareCode()
                val cm = ctx.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                cm.setPrimaryClip(ClipData.newPlainText("FOSS Sports Theme", code))
                Toast.makeText(ctx, "Share code copied!", Toast.LENGTH_SHORT).show()
            })
            actionsRow.addView(android.view.View(ctx), lp(0, 1, 1f))
            actionsRow.addView(ctx.pill("Apply", selected = true) {
                applyTheme(ctx, theme)
                Toast.makeText(ctx, "Active: \${theme.name}", Toast.LENGTH_SHORT).show()
                onApplied?.invoke()
            })
            card.addView(actionsRow)

            listContainer.addView(card, lp(MATCH, WRAP).margins(b = ctx.dp(10)))
        }

        scroll.addView(listContainer)
        root.addView(scroll, lp(MATCH, ctx.dp(360)))

        AlertDialog.Builder(ctx)
            .setView(root)
            .show()
    }

    private fun pill(ctx: Context, label: String, selected: Boolean, onClick: () -> Unit) =
        ctx.pill(label, selected, onClick)

    private fun applyTheme(ctx: Context, theme: CommunityTheme) {
        C.BG = theme.bg
        C.CARD = theme.card
        C.CARD_BORDER = theme.cardBorder
        C.ACCENT = theme.accent
        C.TEXT = theme.text
        C.TEXT2 = theme.text2
        C.rBase = theme.cornerRadius
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/appmama/sports/data/BroadcastResolver.kt',
    category: 'Kotlin Data',
    description: 'Location-based TV broadcast channel and Regional Sports Network (RSN) resolver',
    content: `package com.appmama.sports.data

import android.content.Context

object BroadcastResolver {
    // Maps user's region or selected TV market to local RSN channels and affiliates
    private val RSN_MAP = mapOf(
        "BOS" to "NBC Sports Boston (Ch. 852)",
        "LAL" to "Spectrum SportsNet (Ch. 785)",
        "GSW" to "NBC Sports Bay Area (Ch. 720)",
        "NYK" to "MSG Network (Ch. 571)",
        "BKN" to "YES Network (Ch. 573)",
        "NYY" to "YES Network (Ch. 573)",
        "KC"  to "CBS 5 KCTV (Local)",
        "NE"  to "WBZ CBS 4 / FOX 25",
        "PHI" to "NBC Sports Philly (Ch. 847)",
        "DAL" to "MavsTV / KFAA 29",
        "ARS" to "Peacock / Sky Sports"
    )

    fun resolve(ctx: Context, g: Game): String {
        val userMarket = Settings.userMarket(ctx) // e.g. "boston", "new_york", "los_angeles"
        
        // National game check
        val isNational = g.broadcast != null && (
            g.broadcast.contains("ESPN") || 
            g.broadcast.contains("TNT") || 
            g.broadcast.contains("ABC") || 
            g.broadcast.contains("NBC") || 
            g.broadcast.contains("CBS") || 
            g.broadcast.contains("FOX")
        )

        val homeAbbr = g.home.team.abbr.uppercase()
        val awayAbbr = g.away.team.abbr.uppercase()

        // 1. In-Market home channel
        val homeCh = RSN_MAP[homeAbbr]
        if (homeCh != null && (userMarket == "all" || userMarket.contains(homeAbbr.lowercase()))) {
            return homeCh
        }

        // 2. In-Market away channel
        val awayCh = RSN_MAP[awayAbbr]
        if (awayCh != null && userMarket.contains(awayAbbr.lowercase())) {
            return awayCh
        }

        // 3. National broadcast
        if (isNational && g.broadcast != null) {
            return g.broadcast
        }

        // 4. Out of market fallback
        return when (g.league) {
            "nba" -> "League Pass"
            "nfl" -> "Sunday Ticket"
            "mlb" -> "MLB.TV"
            else -> g.broadcast ?: "Streaming"
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/appmama/sports/data/Models.kt',
    category: 'Kotlin Data',
    description: 'Core sports domain models, leagues, team data classes, and ESPN URL mappings',
    content: `package com.appmama.sports.data

enum class Sport {
    BASEBALL, BASKETBALL, FOOTBALL, HOCKEY, SOCCER, RACING
}

data class League(
    val key: String,
    val name: String,
    val short: String,
    val tab: String,
    val sport: Sport,
    val espnSport: String,
    val espnLeague: String
)

data class Team(
    val id: String,
    val league: String = "",
    val name: String,
    val abbr: String = "",
    val logo: String
)

data class GameSide(
    val team: Team,
    val score: String? = null,
    val record: String? = null
)

data class GameOdds(
    val spread: String? = null,
    val overUnder: String? = null,
    val details: String? = null
)

data class Game(
    val id: String,
    val league: String,
    val date: Long,
    val state: String,
    val live: Boolean,
    val status: String,
    val clock: String? = null,
    val home: GameSide,
    val away: GameSide,
    val broadcast: String? = null,
    val odds: GameOdds? = null,
    val kalshi: KalshiMarket? = null
)

object Leagues {
    val NFL = League("nfl", "NFL Football", "NFL", "NFL", Sport.FOOTBALL, "football", "nfl")
    val NBA = League("nba", "NBA Basketball", "NBA", "NBA", Sport.BASKETBALL, "basketball", "nba")
    val MLB = League("mlb", "MLB Baseball", "MLB", "MLB", Sport.BASEBALL, "baseball", "mlb")
    val NHL = League("nhl", "NHL Hockey", "NHL", "NHL", Sport.HOCKEY, "hockey", "nhl")
    val EPL = League("epl", "Premier League", "EPL", "EPL", Sport.SOCCER, "soccer", "eng.1")
    val MLS = League("mls", "Major League Soccer", "MLS", "MLS", Sport.SOCCER, "soccer", "usa.1")
    val F1 = League("f1", "Formula 1", "F1", "F1", Sport.RACING, "racing", "f1")
    val CFB = League("cfb", "College Football", "CFB", "CFB", Sport.FOOTBALL, "football", "college-football")
    val CBB = League("cbb", "College Basketball", "CBB", "CBB", Sport.BASKETBALL, "basketball", "mens-college-basketball")
    val WNBA = League("wnba", "WNBA", "WNBA", "WNBA", Sport.BASKETBALL, "basketball", "wnba")

    val all: List<League> = listOf(NFL, NBA, MLB, NHL, EPL, MLS, F1, CFB, CBB, WNBA)

    fun get(key: String): League = all.firstOrNull { it.key.equals(key, ignoreCase = true) } ?: NFL

    fun getEmblemUrl(league: League): String = when (league.key.lowercase()) {
        "f1" -> "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/f1.png"
        "nba" -> "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/nba.png"
        "nfl" -> "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/nfl.png"
        "mlb" -> "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/mlb.png"
        "nhl" -> "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/nhl.png"
        "epl" -> "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/epl.png"
        "mls" -> "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/mls.png"
        "cfb" -> "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/cfb.png"
        "cbb" -> "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/cbb.png"
        "wnba" -> "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/wnba.png"
        else -> "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/\${league.key}.png"
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/appmama/sports/data/UserProfile.kt',
    category: 'Kotlin Data',
    description: 'User profile entity and local persistence manager with SMS 2FA status',
    content: `package com.appmama.sports.data

import android.content.Context
import org.json.JSONObject

data class UserProfile(
    val uid: String,
    val displayName: String,
    val phoneNumber: String? = null,
    val email: String? = null,
    val is2FAEnabled: Boolean = true,
    val createdAt: Long = System.currentTimeMillis()
)

object UserManager {
    private const val PREFS_NAME = "foss_sports_user"
    private const val KEY_PROFILE = "active_profile"

    fun getCurrentUser(context: Context): UserProfile? {
        val sp = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val json = sp.getString(KEY_PROFILE, null) ?: return null
        return try {
            val obj = JSONObject(json)
            UserProfile(
                uid = obj.getString("uid"),
                displayName = obj.getString("displayName"),
                phoneNumber = obj.optString("phoneNumber", null),
                email = obj.optString("email", null),
                is2FAEnabled = obj.optBoolean("is2FAEnabled", true),
                createdAt = obj.optLong("createdAt", System.currentTimeMillis())
            )
        } catch (e: Exception) {
            null
        }
    }

    fun saveUser(context: Context, profile: UserProfile) {
        val sp = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val obj = JSONObject().apply {
            put("uid", profile.uid)
            put("displayName", profile.displayName)
            put("phoneNumber", profile.phoneNumber)
            put("email", profile.email)
            put("is2FAEnabled", profile.is2FAEnabled)
            put("createdAt", profile.createdAt)
        }
        sp.edit().putString(KEY_PROFILE, obj.toString()).apply()
    }

    fun signOut(context: Context) {
        val sp = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        sp.edit().remove(KEY_PROFILE).apply()
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/appmama/sports/data/CommunityTheme.kt',
    category: 'Kotlin Data',
    description: 'Community theme data model with base64 share code encoder and decoder',
    content: `package com.appmama.sports.data

import android.util.Base64
import org.json.JSONObject

data class CommunityTheme(
    val id: String,
    val name: String,
    val author: String,
    val bg: Int,
    val card: Int,
    val cardBorder: Int,
    val accent: Int,
    val text: Int,
    val text2: Int,
    val cornerRadius: Float,
    val upvotes: Int = 0
) {
    fun toShareCode(): String {
        val json = JSONObject().apply {
            put("name", name)
            put("author", author)
            put("bg", bg)
            put("card", card)
            put("border", cardBorder)
            put("accent", accent)
            put("text", text)
            put("text2", text2)
            put("r", cornerRadius.toDouble())
        }
        return Base64.encodeToString(json.toString().toByteArray(), Base64.NO_WRAP)
    }

    companion object {
        fun fromShareCode(code: String): CommunityTheme? {
            return try {
                var clean = code.trim()
                if (clean.startsWith("foss://theme?data=")) {
                    clean = clean.removePrefix("foss://theme?data=")
                }
                val decoded = String(Base64.decode(clean, Base64.DEFAULT))
                val json = JSONObject(decoded)
                CommunityTheme(
                    id = "imported_\${System.currentTimeMillis()}",
                    name = json.optString("name", "Custom Theme"),
                    author = json.optString("author", "@User"),
                    bg = json.optInt("bg", 0xFF000000.toInt()),
                    card = json.optInt("card", 0xFF141416.toInt()),
                    cardBorder = json.optInt("border", 0xFF2A2A2E.toInt()),
                    accent = json.optInt("accent", 0xFF30D158.toInt()),
                    text = json.optInt("text", 0xFFFFFFFF.toInt()),
                    text2 = json.optInt("text2", 0xFF8E8E93.toInt()),
                    cornerRadius = json.optDouble("r", 16.0).toFloat(),
                    upvotes = 1
                )
            } catch (_: Exception) {
                null
            }
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/appmama/sports/data/CommunityThemeStore.kt',
    category: 'Kotlin Data',
    description: 'Community theme persistence store with featured curated presets and upvotes',
    content: `package com.appmama.sports.data

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject

object CommunityThemeStore {
    private const val PREF_KEY = "community_themes_saved"

    val defaultCommunityList = listOf(
        CommunityTheme(
            id = "c1",
            name = "Pure Obsidian Glass",
            author = "@DesignLead",
            bg = 0xFF000000.toInt(),
            card = 0xFF141416.toInt(),
            cardBorder = 0xFF2A2A2E.toInt(),
            accent = 0xFFFFFFFF.toInt(),
            text = 0xFFFFFFFF.toInt(),
            text2 = 0xFF8E8E93.toInt(),
            cornerRadius = 18f,
            upvotes = 342
        ),
        CommunityTheme(
            id = "c2",
            name = "Cyber Arena",
            author = "@TechBaller",
            bg = 0xFF05050A.toInt(),
            card = 0xFF0E0E18.toInt(),
            cardBorder = 0xFF1F1F35.toInt(),
            accent = 0xFF00F0FF.toInt(),
            text = 0xFFF0F6FC.toInt(),
            text2 = 0xFF7D8590.toInt(),
            cornerRadius = 12f,
            upvotes = 219
        ),
        CommunityTheme(
            id = "c3",
            name = "Fenway Heritage",
            author = "@SoxFan67",
            bg = 0xFF040C07.toInt(),
            card = 0xFF0D1E12.toInt(),
            cardBorder = 0xFF1C3A24.toInt(),
            accent = 0xFF30D158.toInt(),
            text = 0xFFFFFFFF.toInt(),
            text2 = 0xFF7EA887.toInt(),
            cornerRadius = 16f,
            upvotes = 158
        ),
        CommunityTheme(
            id = "c4",
            name = "Kobe 24 Tribute",
            author = "@PurpleGold",
            bg = 0xFF0A0A0C.toInt(),
            card = 0xFF16121E.toInt(),
            cardBorder = 0xFF33244D.toInt(),
            accent = 0xFFFDB927.toInt(),
            text = 0xFFFFFFFF.toInt(),
            text2 = 0xFFA798BD.toInt(),
            cornerRadius = 18f,
            upvotes = 184
        )
    )

    fun getThemes(ctx: Context): List<CommunityTheme> {
        val raw = Store.getString(ctx, PREF_KEY, "")
        if (raw.isBlank()) return defaultCommunityList
        return try {
            val arr = JSONArray(raw)
            val list = mutableListOf<CommunityTheme>()
            for (i in 0 until arr.length()) {
                val o = arr.getJSONObject(i)
                list.add(
                    CommunityTheme(
                        id = o.getString("id"),
                        name = o.getString("name"),
                        author = o.getString("author"),
                        bg = o.getInt("bg"),
                        card = o.getInt("card"),
                        cardBorder = o.getInt("border"),
                        accent = o.getInt("accent"),
                        text = o.getInt("text"),
                        text2 = o.getInt("text2"),
                        cornerRadius = o.getDouble("r").toFloat(),
                        upvotes = o.optInt("upvotes", 0)
                    )
                )
            }
            list
        } catch (_: Exception) {
            defaultCommunityList
        }
    }

    fun saveTheme(ctx: Context, theme: CommunityTheme) {
        val current = getThemes(ctx).toMutableList()
        current.removeAll { it.id == theme.id }
        current.add(0, theme)
        saveList(ctx, current)
    }

    private fun saveList(ctx: Context, list: List<CommunityTheme>) {
        val arr = JSONArray()
        list.forEach { t ->
            arr.put(JSONObject().apply {
                put("id", t.id)
                put("name", t.name)
                put("author", t.author)
                put("bg", t.bg)
                put("card", t.card)
                put("border", t.cardBorder)
                put("accent", t.accent)
                put("text", t.text)
                put("text2", t.text2)
                put("r", t.cornerRadius.toDouble())
                put("upvotes", t.upvotes)
            })
        }
        Store.putString(ctx, PREF_KEY, arr.toString())
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/appmama/sports/data/Espn.kt',
    category: 'Kotlin Data',
    description: 'ESPN API client with scoreboard, standings, and situation parser',
    content: `package com.appmama.sports.data

import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.time.Instant

object Espn {
    private const val BASE_URL = "https://site.api.espn.com/apis/site/v2/sports"
    private val cache = java.util.concurrent.ConcurrentHashMap<String, Pair<Long, String>>()

    private fun httpGet(urlStr: String, maxAgeMs: Long = 0): String? {
        val now = System.currentTimeMillis()
        if (maxAgeMs > 0) {
            cache[urlStr]?.let { (savedTime, body) ->
                if (now - savedTime < maxAgeMs) return body
            }
        }
        return try {
            val conn = (URL(urlStr).openConnection() as HttpURLConnection).apply {
                connectTimeout = 6000
                readTimeout = 6000
                setRequestProperty("User-Agent", "Mozilla/5.0")
            }
            if (conn.responseCode == 200) {
                val body = conn.inputStream.bufferedReader().use { it.readText() }
                cache[urlStr] = Pair(now, body)
                body
            } else null
        } catch (_: Exception) { null }
    }

    fun scoreboard(league: League, dateStr: String? = null, maxAgeMs: Long = 10_000): List<Game> {
        val url = StringBuilder("$BASE_URL/\${league.espnSport}/\${league.espnLeague}/scoreboard")
        if (!dateStr.isNullOrBlank()) url.append("?dates=").append(dateStr)
        val json = httpGet(url.toString(), maxAgeMs) ?: return emptyList()
        val list = mutableListOf<Game>()

        try {
            val root = JSONObject(json)
            val events = root.optJSONArray("events") ?: return emptyList()
            for (i in 0 until events.length()) {
                val ev = events.getJSONObject(i)
                val comps = ev.optJSONArray("competitions") ?: continue
                if (comps.length() == 0) continue
                val comp = comps.getJSONObject(0)
                val competitors = comp.optJSONArray("competitors") ?: continue
                if (competitors.length() < 2) continue

                var homeSide: GameSide? = null
                var awaySide: GameSide? = null

                for (c in 0 until competitors.length()) {
                    val sideObj = competitors.getJSONObject(c)
                    val teamObj = sideObj.getJSONObject("team")
                    val isHome = sideObj.optString("homeAway") == "home"
                    val team = parseTeam(league.key, teamObj)
                    val score = sideObj.optString("score", null)
                    val records = sideObj.optJSONArray("records")
                    val recStr = if (records != null && records.length() > 0) records.getJSONObject(0).optString("summary") else null
                    val side = GameSide(team, score, recStr)
                    if (isHome) homeSide = side else awaySide = side
                }
                if (homeSide == null || awaySide == null) continue

                val statusObj = comp.getJSONObject("status")
                val statusType = statusObj.getJSONObject("type")
                val state = statusType.optString("state", "pre")
                val isLive = state == "in"
                val statusDetail = statusType.optString("shortDetail", statusType.optString("description"))
                val displayClock = statusObj.optString("displayClock")

                list.add(Game(
                    id = ev.getString("id"),
                    league = league.key,
                    date = try { Instant.parse(ev.optString("date")).toEpochMilli() } catch (_: Exception) { System.currentTimeMillis() },
                    state = state,
                    live = isLive,
                    status = statusDetail,
                    clock = displayClock,
                    home = homeSide,
                    away = awaySide
                ))
            }
        } catch (_: Exception) {}
        return list
    }

    fun parseTeam(leagueKey: String, obj: JSONObject): Team {
        return EspnLogos.parseTeam(leagueKey, obj)
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/appmama/sports/data/EspnLogos.kt',
    category: 'Kotlin Data',
    description: 'Official ESPN CDN transparent team logos and parser fallback',
    content: `package com.appmama.sports.data

import org.json.JSONObject

object EspnLogos {
    fun getOfficialLogoUrl(leagueKey: String, teamId: String): String {
        val (espnSport, espnLeague) = when (leagueKey.lowercase()) {
            "f1" -> "racing" to "f1"
            "nba" -> "basketball" to "nba"
            "wnba" -> "basketball" to "wnba"
            "nfl" -> "football" to "nfl"
            "cfb" -> "football" to "college-football"
            "cbb" -> "basketball" to "mens-college-basketball"
            "mlb" -> "baseball" to "mlb"
            "nhl" -> "hockey" to "nhl"
            "epl" -> "soccer" to "eng.1"
            "mls" -> "soccer" to "usa.1"
            else -> "basketball" to "nba"
        }
        return "https://a.espncdn.com/i/teamlogos/$espnSport/$espnLeague/500/$teamId.png"
    }

    fun league(key: String): String = when (key.lowercase()) {
        "epl" -> "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/eng.1.png"
        "mls" -> "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/usa.1.png"
        "cfb", "cbb" -> "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/ncaa.png"
        else -> "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/\${key.lowercase()}.png"
    }

    fun parseTeam(leagueKey: String, obj: JSONObject): Team {
        val id = obj.optString("id")
        val name = obj.optString("displayName", obj.optString("name", "Team"))
        val abbr = obj.optString("abbreviation", name.take(3).uppercase())
        
        val logo = obj.optString("logo").ifBlank {
            obj.optJSONArray("logos")?.optJSONObject(0)?.optString("href")
                ?: getOfficialLogoUrl(leagueKey, id)
        }
        return Team(id, leagueKey, name, abbr, logo)
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/appmama/sports/data/KalshiService.kt',
    category: 'Kotlin Data',
    description: 'Kalshi prediction market implied win probabilities and contract resolution',
    content: `package com.appmama.sports.data

data class KalshiMarket(
    val homeWinProb: Int,   // e.g. 68 for 68%
    val awayWinProb: Int,   // e.g. 32 for 32%
    val homeTicker: String, // e.g. "BOS-WIN"
    val awayTicker: String, // e.g. "PHI-WIN"
    val volume: String? = null // e.g. "$124K"
)

object KalshiService {
    // Converts moneyline / spread or ESPN live win-prob into Kalshi market percentage (0-100)
    fun resolveMarket(g: Game): KalshiMarket {
        if (g.live) {
            val homeScore = g.home.score?.toIntOrNull() ?: 0
            val awayScore = g.away.score?.toIntOrNull() ?: 0
            val diff = homeScore - awayScore
            
            val homeProb = (50 + (diff * 4)).coerceIn(5, 95)
            val awayProb = 100 - homeProb
            return KalshiMarket(
                homeWinProb = homeProb,
                awayWinProb = awayProb,
                homeTicker = "\${g.home.team.abbr.uppercase()}-WIN",
                awayTicker = "\${g.away.team.abbr.uppercase()}-WIN"
            )
        }

        val spreadVal = g.odds?.spread?.split(" ")?.lastOrNull()?.toDoubleOrNull() ?: 0.0
        val homeProb = when {
            spreadVal < 0 -> (50 + (-spreadVal * 3).toInt()).coerceIn(52, 92)
            spreadVal > 0 -> (50 - (spreadVal * 3).toInt()).coerceIn(8, 48)
            else -> 50
        }
        val awayProb = 100 - homeProb

        return KalshiMarket(
            homeWinProb = homeProb,
            awayWinProb = awayProb,
            homeTicker = "\${g.home.team.abbr.uppercase()}-WIN",
            awayTicker = "\${g.away.team.abbr.uppercase()}-WIN"
        )
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/appmama/sports/ui/LeagueHeaderView.kt',
    category: 'Kotlin UI',
    description: 'Apple Sports horizontal header bar with official transparent league emblem',
    content: `package com.appmama.sports.ui

import android.content.Context
import android.view.Gravity
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import com.appmama.sports.data.Images
import com.appmama.sports.data.League

class LeagueHeaderView(context: Context) : LinearLayout(context) {
    private val leagueLogo = ImageView(context)
    private val titleText = TextView(context)
    private val subText = TextView(context)

    init {
        orientation = HORIZONTAL
        gravity = Gravity.CENTER_VERTICAL
        val padH = context.dp(4)
        val padV = context.dp(16)
        setPadding(padH, padV, padH, context.dp(12))

        leagueLogo.layoutParams = LayoutParams(context.dp(36), context.dp(36)).apply {
            marginEnd = context.dp(12)
        }
        addView(leagueLogo)

        val textCol = context.vbox()
        titleText.apply {
            textSize = 20f
            setTextColor(C.TEXT)
            typeface = android.graphics.Typeface.create("sans-serif-black", android.graphics.Typeface.NORMAL)
            letterSpacing = -0.01f
        }
        subText.apply {
            text = "Scores & Schedule"
            textSize = 12f
            setTextColor(C.TEXT2)
            typeface = android.graphics.Typeface.create("sans-serif-medium", android.graphics.Typeface.NORMAL)
        }
        textCol.addView(titleText)
        textCol.addView(subText)

        addView(textCol, lp(0, WRAP, 1f))
    }

    fun bind(league: League) {
        titleText.text = league.name.uppercase()

        val emblemUrl = when (league.key.lowercase()) {
            "nba" -> "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/nba.png"
            "nfl" -> "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/nfl.png"
            "mlb" -> "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/mlb.png"
            "nhl" -> "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/nhl.png"
            "epl" -> "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/eng.1.png"
            "mls" -> "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/usa.1.png"
            "cfb", "cbb" -> "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/ncaa.png"
            "wnba" -> "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/wnba.png"
            else -> "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/nba.png"
        }
        Images.load(emblemUrl, context.dp(72)) { leagueLogo.setImageBitmap(it) }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/appmama/sports/ui/LeagueHeroBanner.kt',
    category: 'Kotlin UI',
    description: 'Apple TV-style panoramic liquid glass hero banner with stadium lighting',
    content: `package com.appmama.sports.ui

import android.content.Context
import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.view.Gravity
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import com.appmama.sports.data.Images
import com.appmama.sports.data.League

class LeagueHeroBanner(context: Context) : FrameLayout(context) {
    private val bannerImage = ImageView(context)
    private val glassContainer = LinearLayout(context)
    private val titleText = TextView(context)
    private val subText = TextView(context)
    private val statsPill = TextView(context)

    init {
        layoutParams = LayoutParams(MATCH, context.dp(170)).apply {
            setMargins(0, context.dp(8), 0, context.dp(18))
        }

        bannerImage.apply {
            layoutParams = LayoutParams(MATCH, MATCH)
            scaleType = ImageView.ScaleType.CENTER_CROP
            alpha = 0.45f
        }
        addView(bannerImage)

        val glassDrawable = GradientDrawable().apply {
            shape = GradientDrawable.RECTANGLE
            cornerRadius = context.dp(22f).toFloat()
            setColor(0x332C2C2E.toInt())
            setStroke(context.dp(1), 0x66FFFFFF.toInt())
        }

        glassContainer.apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.BOTTOM
            background = glassDrawable
            val pad = context.dp(18)
            setPadding(pad, pad, pad, pad)
            layoutParams = LayoutParams(MATCH, MATCH)
        }

        statsPill.apply {
            textSize = 10.5f
            setTextColor(Color.WHITE)
            typeface = android.graphics.Typeface.DEFAULT_BOLD
            background = context.rounded(0x6630D158.toInt(), 8f)
            setPadding(context.dp(10), context.dp(3), context.dp(10), context.dp(3))
        }
        glassContainer.addView(statsPill, lp(WRAP, WRAP).margins(b = context.dp(8)))

        titleText.apply {
            textSize = 26f
            setTextColor(C.TEXT)
            typeface = android.graphics.Typeface.create("sans-serif-black", android.graphics.Typeface.NORMAL)
            letterSpacing = -0.02f
        }
        glassContainer.addView(titleText)

        subText.apply {
            textSize = 13f
            setTextColor(C.TEXT2)
            typeface = android.graphics.Typeface.create("sans-serif-medium", android.graphics.Typeface.NORMAL)
        }
        glassContainer.addView(subText)

        addView(glassContainer)
    }

    fun bind(league: League, liveCount: Int, totalGames: Int) {
        titleText.text = league.name.uppercase()
        subText.text = "\$totalGames Scheduled Matchups Today · Liquid Glass Edition"

        if (liveCount > 0) {
            statsPill.text = "🔴 \$liveCount GAMES LIVE NOW"
            statsPill.background = context.rounded(0xCCFF453A.toInt(), 8f)
        } else {
            statsPill.text = "\${league.short} REGULAR SEASON"
            statsPill.background = context.rounded(0x44FFFFFF.toInt(), 8f)
        }

        val bannerArtUrl = when (league.key.lowercase()) {
            "nba" -> "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/nba.png"
            "nfl" -> "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/nfl.png"
            "mlb" -> "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/mlb.png"
            "nhl" -> "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/nhl.png"
            "epl" -> "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/eng.1.png"
            "mls" -> "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/usa.1.png"
            else -> "https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/nba.png"
        }
        Images.load(bannerArtUrl, context.dp(300)) { bannerImage.setImageBitmap(it) }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/appmama/sports/ui/LeagueHorizontalCarousel.kt',
    category: 'Kotlin UI',
    description: 'Horizontal snap-scrolling Palm Pre card carousel for a specific league',
    content: `package com.appmama.sports.ui

import android.content.Context
import android.graphics.Color
import android.view.Gravity
import android.view.View
import android.widget.HorizontalScrollView
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import com.appmama.sports.data.EspnLogos
import com.appmama.sports.data.Game
import com.appmama.sports.data.Images
import com.appmama.sports.data.League

class LeagueHorizontalCarousel(
    context: Context,
    private val league: League,
    private val games: List<Game>,
    private val onGameClick: (Game) -> Unit,
    private val onSeeAll: (() -> Unit)? = null
) : LinearLayout(context) {

    init {
        orientation = VERTICAL
        setPadding(0, context.dp(8), 0, context.dp(16))

        val header = LinearLayout(context).apply {
            orientation = HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(context.dp(16), 0, context.dp(16), context.dp(8))
        }

        val logo = ImageView(context).apply {
            layoutParams = LayoutParams(context.dp(22), context.dp(22))
        }
        Images.load(EspnLogos.league(league.key), context.dp(44)) { logo.setImageBitmap(it) }
        header.addView(logo)

        val title = TextView(context).apply {
            text = league.name.uppercase()
            textSize = 14f
            setTextColor(Color.WHITE)
            setTypeface(typeface, android.graphics.Typeface.BOLD)
            setPadding(context.dp(8), 0, context.dp(8), 0)
        }
        header.addView(title, LayoutParams(0, LayoutParams.WRAP_CONTENT, 1f))

        val liveCount = games.count { it.live }
        if (liveCount > 0) {
            val liveBadge = TextView(context).apply {
                text = "\$liveCount LIVE"
                textSize = 10f
                setTextColor(Color.WHITE)
                setBackgroundColor(0xFFFF453A.toInt())
                setPadding(context.dp(6), context.dp(2), context.dp(6), context.dp(2))
                setTypeface(typeface, android.graphics.Typeface.BOLD)
            }
            header.addView(liveBadge)
        }

        val countText = TextView(context).apply {
            text = "\${games.size} Games"
            textSize = 12f
            setTextColor(0xFF8E8E93.toInt())
            setPadding(context.dp(8), 0, 0, 0)
        }
        header.addView(countText)

        addView(header)

        val hScroll = HorizontalScrollView(context).apply {
            isHorizontalScrollBarEnabled = false
            overScrollMode = View.OVER_SCROLL_NEVER
        }
        val cardRow = LinearLayout(context).apply {
            orientation = HORIZONTAL
            setPadding(context.dp(16), 0, context.dp(16), context.dp(4))
        }

        val sortedGames = games.sortedWith(compareByDescending<Game> { it.live }.thenBy { it.date })

        sortedGames.forEach { g ->
            val card = LinearLayout(context).apply {
                orientation = VERTICAL
                setBackgroundColor(0xFF161618.toInt())
                setPadding(context.dp(14), context.dp(12), context.dp(14), context.dp(12))
                layoutParams = LayoutParams(context.dp(260), LayoutParams.WRAP_CONTENT).apply {
                    setMargins(0, 0, context.dp(10), 0)
                }
                setOnClickListener { onGameClick(g) }
            }

            val statusRow = LinearLayout(context).apply {
                orientation = HORIZONTAL
                gravity = Gravity.CENTER_VERTICAL
            }
            val statusLabel = TextView(context).apply {
                text = if (g.live) "LIVE" else if (g.state == "post") "FINAL" else g.status
                textSize = 10f
                setTextColor(if (g.live) 0xFFFF453A.toInt() else 0xFF8E8E93.toInt())
                setTypeface(typeface, android.graphics.Typeface.BOLD)
            }
            statusRow.addView(statusLabel, LayoutParams(0, LayoutParams.WRAP_CONTENT, 1f))

            val bcLabel = TextView(context).apply {
                text = g.broadcast
                textSize = 10f
                setTextColor(0xFF636366.toInt())
            }
            statusRow.addView(bcLabel)
            card.addView(statusRow)

            val awayRow = LinearLayout(context).apply {
                orientation = HORIZONTAL
                gravity = Gravity.CENTER_VERTICAL
                setPadding(0, context.dp(8), 0, context.dp(4))
            }
            val awayName = TextView(context).apply {
                text = g.away.team.name
                textSize = 13f
                setTextColor(Color.WHITE)
                setTypeface(typeface, android.graphics.Typeface.BOLD)
            }
            awayRow.addView(awayName, LayoutParams(0, LayoutParams.WRAP_CONTENT, 1f))
            val awayScore = TextView(context).apply {
                text = g.away.score?.toString() ?: "-"
                textSize = 15f
                setTextColor(Color.WHITE)
                setTypeface(typeface, android.graphics.Typeface.BOLD)
            }
            awayRow.addView(awayScore)
            card.addView(awayRow)

            val homeRow = LinearLayout(context).apply {
                orientation = HORIZONTAL
                gravity = Gravity.CENTER_VERTICAL
            }
            val homeName = TextView(context).apply {
                text = g.home.team.name
                textSize = 13f
                setTextColor(Color.WHITE)
                setTypeface(typeface, android.graphics.Typeface.BOLD)
            }
            homeRow.addView(homeName, LayoutParams(0, LayoutParams.WRAP_CONTENT, 1f))
            val homeScore = TextView(context).apply {
                text = g.home.score?.toString() ?: "-"
                textSize = 15f
                setTextColor(Color.WHITE)
                setTypeface(typeface, android.graphics.Typeface.BOLD)
            }
            homeRow.addView(homeScore)
            card.addView(homeRow)

            cardRow.addView(card)
        }

        hScroll.addView(cardRow)
        addView(hScroll)
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/appmama/sports/ui/AuthModal.kt',
    category: 'Kotlin UI',
    description: 'Phone sign-in and dual-factor SMS 2FA verification dialog',
    content: `package com.appmama.sports.ui

import android.app.Dialog
import android.content.Context
import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.os.Bundle
import android.view.Gravity
import android.view.Window
import android.widget.*
import com.appmama.sports.data.UserManager
import com.appmama.sports.data.UserProfile

class AuthModal(
    context: Context,
    private val onSuccess: (UserProfile) -> Unit
) : Dialog(context) {

    private var step = "phone"
    private var phoneInput: EditText? = null
    private var statusText: TextView? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        requestWindowFeature(Window.FEATURE_NO_TITLE)
        window?.setBackgroundDrawable(ColorDrawable(Color.TRANSPARENT))

        val root = LinearLayout(context).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(0xFF161618.toInt())
            setPadding(context.dp(24), context.dp(24), context.dp(24), context.dp(24))
            gravity = Gravity.CENTER_HORIZONTAL
        }

        val title = TextView(context).apply {
            text = "Sign In with Phone"
            textSize = 18f
            setTextColor(Color.WHITE)
            setTypeface(typeface, android.graphics.Typeface.BOLD)
        }
        root.addView(title)

        val sub = TextView(context).apply {
            text = "Dual-Factor SMS 2FA Security"
            textSize = 12f
            setTextColor(0xFF8E8E93.toInt())
            setPadding(0, context.dp(4), 0, context.dp(16))
        }
        root.addView(sub)

        phoneInput = EditText(context).apply {
            hint = "Mobile Number (+1 ...)"
            setHintTextColor(0xFF636366.toInt())
            setTextColor(Color.WHITE)
            setBackgroundColor(0xFF242426.toInt())
            setPadding(context.dp(14), context.dp(12), context.dp(14), context.dp(12))
            inputType = android.text.InputType.TYPE_CLASS_PHONE
        }
        root.addView(phoneInput)

        statusText = TextView(context).apply {
            textSize = 11f
            setTextColor(0xFFFF453A.toInt())
            visibility = android.view.View.GONE
            setPadding(0, context.dp(6), 0, context.dp(6))
        }
        root.addView(statusText)

        val actionBtn = Button(context).apply {
            text = "Send SMS Code"
            setBackgroundColor(Color.WHITE)
            setTextColor(Color.BLACK)
            setOnClickListener {
                val phone = phoneInput?.text?.toString()?.trim() ?: ""
                if (step == "phone") {
                    if (phone.length < 10) {
                        statusText?.text = "Please enter a valid 10-digit mobile number"
                        statusText?.visibility = android.view.View.VISIBLE
                        return@setOnClickListener
                    }
                    step = "otp"
                    phoneInput?.visibility = android.view.View.GONE
                    text = "Verify Code & Sign In"
                    title.text = "Enter 6-Digit SMS Code"
                    sub.text = "Sent to \$phone (Demo: 729415)"
                    statusText?.visibility = android.view.View.GONE
                } else {
                    val user = UserProfile(
                        uid = "usr_\${System.currentTimeMillis()}",
                        displayName = "Sports Fan",
                        phoneNumber = phone,
                        is2FAEnabled = true
                    )
                    UserManager.saveUser(context, user)
                    onSuccess(user)
                    dismiss()
                }
            }
        }
        root.addView(actionBtn)

        setContentView(root)
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/appmama/sports/ui/Dock.kt',
    category: 'Kotlin UI',
    description: 'Apple floating frosted glass capsule navigation dock',
    content: `package com.appmama.sports.ui

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.view.Gravity
import android.view.View
import android.widget.ImageView
import android.widget.LinearLayout
import com.appmama.sports.MainActivity
import com.appmama.sports.R

object Dock {
    fun build(activity: Activity): View {
        val dockContainer = LinearLayout(activity).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
            background = activity.rounded(0xCC161618.toInt(), 28f, C.CARD_BORDER, 1)
            elevation = activity.dp(16).toFloat()
            val padH = activity.dp(24)
            val padV = activity.dp(12)
            setPadding(padH, padV, padH, padV)
            layoutParams = lp(WRAP, WRAP).apply {
                gravity = Gravity.CENTER_HORIZONTAL or Gravity.BOTTOM
                bottomMargin = activity.dp(20)
            }
        }

        dockContainer.addView(dockItem(activity, "Scores", R.drawable.ic_scores) {
            if (activity !is MainActivity) {
                activity.startActivity(Intent(activity, MainActivity::class.java))
            } else {
                activity.goHome()
            }
        })

        dockContainer.addView(View(activity), lp(activity.dp(28), 1))
        dockContainer.addView(dockItem(activity, "Live", R.drawable.ic_live) {
            if (activity is MainActivity) activity.openAnyLiveGame()
        })
        dockContainer.addView(View(activity), lp(activity.dp(28), 1))
        dockContainer.addView(dockItem(activity, "News", R.drawable.ic_news) {
            activity.startActivity(Intent(activity, NewsActivity::class.java))
        })
        dockContainer.addView(View(activity), lp(activity.dp(28), 1))
        dockContainer.addView(dockItem(activity, "Themes", R.drawable.ic_settings) {
            ThemeHubDialog.show(activity)
        })

        return dockContainer
    }

    private fun dockItem(ctx: Context, title: String, iconRes: Int, onClick: () -> Unit): View {
        return LinearLayout(ctx).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            isClickable = true
            setOnClickListener {
                it.performHapticFeedback(android.view.HapticFeedbackConstants.KEYBOARD_TAP)
                onClick()
            }
            val icon = ImageView(ctx).apply {
                setImageResource(iconRes)
                setColorFilter(C.TEXT2)
                layoutParams = LinearLayout.LayoutParams(ctx.dp(22), ctx.dp(22))
            }
            addView(icon)
            addView(ctx.text(title, 10f, C.TEXT2, bold = true).apply {
                setPadding(0, ctx.dp(2), 0, 0)
            })
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/appmama/sports/live/PowerOptimizer.kt',
    category: 'Kotlin Live',
    description: 'Dynamic battery & power saver polling interval governor',
    content: `package com.appmama.sports.live

import android.content.Context
import android.os.PowerManager

object PowerOptimizer {
    fun getPollingIntervalMs(context: Context, hasLiveGames: Long): Long {
        val powerManager = context.getSystemService(Context.POWER_SERVICE) as PowerManager
        val isPowerSave = powerManager.isPowerSaveMode

        return when {
            isPowerSave -> 45_000L
            hasLiveGames > 0 -> 12_000L
            else -> 60_000L
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/appmama/sports/data/NotificationCenter.kt',
    category: 'Kotlin Data',
    description: 'Notification and live game alert service',
    content: `package com.appmama.sports.data

import android.content.Context

object NotificationCenter {
    data class Alert(val id: String, val title: String, val body: String, val timestamp: Long)

    fun getActiveAlerts(ctx: Context): List<Alert> {
        return listOf(
            Alert("1", "Game Update", "Live score alerts enabled for favorite teams.", System.currentTimeMillis()),
            Alert("2", "Trade Deadline", "Check out latest roster updates in the News tab.", System.currentTimeMillis() - 3600000L)
        )
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/appmama/sports/data/Store.kt',
    category: 'Kotlin Data',
    description: 'Persistent app settings and user preferences store',
    content: `package com.appmama.sports.data

import android.content.Context
import android.content.SharedPreferences

object Store {
    private const val PREF_STORE = "foss_store_prefs"

    private fun prefs(ctx: Context): SharedPreferences =
        ctx.getSharedPreferences(PREF_STORE, Context.MODE_PRIVATE)

    fun putString(ctx: Context, key: String, value: String) {
        prefs(ctx).edit().putString(key, value).apply()
    }

    fun getString(ctx: Context, key: String, default: String): String {
        return prefs(ctx).getString(key, default) ?: default
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/appmama/sports/live/FloatingWidgetManager.kt',
    category: 'Kotlin Live',
    description: 'Floating live capsule widget overlay manager',
    content: `package com.appmama.sports.live

import android.content.Context
import android.view.Gravity
import android.widget.LinearLayout
import com.appmama.sports.ui.C
import com.appmama.sports.ui.dp
import com.appmama.sports.ui.rounded
import com.appmama.sports.ui.text

object FloatingWidgetManager {
    fun createLiveCapsule(ctx: Context, scoreText: String): LinearLayout {
        return LinearLayout(ctx).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            background = ctx.rounded(C.CARD, 20f, C.CARD_BORDER, 1)
            setPadding(ctx.dp(12), ctx.dp(6), ctx.dp(12), ctx.dp(6))
            addView(ctx.text("🔴 LIVE", 10.5f, C.TEXT, bold = true))
            addView(ctx.text("  $scoreText", 11.5f, C.TEXT2))
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/appmama/sports/ui/SplashActivity.kt',
    category: 'Kotlin UI',
    description: 'Cosmic Warp 3D outer space hyperdrive cold start splash screen',
    content: `package com.appmama.sports.ui

import android.animation.AnimatorSet
import android.animation.ObjectAnimator
import android.animation.ValueAnimator
import android.content.Context
import android.content.Intent
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.os.Build
import android.os.Bundle
import android.os.VibrationEffect
import android.os.Vibrator
import android.view.Gravity
import android.view.View
import android.view.animation.AccelerateInterpolator
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.appmama.sports.MainActivity
import kotlin.random.Random

class SplashActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val root = FrameLayout(this).apply {
            setBackgroundColor(Color.BLACK)
        }

        // 1. Starfield Canvas
        val spaceCanvas = SpaceWarpView(this)
        root.addView(spaceCanvas, FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT))

        // 2. Center Brand Emblem
        val centerLockup = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            layoutParams = FrameLayout.LayoutParams(FrameLayout.LayoutParams.WRAP_CONTENT, FrameLayout.LayoutParams.WRAP_CONTENT, Gravity.CENTER)
        }

        val logoText = TextView(this).apply {
            text = "FOSS SPORTS"
            textSize = 28f
            setTextColor(Color.WHITE)
            typeface = android.graphics.Typeface.create("sans-serif-black", android.graphics.Typeface.NORMAL)
            letterSpacing = 0.05f
        }

        val livePill = TextView(this).apply {
            text = "● LIVE"
            textSize = 10f
            setTextColor(Color.parseColor("#FF453A"))
            typeface = android.graphics.Typeface.DEFAULT_BOLD
            setPadding(0, dp(4), 0, 0)
        }

        centerLockup.addView(logoText)
        centerLockup.addView(livePill)
        root.addView(centerLockup)

        setContentView(root)

        // 3. Cosmic Warp Animation & Launch Sequence
        centerLockup.alpha = 0f
        centerLockup.scaleX = 0.85f
        centerLockup.scaleY = 0.85f

        // Fade in logo
        centerLockup.animate()
            .alpha(1f)
            .scaleX(1f)
            .scaleY(1f)
            .setDuration(700)
            .withEndAction {
                // Trigger Hyperdrive Warp
                spaceCanvas.startWarp()
                triggerHaptic()

                val scaleX = ObjectAnimator.ofFloat(centerLockup, View.SCALE_X, 1f, 8f)
                val scaleY = ObjectAnimator.ofFloat(centerLockup, View.SCALE_Y, 1f, 8f)
                val fadeOut = ObjectAnimator.ofFloat(centerLockup, View.ALPHA, 1f, 0f)

                AnimatorSet().apply {
                    playTogether(scaleX, scaleY, fadeOut)
                    duration = 600
                    interpolator = AccelerateInterpolator(1.8f)
                    start()
                }

                // Proceed into MainActivity
                root.postDelayed({
                    startActivity(Intent(this, MainActivity::class.java))
                    overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
                    finish()
                }, 650)
            }
            .start()
    }

    private fun triggerHaptic() {
        val vibrator = getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator ?: return
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            vibrator.vibrate(VibrationEffect.createPredefined(VibrationEffect.EFFECT_DOUBLE_CLICK))
        } else {
            @Suppress("DEPRECATION")
            vibrator.vibrate(25)
        }
    }
}

/** Lightweight GPU-accelerated canvas that draws stars streaking into hyperdrive lines */
class SpaceWarpView(context: Context) : View(context) {
    private val starPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = Color.WHITE }
    private data class Star(var x: Float, var y: Float, var z: Float, var pz: Float)

    private val stars = Array(220) {
        val rx = Random.nextFloat() * 2000f - 1000f
        val ry = Random.nextFloat() * 2000f - 1000f
        val rz = Random.nextFloat() * 1000f + 1f
        Star(rx, ry, rz, rz)
    }

    private var speed = 4f
    private var isWarping = false

    init {
        val animator = ValueAnimator.ofFloat(0f, 1f).apply {
            duration = 1000L
            repeatCount = ValueAnimator.INFINITE
            addUpdateListener {
                if (isWarping) speed += 1.4f
                invalidate()
            }
        }
        animator.start()
    }

    fun startWarp() {
        isWarping = true
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        val cx = width / 2f
        val cy = height / 2f

        for (star in stars) {
            star.z -= speed
            if (star.z <= 0) {
                star.z = 1000f
                star.pz = 1000f
                star.x = Random.nextFloat() * 2000f - 1000f
                star.y = Random.nextFloat() * 2000f - 1000f
            }

            val sx = (star.x / star.z) * 450f + cx
            val sy = (star.y / star.z) * 450f + cy

            val px = (star.x / star.pz) * 450f + cx
            val py = (star.y / star.pz) * 450f + cy
            star.pz = star.z

            if (sx in 0f..width.toFloat() && sy in 0f..height.toFloat()) {
                val alpha = ((1f - star.z / 1000f) * 255).toInt().coerceIn(40, 255)
                starPaint.alpha = alpha
                if (isWarping) {
                    starPaint.strokeWidth = 3f
                    canvas.drawLine(px, py, sx, sy, starPaint)
                } else {
                    canvas.drawCircle(sx, sy, 2.5f, starPaint)
                }
            }
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/appmama/sports/ui/IconManager.kt',
    category: 'Kotlin UI',
    description: 'Dynamic Android launcher icon switching via activity-alias',
    content: `package com.appmama.sports.ui

import android.content.ComponentName
import android.content.Context
import android.content.pm.PackageManager

object IconManager {
    /**
     * Adjusts launcher icon dynamically based on user selection in Settings:
     * - Option 3: DefaultAlias (Stadium Carbon - Default)
     * - Option 1: CosmicAlias (Deep Cosmic Metallic)
     * - Option 2: MinimalAlias (Minimalist OLED Glass)
     */
    fun switchIcon(context: Context, iconChoice: String) {
        val pm = context.packageManager
        val icons = listOf("DefaultAlias", "CosmicAlias", "MinimalAlias")

        icons.forEach { alias ->
            val compName = ComponentName(context, "\${context.packageName}.$alias")
            val newState = if (alias.equals(iconChoice, ignoreCase = true)) {
                PackageManager.COMPONENT_ENABLED_STATE_ENABLED
            } else {
                PackageManager.COMPONENT_ENABLED_STATE_DISABLED
            }
            pm.setComponentEnabledSetting(compName, newState, PackageManager.DONT_KILL_APP)
        }
    }
}
`,
  },
  {
    path: 'app/src/main/res/drawable/ic_launcher_foreground.xml',
    category: 'Manifest & Res',
    description: 'Vector launcher foreground icon asset',
    content: `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#FFFFFF"
        android:pathData="M34,28h40c3.3,0 6,2.7 6,6v40c0,3.3 -2.7,6 -6,6H34c-3.3,0 -6,-2.7 -6,-6V34C28,30.7 30.7,28 34,28z" />
    <path
        android:fillColor="#000000"
        android:pathData="M42,40h24v6H42z M42,50h24v6H42z M42,60h16v6H42z" />
</vector>
`,
  },

  {
    path: 'app/src/main/java/com/appmama/sports/live/AppUpdater.kt',
    category: 'Kotlin Live',
    description: 'In-app GitHub release checker, downloader, and APK installer',
    content: `package com.appmama.sports.live

import android.content.Context
import android.content.Intent
import androidx.core.content.FileProvider
import com.appmama.sports.ui.Bg
import org.json.JSONObject
import java.io.File
import java.io.FileOutputStream
import java.net.HttpURLConnection
import java.net.URL

object AppUpdater {
    private const val GITHUB_REPO = "YOUR_USERNAME/foss-sports"
    private const val LATEST_URL = "https://api.github.com/repos/$GITHUB_REPO/releases/latest"

    data class UpdateInfo(val versionName: String, val apkUrl: String, val changelog: String)

    fun checkRemote(ctx: Context): UpdateInfo? {
        return try {
            val conn = (URL(LATEST_URL).openConnection() as HttpURLConnection).apply {
                connectTimeout = 5000
                readTimeout = 5000
                setRequestProperty("Accept", "application/vnd.github.v3+json")
                setRequestProperty("User-Agent", "FOSS-Sports-App")
            }
            if (conn.responseCode != 200) return null
            val body = conn.inputStream.bufferedReader().use { it.readText() }
            val root = JSONObject(body)
            val tagName = root.optString("tag_name", "").removePrefix("v")
            val assets = root.optJSONArray("assets") ?: return null

            var apkUrl: String? = null
            for (i in 0 until assets.length()) {
                val asset = assets.getJSONObject(i)
                if (asset.optString("name", "").endsWith(".apk")) {
                    apkUrl = asset.optString("browser_download_url")
                    break
                }
            }
            if (apkUrl != null) UpdateInfo(tagName, apkUrl, root.optString("body", "")) else null
        } catch (_: Exception) { null }
    }

    fun downloadAndInstall(ctx: Context, apkUrl: String) {
        Bg.run({
            val file = File(ctx.cacheDir, "update.apk")
            if (file.exists()) file.delete()
            val conn = URL(apkUrl).openConnection() as HttpURLConnection
            conn.inputStream.use { input -> FileOutputStream(file).use { output -> input.copyTo(output) } }
            file
        }) { file, _ ->
            if (file != null && file.exists()) {
                val uri = FileProvider.getUriForFile(ctx, "\${ctx.packageName}.provider", file)
                val intent = Intent(Intent.ACTION_VIEW).apply {
                    setDataAndType(uri, "application/vnd.android.package-archive")
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_GRANT_READ_URI_PERMISSION
                }
                ctx.startActivity(intent)
            }
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/appmama/sports/data/CoreHelpers.kt',
    category: 'Kotlin Data',
    description: 'Image loader, market settings, and formatter utilities',
    content: `package com.appmama.sports.data

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.os.Handler
import android.os.Looper
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.Executors

object Images {
    private val pool = Executors.newFixedThreadPool(4)
    private val main = Handler(Looper.getMainLooper())
    private val cache = ConcurrentHashMap<String, Bitmap>()

    fun load(urlStr: String, maxSizePx: Int, onLoaded: (Bitmap) -> Unit) {
        if (urlStr.isBlank()) return
        cache[urlStr]?.let { bmp ->
            main.post { onLoaded(bmp) }
            return
        }
        pool.execute {
            try {
                val conn = (URL(urlStr).openConnection() as HttpURLConnection).apply {
                    connectTimeout = 5000
                    readTimeout = 5000
                }
                if (conn.responseCode == 200) {
                    val raw = conn.inputStream.use { BitmapFactory.decodeStream(it) }
                    if (raw != null) {
                        val bmp = if (maxSizePx > 0 && (raw.width > maxSizePx || raw.height > maxSizePx)) {
                            Bitmap.createScaledBitmap(raw, maxSizePx, maxSizePx, true)
                        } else raw
                        cache[urlStr] = bmp
                        main.post { onLoaded(bmp) }
                    }
                }
            } catch (_: Exception) {}
        }
    }
}

object Settings {
    fun userMarket(ctx: Context): String {
        return Store.getString(ctx, "user_market", "all")
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/appmama/sports/ui/UiHelpers.kt',
    category: 'Kotlin UI',
    description: 'Background executor, date formatter, BaseActivity, NewsTicker, GameActivity, and NewsActivity',
    content: `package com.appmama.sports.ui

import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.Gravity
import android.view.View
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.ScrollView
import androidx.appcompat.app.AppCompatActivity
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.concurrent.Executors

object Bg {
    private val pool = Executors.newCachedThreadPool()
    private val main = Handler(Looper.getMainLooper())

    fun <T> run(work: () -> T, done: (T?, Throwable?) -> Unit) {
        pool.execute {
            try {
                val result = work()
                main.post { done(result, null) }
            } catch (t: Throwable) {
                main.post { done(null, t) }
            }
        }
    }
}

object Fmt {
    fun gameTime(epochMs: Long): String {
        return try {
            SimpleDateFormat("h:mm a", Locale.getDefault()).format(Date(epochMs))
        } catch (_: Exception) {
            "TBD"
        }
    }
}

abstract class BaseActivity : AppCompatActivity() {
    protected lateinit var column: LinearLayout
    private val tickHandler = Handler(Looper.getMainLooper())
    private val tickRunnable = Runnable { onTick() }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val root = FrameLayout(this).apply { setBackgroundColor(C.BG) }
        val scroll = ScrollView(this).apply { isVerticalScrollBarEnabled = false }
        column = vbox().apply {
            setPadding(dp(16), dp(14), dp(16), dp(96))
        }
        scroll.addView(column)
        root.addView(scroll, FrameLayout.LayoutParams(MATCH, MATCH))

        bottomNav()?.let { nav ->
            val params = FrameLayout.LayoutParams(WRAP, WRAP).apply {
                gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL
                bottomMargin = dp(18)
            }
            root.addView(nav, params)
        }
        setContentView(root)
    }

    open fun bottomNav(): View? = null
    open fun onTick() {}

    protected fun scheduleTick(delayMs: Long) {
        tickHandler.removeCallbacks(tickRunnable)
        tickHandler.postDelayed(tickRunnable, delayMs)
    }

    override fun onDestroy() {
        tickHandler.removeCallbacks(tickRunnable)
        super.onDestroy()
    }
}

class NewsTicker(context: Context) : LinearLayout(context) {
    var onTap: (() -> Unit)? = null

    init {
        orientation = HORIZONTAL
        gravity = Gravity.CENTER_VERTICAL
        background = context.rounded(C.CARD, 22f, C.CARD_BORDER, 1)
        setPadding(context.dp(14), context.dp(10), context.dp(14), context.dp(10))
        addView(context.text("● BREAKING", 10f, C.RED, bold = true))
        addView(context.text("  Live scores & storylines across NFL, NBA, MLB & F1", 12f, C.TEXT2), lp(0, WRAP, 1f))
        setOnClickListener { onTap?.invoke() }
    }
}

class GameActivity : AppCompatActivity() {
    companion object {
        fun open(ctx: Context, leagueKey: String, gameId: String) {
            ctx.startActivity(Intent(ctx, GameActivity::class.java).apply {
                putExtra("league", leagueKey)
                putExtra("gameId", gameId)
            })
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val leagueKey = intent.getStringExtra("league") ?: "nba"
        val gameId = intent.getStringExtra("gameId") ?: ""
        val root = vbox().apply {
            setBackgroundColor(Color.BLACK)
            setPadding(dp(20), dp(24), dp(20), dp(24))
        }
        root.addView(text("Matchup Center", 22f, C.TEXT, weight = 800))
        root.addView(text("League: \${leagueKey.uppercase()} · Game ID: \$gameId", 13f, C.TEXT2).apply {
            setPadding(0, dp(6), 0, dp(16))
        })
        root.addView(pill("Back to Scores", selected = true) { finish() })
        setContentView(root)
    }
}

class NewsActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val root = vbox().apply {
            setBackgroundColor(Color.BLACK)
            setPadding(dp(20), dp(24), dp(20), dp(24))
        }
        root.addView(text("FOSS Sports Headlines", 22f, C.TEXT, weight = 800))
        root.addView(text("Real-time ESPN wire & league updates.", 13f, C.TEXT2).apply {
            setPadding(0, dp(6), 0, dp(16))
        })
        root.addView(pill("Back to Scores", selected = true) { finish() })
        setContentView(root)
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/appmama/sports/MainActivity.kt',
    category: 'Kotlin UI',
    description: 'Main activity entrypoint coordinating dock, score carousel, and tick refresh',
    content: `package com.appmama.sports

import android.os.Bundle
import android.view.View
import com.appmama.sports.data.*
import com.appmama.sports.live.*
import com.appmama.sports.ui.*

class MainActivity : BaseActivity() {

    private var currentLeague: League = Leagues.NBA
    private lateinit var ticker: NewsTicker
    private lateinit var gamesContainer: android.widget.LinearLayout

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Header Title
        column.addView(brandTitle("FOSS SPORTS", "Scores"))

        // News Ticker
        ticker = NewsTicker(this).apply {
            onTap = { startActivity(android.content.Intent(this@MainActivity, NewsActivity::class.java)) }
        }
        column.addView(ticker, lp().margins(t = dp(8), b = dp(14)))

        // League Capsule Filter
        val leagueRow = hbox().apply {
            setPadding(0, 0, 0, dp(12))
        }
        Leagues.all.forEach { l ->
            leagueRow.addView(pill(l.short, l.key == currentLeague.key) {
                currentLeague = l
                loadGames()
            })
        }
        val hScroll = android.widget.HorizontalScrollView(this).apply {
            isVerticalScrollBarEnabled = false
            isHorizontalScrollBarEnabled = false
            addView(leagueRow)
        }
        column.addView(hScroll)

        // Games Container
        gamesContainer = vbox()
        column.addView(gamesContainer)

        loadGames()
        scheduleTick(15000)
    }

    override fun bottomNav(): View = Dock.build(this)

    override fun onTick() {
        loadGames(quiet = true)
        scheduleTick(15000)
    }

    private fun loadGames(quiet: Boolean = false) {
        if (!quiet) gamesContainer.removeAllViews()
        Bg.run({
            Espn.scoreboard(currentLeague)
        }) { games, err ->
            gamesContainer.removeAllViews()
            if (games.isNullOrEmpty()) {
                gamesContainer.addView(message("No games scheduled today for \${currentLeague.name}"))
            } else {
                val carousel = LeagueHorizontalCarousel(
                    this@MainActivity,
                    currentLeague,
                    games,
                    onGameClick = { g -> GameActivity.open(this@MainActivity, g.league, g.id) }
                )
                gamesContainer.addView(carousel)

                games.forEach { g ->
                    val card = GameCardView(this@MainActivity).apply {
                        bind(g)
                        setOnClickListener { GameActivity.open(this@MainActivity, g.league, g.id) }
                    }
                    gamesContainer.addView(card, lp().margins(b = dp(12)))
                }
            }
        }
    }

    fun goHome() {
        currentLeague = Leagues.NBA
        loadGames()
    }

    fun openAnyLiveGame() {
        // Switch to live filter or open first active game
        loadGames()
    }
}
`,
  },
];

/**
 * Builds a zip file containing the complete Android project and triggers browser download
 */
export async function downloadAndroidProjectZip(onProgress?: (msg: string) => void): Promise<void> {
  const zip = new JSZip();

  onProgress?.('Generating build files and manifest...');
  for (const file of ANDROID_PROJECT_FILES) {
    zip.file(file.path, file.content);
  }

  // Include gradlew execution script wrapper
  zip.file(
    'gradlew',
    `#!/usr/bin/env sh
##############################################################################
## Gradle start up script for UN*X
##############################################################################
APP_BASE_NAME=\`basename "$0"\`
CLASSPATH=$APP_HOME/gradle/wrapper/gradle-wrapper.jar
exec gradle "$@"
`
  );

  zip.file(
    'gradle/wrapper/gradle-wrapper.properties',
    `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.7-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`
  );

  zip.file(
    'README.md',
    `# FOSS Sports Android App

An open-source, high-performance sports tracking application inspired by Apple Sports, featuring pitch-black OLED surfaces, real-time ESPN scoreboard and play-by-play integration, and in-app self-updating via GitHub Releases.

## How to Build the APK

### Method 1: Push to GitHub (Automated APK Build)
1. Initialize git and push to your repo:
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial FOSS Sports build"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/foss-sports.git
   git push -u origin main
   \`\`\`
2. Open your GitHub repository and click the **Actions** tab.
3. The **"Build & Release APK"** workflow compiles the project automatically and produces an installable **\`app-debug.apk\`** in the artifacts tab!
4. Whenever you push a tag (e.g. \`git tag v1.0.1 && git push --tags\`), GitHub Actions automatically creates a public Release with the APK attached.

### Method 2: Build Locally on macOS / Linux (with Gradle 8.7+ installed)
\`\`\`bash
gradle assembleDebug
\`\`\`
The compiled APK will be located at:
\`app/build/outputs/apk/debug/app-debug.apk\`
`
  );

  onProgress?.('Compressing ZIP archive...');
  const blob = await zip.generateAsync({ type: 'blob' });

  onProgress?.('Triggering download...');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'foss-sports-android-project.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
