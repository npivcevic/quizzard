import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SoundService {
  public isSoundOn = true;
  public isBackgroundMusicOn = true;
  isSoundEnabledLocalStorageKey = 'isSoundEnabled';

  loadedSounds: { [key: string]: HTMLAudioElement } = {};

  constructor() {
    const isSoundEnabled = localStorage.getItem(
      this.isSoundEnabledLocalStorageKey
    );
    if (isSoundEnabled === 'false') {
      this.isSoundOn = false;
    }
    // this.preloadAllSounds();
  }

  public toggleSound() {
    this.isSoundOn = !this.isSoundOn;
    this.handleBackgroundMusic();
    localStorage.setItem(
      this.isSoundEnabledLocalStorageKey,
      this.isSoundOn ? 'true' : 'false'
    );
  }

  public handleBackgroundMusic() {
    if (!this.isSoundOn || !this.isBackgroundMusicOn) {
      this.stopSound(Sound.BackGroundMusic01)
      return;
    }
    if (this.isSoundOn && this.isBackgroundMusicOn) {
      this.playSound(Sound.BackGroundMusic01, true)
    }
  }

  preloadAllSounds() {
    Object.values(Sound).forEach(s => {
      this.loadSound(s);
    });
  }

  vibrate() {
    navigator.vibrate(30);
  }

  playSound(sound: Sound, loop: boolean = false) {
    if (!this.isSoundOn) {
      return;
    }
    if (!this.loadedSounds[sound]) {
      this.loadSound(sound);
    }
    this.loadedSounds[sound].loop = loop
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
    audio.src = environment.fileStorageUrl + sound;
    audio.load();
    this.loadedSounds[sound] = audio;
  }

  playBackgroundMusic() {
    this.isBackgroundMusicOn = true;
    this.handleBackgroundMusic();
  }

  stopBackgroundMusic() {
    this.isBackgroundMusicOn = false;
    this.handleBackgroundMusic()
  }
}

export enum Sound {
  BackGroundMusic01 = '/static/background_music_01.mp3',
}