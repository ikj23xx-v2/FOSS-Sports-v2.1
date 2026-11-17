import React, { useState } from 'react';
import {
  X,
  Download,
  Terminal,
  FileCode,
  Github,
  CheckCircle2,
  Copy,
  Smartphone,
  Layers,
  AlertCircle,
} from 'lucide-react';
import { sounds } from '../services/sound';
import {
  ANDROID_PROJECT_FILES,
  downloadAndroidProjectZip,
} from '../services/exportAndroid';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface ApkExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkExportModal: React.FC<ApkExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'pwa' | 'build' | 'code'>('pwa');
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [gitCopied, setGitCopied] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const [installFeedback, setInstallFeedback] = useState<string | null>(null);

  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  if (!isOpen) return null;

  const currentFile = ANDROID_PROJECT_FILES[selectedFileIndex] || ANDROID_PROJECT_FILES[0];

  const handleInstallNow = async () => {
    sounds.playTap();
    const accepted = await install();
    if (accepted) {
      setInstallFeedback('FOSS Sports installed to your device home screen.');
    } else {
      setInstallFeedback('If no prompt appeared, open Chrome menu (⋮) and tap "Install app".');
    }
  };

  const handleCopyCurrentUrl = () => {
    sounds.playTap();
    const targetUrl = typeof window !== 'undefined' ? window.location.origin : '';
    if (targetUrl && navigator.clipboard) {
      navigator.clipboard.writeText(targetUrl);
      setUrlCopied(true);
      setTimeout(() => setUrlCopied(false), 2000);
    }
  };

  const handleDownloadZip = async () => {
    sounds.playTap();
    setIsExporting(true);
    try {
      await downloadAndroidProjectZip((msg) => setExportStatus(msg));
      setExportStatus('Android project ZIP downloaded! Push to GitHub to compile app-debug.apk.');
      setTimeout(() => setExportStatus(null), 4000);
    } catch (err) {
      console.error(err);
      setExportStatus('Export failed, please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyCode = () => {
    sounds.playTap();
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const gitSnippet = `# 1. Unzip the downloaded Android project
unzip foss-sports-android-project.zip -d foss-sports
cd foss-sports

# 2. Push to your GitHub repo (no local Android SDK needed)
git init
git add .
git commit -m "feat: initial FOSS Sports foldable build"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/foss-sports.git
git push -u origin main

# 3. GitHub Actions builds app-debug.apk automatically!
# Open your repo -> 'Actions' tab -> Download 'foss-sports-debug-apk' on your Moto Razr Fold`;

  const handleCopyGit = () => {
    sounds.playTap();
    navigator.clipboard.writeText(gitSnippet);
    setGitCopied(true);
    setTimeout(() => setGitCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div
        className="relative w-full max-w-4xl bg-[#161618] border border-[#2A2A2E] rounded-[24px] max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#2A2A2E] flex items-center justify-between shrink-0 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-black text-sm">
              APK
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                Install on Android & APK Builder
              </h2>
              <p className="text-xs text-neutral-400">
                Install directly on Moto Razr Fold via Chrome WebAPK or compile native APK via GitHub Actions
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 pb-2 border-b border-[#2A2A2E] bg-neutral-900/40 text-xs font-semibold shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              sounds.playTap();
              setActiveTab('pwa');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'pwa'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Install on Moto Razr Fold
          </button>
          <button
            onClick={() => {
              sounds.playTap();
              setActiveTab('build');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'build'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            Compile Native APK (.zip)
          </button>
          <button
            onClick={() => {
              sounds.playTap();
              setActiveTab('code');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'code'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            Kotlin Source ({ANDROID_PROJECT_FILES.length} Files)
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'pwa' && (
            <div className="max-w-2xl mx-auto space-y-5">
              {/* Instant WebAPK Install Hero */}
              <div className="bg-gradient-to-br from-emerald-950/40 via-neutral-900 to-neutral-950 border border-emerald-500/25 rounded-2xl p-5 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                      <Smartphone className="w-3 h-3" />
                      Moto Razr Fold Cover & Inner Display Ready
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      {isInstalled
                        ? 'FOSS Sports is Installed on Your Device'
                        : 'Install FOSS Sports Right Now (Android WebAPK)'}
                    </h3>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      Android Chrome compiles a signed WebAPK directly onto your Moto Razr Fold home screen & app drawer with offline caching, OLED full-screen mode, and outer-to-inner fold continuity.
                    </p>
                  </div>

                  {!isInstalled && isInstallable && (
                    <button
                      onClick={handleInstallNow}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-[#30D158] hover:bg-emerald-400 active:scale-95 text-black font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20 shrink-0 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Install App Now</span>
                    </button>
                  )}

                  {isInstalled && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Running Installed</span>
                    </div>
                  )}
                </div>

                {installFeedback && (
                  <p className="text-xs text-emerald-300 font-medium bg-black/40 border border-emerald-500/20 rounded-xl px-3 py-2">
                    {installFeedback}
                  </p>
                )}

                {!isInstallable && !isInstalled && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-white/10">
                    <p className="text-[11px] text-neutral-400">
                      {isIOS
                        ? 'In Safari: tap Share (⎋) then "Add to Home Screen".'
                        : 'Open this link directly in Android Chrome (not an in-app browser) to see the "Install app" prompt.'}
                    </p>
                    <button
                      onClick={handleCopyCurrentUrl}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition cursor-pointer shrink-0"
                    >
                      {urlCopied ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>URL Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy App Link</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Step by step for Moto Razr Fold */}
              <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Moto Razr Fold Chrome Install Steps
                </h4>
                <div className="space-y-3 text-xs text-neutral-300">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-neutral-800 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-white">Open this app URL in Google Chrome on your Moto Razr Fold</p>
                      <p className="text-neutral-400 text-[11px]">Works from either the outer cover display or the unfolded main screen</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-neutral-800 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-white">Tap "Install App Now" above or tap Chrome Menu (⋮) → "Add to home screen" → "Install"</p>
                      <p className="text-neutral-400 text-[11px]">Android generates and installs the standalone app package automatically</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-neutral-800 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <p className="font-semibold text-white">Want a standalone sideload `.apk` file instead?</p>
                      <p className="text-neutral-400 text-[11px]">
                        Switch to the <button onClick={() => setActiveTab('build')} className="text-white underline font-semibold cursor-pointer">Compile Native APK</button> tab to download the Kotlin project ZIP and build `app-debug.apk` in ~2 minutes using GitHub Actions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'build' && (
            <div className="space-y-6">
              {/* Honest Note on APK Compilation */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-100/90 leading-relaxed">
                  A binary <code className="font-mono text-white font-bold">.apk</code> must be compiled by the Android SDK & Gradle (not inside a browser). Download the ready-to-build Kotlin project ZIP below and push it to GitHub — the included workflow compiles <code className="font-mono text-white font-bold">app-debug.apk</code> in the cloud for free so you can download it straight onto your Moto Razr Fold.
                </p>
              </div>

              {/* Primary Download Banner */}
              <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    Moto Razr Fold Continuity & Android 14+ Ready
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Download Complete Android Project (.zip)
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
                    Includes Kotlin UI, ESPN parser, <code className="text-neutral-300">androidx.window</code> foldable manifest config, and the automated GitHub Actions APK workflow.
                  </p>
                </div>

                <button
                  onClick={handleDownloadZip}
                  disabled={isExporting}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-neutral-200 active:scale-95 text-black font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-white/10 shrink-0 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>{isExporting ? 'Bundling...' : 'Download Project ZIP'}</span>
                </button>
              </div>

              {exportStatus && (
                <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl text-center text-xs text-neutral-300 animate-fade-in">
                  {exportStatus}
                </div>
              )}

              {/* Two Methods to get the compiled APK */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Method 1: GitHub Actions Cloud Build */}
                <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
                      <Github className="w-4 h-4" />
                      <span>Method 1: GitHub Actions (No PC Android Studio)</span>
                    </div>
                    <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
                      GitHub runners come with Android SDK & Gradle pre-configured. Push this ZIP to a GitHub repo and download <span className="text-white font-mono font-bold">app-debug.apk</span> directly from the Actions tab on your phone.
                    </p>
                    <div className="space-y-2 text-xs text-neutral-300">
                      <div className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-neutral-800 text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">1</span>
                        <span>Extract the downloaded project ZIP into a folder.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-neutral-800 text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">2</span>
                        <span>Push to your GitHub repository.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-neutral-800 text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">3</span>
                        <span>Open <strong>Actions → foss-sports-debug-apk</strong> on your Moto Razr Fold and install!</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-neutral-800">
                    <button
                      onClick={handleCopyGit}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {gitCopied ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied Terminal Script!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Git Push Commands</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Method 2: Local macOS / Linux Terminal */}
                <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
                      <Terminal className="w-4 h-4" />
                      <span>Method 2: Compile Locally with Gradle</span>
                    </div>
                    <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
                      If you have Java 17+, Gradle 8.7+, and Android SDK installed locally, compile the APK directly in Terminal:
                    </p>
                    <div className="bg-black/80 rounded-xl p-3 border border-neutral-800 font-mono text-[11px] text-neutral-300 space-y-1">
                      <p className="text-neutral-500"># Run inside unzipped folder</p>
                      <p className="text-emerald-400">gradle assembleDebug</p>
                      <p className="text-neutral-500 pt-1"># Output APK location:</p>
                      <p className="text-amber-300 break-all">app/build/outputs/apk/debug/app-debug.apk</p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-neutral-800">
                    <p className="text-[11px] text-neutral-400">
                      Install to Moto Razr Fold via USB: <code className="text-white">adb install app-debug.apk</code>
                    </p>
                  </div>
                </div>
              </div>

              {/* GitHub Actions workflow preview snippet */}
              <div className="bg-black/60 rounded-2xl border border-neutral-800 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-300">
                    <Layers className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Included Workflow: .github/workflows/build.yml</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                    Gradle 8.7 Cloud Runner
                  </span>
                </div>
                <pre className="text-[11px] font-mono text-neutral-400 bg-neutral-950 p-3 rounded-xl overflow-x-auto max-h-40">
                  {`name: Build & Release APK
on: [push, pull_request, workflow_dispatch]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { java-version: '17', distribution: 'temurin' }
      - uses: android-actions/setup-android@v3
      - uses: gradle/actions/setup-gradle@v4
        with: { gradle-version: '8.7' }
      - run: gradle assembleDebug --stacktrace
      - uses: actions/upload-artifact@v4
        with: { name: foss-sports-debug-apk, path: app/build/outputs/apk/debug/app-debug.apk }`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* File list */}
              <div className="space-y-1.5 md:col-span-1 max-h-[500px] overflow-y-auto no-scrollbar pr-1">
                {ANDROID_PROJECT_FILES.map((file, i) => (
                  <button
                    key={file.path}
                    onClick={() => {
                      sounds.playTap();
                      setSelectedFileIndex(i);
                    }}
                    className={`w-full text-left p-3 rounded-xl text-xs transition-all cursor-pointer ${
                      selectedFileIndex === i
                        ? 'bg-neutral-800 text-white font-bold border border-neutral-700'
                        : 'bg-neutral-900/50 text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-mono text-[11px] truncate">{file.path}</span>
                    </div>
                    <span className="text-[10px] text-neutral-500 font-sans block truncate">
                      {file.description}
                    </span>
                  </button>
                ))}
              </div>

              {/* Code viewer */}
              <div className="md:col-span-2 bg-black/90 rounded-2xl border border-neutral-800 p-4 flex flex-col max-h-[500px]">
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-neutral-800 shrink-0">
                  <div className="min-w-0">
                    <p className="text-xs font-mono font-bold text-white truncate">
                      {currentFile.path}
                    </p>
                    <p className="text-[11px] text-neutral-400 truncate">
                      {currentFile.description}
                    </p>
                  </div>

                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium rounded-lg transition-colors shrink-0 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy File</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex-1 overflow-auto rounded-lg bg-neutral-950 p-3">
                  <pre className="text-xs font-mono text-neutral-300 leading-relaxed">
                    {currentFile.content}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
