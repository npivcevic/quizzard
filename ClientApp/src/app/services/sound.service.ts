import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SoundService {
  public isSoundOn = true;
  public isSfxOn = true;

  isBackgroundMusicEnabledStorageKey = 'isMusicEnabled';
  isSfxEnabledStorageKey = 'isSfxEnabled';

  loadedSounds: { [key: string]: HTMLAudioElement } = {};

  constructor() {
    const isSoundEnabled = localStorage.getItem(
      this.isBackgroundMusicEnabledStorageKey
    );
    if (isSoundEnabled === 'false') {
      this.isSoundOn = false;
    }
    if (this.isSoundOn) {
      this.playBackgroundMusic()
    }

    const isSfxEnabled = localStorage.getItem(
      this.isSfxEnabledStorageKey
    );
    if (isSfxEnabled === 'false') {
      this.isSfxOn = false;
    }
  }

  public toggleSound() {
    this.isSoundOn = !this.isSoundOn;
    this.isSoundOn
      ? this.playBackgroundMusic()
      : this.stopBackgroundMusic()
    localStorage.setItem(
      this.isBackgroundMusicEnabledStorageKey,
      this.isSoundOn ? 'true' : 'false'
    );
  }

  public toggleSfx() {
    this.isSfxOn = !this.isSfxOn;
    localStorage.setItem(
      this.isSfxEnabledStorageKey,
      this.isSfxOn ? 'true' : 'false'
    );
  }

  preloadAllSounds() {
    Object.values(Sound).forEach(s => {
      this.loadSound(s);
    });
  }

  vibrate() {
    navigator.vibrate(30);
  }

  playSound(sound: Sound) {
    if (!this.isSfxOn) {
      return;
    }
    if (!this.loadedSounds[sound]) {
      this.loadSound(sound);
    }
    this.loadedSounds[sound].currentTime = 0
    this.loadedSounds[sound].play()
  }

  stopSound(sound: Sound) {
    if (!this.loadedSounds[sound]) {
      return;
    }
    this.loadedSounds[sound].pause()
  }

  loadSound(sound: Sound) {
    let audio = new Audio();
    audio.src = environment.fileStorageUrl + Sounds[sound].url
    audio.load();
    this.loadedSounds[sound] = audio;
    this.loadedSounds[sound].volume = Sounds[sound].volume
  }

  playBackgroundMusic() {
    if (!this.isSoundOn) {
      return
    }

    let sound = Sound.BackGroundMusic01;
    if (!this.loadedSounds[sound]) {
      this.loadSound(sound)
    }
    this.loadedSounds[sound].loop = true;
    this.loadedSounds[sound].volume = 0.10
    this.loadedSounds[sound].play()
  }

  stopBackgroundMusic() {
    this.stopSound(Sound.BackGroundMusic01)
  }
}

export enum Sound {
  BackGroundMusic01 = 'BackGroundMusic01',
  QuestionTransition01 = 'QuestionTransition01',
  AnswerReveal01 = 'AnswerReveal01',
  PlayerAnswered01 = 'PlayerAnswered01',
}

const Sounds = {
  'BackGroundMusic01': {
    url: '/static/background_music_01.mp3',
    volume: 0.10
  },
  'QuestionTransition01': {
    url: '/static/question_transition_01.mp3',
    volume: 0.3
  },
  'AnswerReveal01': {
    url: '/static/answer_reveal_01.mp3',
    volume: 1
  },
  'PlayerAnswered01': {
    url: '/static/player_answered_01.mp3',
    volume: 0.05
  },
}
