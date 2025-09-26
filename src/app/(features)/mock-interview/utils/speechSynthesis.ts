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

  async speak(text: string, voiceGender?: string): Promise<void> {
    if (!text || !text.trim()) {
      console.warn('No text to speak');
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        // Dừng speech hiện tại
        this.stop();

        const utterance = new SpeechSynthesisUtterance(text.trim());
        this.currentUtterance = utterance;

        // Đợi voices load xong
        const setVoice = () => {
          const voices = this.synthesis.getVoices();
          console.log('Available voices:', voices.map(v => ({ name: v.name, gender: v.name, lang: v.lang })));

          if (voices.length > 0) {
            let selectedVoice;

            if (voiceGender === 'female') {
              // Tìm giọng nữ
              selectedVoice = voices.find(voice => 
                voice.name.toLowerCase().includes('female') ||
                voice.name.toLowerCase().includes('woman') ||
                voice.name.toLowerCase().includes('girl') ||
                voice.name.toLowerCase().includes('zira') ||
                voice.name.toLowerCase().includes('hazel') ||
                voice.name.toLowerCase().includes('susan') ||
                voice.name.toLowerCase().includes('samantha')
              );
            } else if (voiceGender === 'male') {
              // Tìm giọng nam
              selectedVoice = voices.find(voice => 
                voice.name.toLowerCase().includes('male') ||
                voice.name.toLowerCase().includes('man') ||
                voice.name.toLowerCase().includes('david') ||
                voice.name.toLowerCase().includes('mark') ||
                voice.name.toLowerCase().includes('alex')
              );
            }

            // Nếu không tìm thấy, dùng voice đầu tiên tiếng Anh
            if (!selectedVoice) {
              selectedVoice = voices.find(voice => voice.lang.includes('en')) || voices[0];
            }

            utterance.voice = selectedVoice;
            console.log('Selected voice:', selectedVoice?.name, selectedVoice?.lang);
          }

          // Cấu hình giọng nói
          utterance.rate = 0.9;
          utterance.pitch = voiceGender === 'female' ? 1.2 : 0.8; // Nữ cao hơn, nam thấp hơn
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
            console.error('Speech error:', error);
            this.currentUtterance = null;
            this.emit('speechError', error);
            reject(error);
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
