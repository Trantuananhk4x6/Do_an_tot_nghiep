import { TTSService } from './ttsService';

class SpeechSynthesisManager {
  private static instance: SpeechSynthesisManager;
  private eventListeners: { [key: string]: Function[] } = {};
  private synthesis: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.synthesis = window.speechSynthesis;
    }
  }

  static getInstance(): SpeechSynthesisManager {
    if (!this.instance) {
      this.instance = new SpeechSynthesisManager();
    }
    return this.instance;
  }

  async speak(text: string, voiceGender?: string, language?: string): Promise<void> {
    if (!text || !text.trim()) {
      console.warn('No text to speak');
      return;
    }

    console.log('🔊 SpeechSynthesis.speak called with:', { 
      text: text.substring(0, 50) + '...', 
      voiceGender, 
      language 
    });

    return new Promise((resolve, reject) => {
      try {
        // Dừng speech hiện tại
        this.stop();

        const utterance = new SpeechSynthesisUtterance(text.trim());
        this.currentUtterance = utterance;

        // Language code mapping
        const languageCodes: Record<string, string> = {
          vi: 'vi-VN',
          en: 'en-US',
          ja: 'ja-JP',
          zh: 'zh-CN',
          ko: 'ko-KR',
        };
        const targetLang = languageCodes[language || 'en'] || 'en-US';
        
        console.log('🌐 Language mapping:', { 
          inputLanguage: language, 
          mappedCode: targetLang,
          allCodes: languageCodes 
        });

        // Đợi voices load xong
        const setVoice = () => {
          const voices = this.synthesis.getVoices();
          console.log('Available voices:', voices.map(v => ({ name: v.name, gender: v.name, lang: v.lang })));

          if (voices.length > 0) {
            let selectedVoice;

            // Ưu tiên tìm voice theo ngôn ngữ trước
            const languageVoices = voices.filter(voice => voice.lang.startsWith(targetLang.split('-')[0]));
            
            if (languageVoices.length > 0) {
              // ✅ Ưu tiên giọng Google/Microsoft cho tiếng Việt (chất lượng cao nhất)
              if (targetLang === 'vi-VN') {
                if (voiceGender === 'female') {
                  // Ưu tiên: Google Vietnamese Female > Microsoft Vietnamese Female > Bất kỳ female Vietnamese nào
                  selectedVoice = languageVoices.find(voice => 
                    voice.name.toLowerCase().includes('google') && voice.name.toLowerCase().includes('female')
                  ) || languageVoices.find(voice => 
                    voice.name.toLowerCase().includes('microsoft') && voice.name.toLowerCase().includes('female')
                  ) || languageVoices.find(voice => 
                    voice.name.toLowerCase().includes('female') ||
                    voice.name.toLowerCase().includes('linh') ||
                    voice.name.toLowerCase().includes('chi')
                  );
                } else if (voiceGender === 'male') {
                  selectedVoice = languageVoices.find(voice => 
                    voice.name.toLowerCase().includes('google') && voice.name.toLowerCase().includes('male')
                  ) || languageVoices.find(voice => 
                    voice.name.toLowerCase().includes('microsoft') && voice.name.toLowerCase().includes('male')
                  ) || languageVoices.find(voice => 
                    voice.name.toLowerCase().includes('male') ||
                    voice.name.toLowerCase().includes('nam') ||
                    voice.name.toLowerCase().includes('hoang')
                  );
                }
              } else {
                // Ngôn ngữ khác (English, Japanese, etc.)
                if (voiceGender === 'female') {
                  selectedVoice = languageVoices.find(voice => 
                    voice.name.toLowerCase().includes('female') ||
                    voice.name.toLowerCase().includes('woman') ||
                    voice.name.toLowerCase().includes('girl') ||
                    voice.name.toLowerCase().includes('zira') ||
                    voice.name.toLowerCase().includes('hazel') ||
                    voice.name.toLowerCase().includes('susan') ||
                    voice.name.toLowerCase().includes('samantha')
                  );
                } else if (voiceGender === 'male') {
                  selectedVoice = languageVoices.find(voice => 
                    voice.name.toLowerCase().includes('male') ||
                    voice.name.toLowerCase().includes('man') ||
                    voice.name.toLowerCase().includes('david') ||
                    voice.name.toLowerCase().includes('mark') ||
                    voice.name.toLowerCase().includes('alex')
                  );
                }
              }
              
              // Nếu không tìm thấy theo gender, lấy voice tốt nhất của ngôn ngữ đó
              if (!selectedVoice) {
                // Ưu tiên Google/Microsoft voices
                selectedVoice = languageVoices.find(voice => 
                  voice.name.toLowerCase().includes('google') || voice.name.toLowerCase().includes('microsoft')
                ) || languageVoices[0];
              }
            } else {
              // Không có voice cho ngôn ngữ này, fallback sang English
              console.warn(`No voice found for language ${targetLang}, falling back to English`);
              if (voiceGender === 'female') {
                selectedVoice = voices.find(voice => 
                  voice.lang.includes('en') && (
                    voice.name.toLowerCase().includes('female') ||
                    voice.name.toLowerCase().includes('woman') ||
                    voice.name.toLowerCase().includes('zira') ||
                    voice.name.toLowerCase().includes('samantha')
                  )
                );
              } else if (voiceGender === 'male') {
                selectedVoice = voices.find(voice => 
                  voice.lang.includes('en') && (
                    voice.name.toLowerCase().includes('male') ||
                    voice.name.toLowerCase().includes('man') ||
                    voice.name.toLowerCase().includes('david') ||
                    voice.name.toLowerCase().includes('mark')
                  )
                );
              }
            }

            // Nếu vẫn không tìm thấy, dùng voice đầu tiên
            if (!selectedVoice) {
              selectedVoice = voices.find(voice => voice.lang.includes(targetLang.split('-')[0])) || voices[0];
            }

            utterance.voice = selectedVoice;
            utterance.lang = targetLang; // Set language explicitly
            console.log('Selected voice:', selectedVoice?.name, selectedVoice?.lang, 'for language:', targetLang);
          }

          // Cấu hình giọng nói - tối ưu cho tiếng Việt
          // ✅ Tăng rate lên 1.0 (tiếng Việt cần nói nhanh hơn để rõ ràng)
          utterance.rate = targetLang === 'vi-VN' ? 1.0 : 0.95;
          // ✅ Pitch trung bình hơn cho tiếng Việt (1.0 = tự nhiên nhất)
          utterance.pitch = targetLang === 'vi-VN' ? 1.0 : (voiceGender === 'female' ? 1.2 : 0.8);
          utterance.volume = 1;

          utterance.onstart = () => {
            console.log('Speech started');
            this.emit('speechStart');
          };

          utterance.onend = () => {
            console.log('Speech ended');
            this.currentUtterance = null;
            this.emit('speechEnd');
            resolve();
          };

          utterance.onerror = (error) => {
            // Silently handle common speech synthesis errors
            if (error.error === 'interrupted' || error.error === 'canceled') {
              console.log('Speech interrupted/canceled (normal behavior)');
            } else {
              console.warn('Speech error:', error.error);
            }
            this.currentUtterance = null;
            this.emit('speechError', error);
            // Don't reject on error, resolve instead to prevent promise rejections
            resolve();
          };

          this.synthesis.speak(utterance);
        };

        // Kiểm tra xem voices đã load chưa
        if (this.synthesis.getVoices().length > 0) {
          setVoice();
        } else {
          // Đợi voices load
          this.synthesis.onvoiceschanged = setVoice;
        }

      } catch (error) {
        console.error('Speech synthesis error:', error);
        reject(error);
      }
    });
  }

  stop(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.currentUtterance = null;
      this.emit('speechEnd');
    }
  }

  private emit(event: string, data?: any) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => callback(data));
    }
  }

  on(event: string, callback: Function) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  removeListener(event: string, callback: Function) {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
    }
  }
}
export default SpeechSynthesisManager;
